
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommunityCard from "@/components/community/CommunityCard";
import EnhancedCreatorCard from "@/components/creator/EnhancedCreatorCard";
import MarketingCampaignManager from "@/components/marketing/MarketingCampaignManager";
import SmartSuggestions from "@/components/ai/SmartSuggestions";
import { Target, Users, TrendingUp, Plus, Calendar, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import existing hooks
import { useCreatorSearch } from "@/hooks/useCreatorSearch";

interface MarketingOpportunitiesProps {
  projectId: string;
  onCommunitiesUpdate?: (count: number) => void;
  onCreatorsUpdate?: (count: number) => void;
}

const MarketingOpportunities = ({ 
  projectId, 
  onCommunitiesUpdate, 
  onCreatorsUpdate 
}: MarketingOpportunitiesProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [organizationId, setOrganizationId] = useState<string>("");
  const { toast } = useToast();
  const { creators } = useCreatorSearch(projectId);

  useEffect(() => {
    loadOrganization();
  }, [projectId]);

  const loadOrganization = async () => {
    const { data } = await supabase
      .from('projects')
      .select('organization_id')
      .eq('id', projectId)
      .single();
    
    if (data?.organization_id) {
      setOrganizationId(data.organization_id);
    }
  };

  // Mock communities data - would come from existing hook
  const communities = [
    {
      id: "1",
      name: "r/indiegames",
      platform: "Reddit",
      members: "890K",
      activity: "Very High",
      relevance: 95,
      lastPost: "2 hours ago",
      description: "A place for indie game developers to share their work",
      tags: ["Indie", "Development", "Showcase"],
      url: "https://reddit.com/r/indiegames",
      guidelines: "Post only on weekends for game showcases. Include [DEV] tag and be active in comments."
    }
  ];

  const handleCreateCampaign = () => {
    toast({
      title: "Campaign Creator",
      description: "Opening campaign setup wizard...",
    });
  };

  const handleStartCreatorCampaign = (creator: any) => {
    toast({
      title: "Creator Campaign",
      description: `Starting outreach campaign for ${creator.name}`,
    });
  };

  const handleViewCreatorProfile = (creator: any) => {
    if (creator.channelUrl) {
      window.open(creator.channelUrl, '_blank');
    }
  };

  const handleViewCommunityGuidelines = (community: any) => {
    toast({
      title: `${community.name} Guidelines`,
      description: community.guidelines,
    });
  };

  const handleVisitCommunity = (community: any) => {
    if (community.url) {
      window.open(community.url, '_blank');
    }
  };

  const handleMarketingSuggestionApply = (suggestion: any) => {
    console.log('Marketing suggestion applied:', suggestion);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Marketing Opportunities
          </CardTitle>
          <CardDescription>
            Unified workflow for community engagement and creator partnerships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Campaigns
                  </TabsTrigger>
                  <TabsTrigger value="communities" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Communities ({communities.length})
                  </TabsTrigger>
                  <TabsTrigger value="creators" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Creators ({creators.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Active Campaigns</p>
                            <p className="text-2xl font-bold">2</p>
                          </div>
                          <Target className="w-8 h-8 text-atlas-purple" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Potential Reach</p>
                            <p className="text-2xl font-bold">165K</p>
                          </div>
                          <Users className="w-8 h-8 text-atlas-teal" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Response Rate</p>
                            <p className="text-2xl font-bold">53%</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Start creator outreach campaign</h4>
                          <p className="text-sm text-gray-600">5 high-match creators identified</p>
                        </div>
                        <Button size="sm" onClick={handleCreateCampaign}>
                          <Plus className="w-4 h-4 mr-2" />
                          Start Campaign
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Schedule community posts</h4>
                          <p className="text-sm text-gray-600">3 communities ready for engagement</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="campaigns">
                  {organizationId ? (
                    <MarketingCampaignManager organizationId={organizationId} />
                  ) : (
                    <div className="text-center py-8">Loading campaigns...</div>
                  )}
                </TabsContent>

                <TabsContent value="communities" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Community Opportunities</h3>
                      <p className="text-sm text-gray-600">
                        Prioritized by conversion potential and engagement fit
                      </p>
                    </div>
                    <Button size="sm" onClick={handleCreateCampaign}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post Campaign
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {communities.map((community) => (
                      <CommunityCard 
                        key={community.id} 
                        community={community}
                        onViewGuidelines={handleViewCommunityGuidelines}
                        onVisitCommunity={handleVisitCommunity}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="creators" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Creator Partnerships</h3>
                      <p className="text-sm text-gray-600">
                        Sorted by collaboration potential and audience match
                      </p>
                    </div>
                    <Button size="sm" onClick={handleCreateCampaign}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Outreach Campaign
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {creators.map((creator) => (
                      <EnhancedCreatorCard 
                        key={creator.id} 
                        creator={creator}
                        onStartCampaign={handleStartCreatorCampaign}
                        onViewProfile={handleViewCreatorProfile}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* AI Marketing Recommendations Sidebar */}
            <div className="lg:col-span-1">
              <SmartSuggestions
                type="marketing"
                data={{ projectId, activeTab }}
                onSuggestionApply={handleMarketingSuggestionApply}
                className="sticky top-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingOpportunities;
