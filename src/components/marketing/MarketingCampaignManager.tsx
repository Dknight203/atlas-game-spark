
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Target, TrendingUp, Users, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CampaignBuilder } from "./CampaignBuilder";
import { useToast } from "@/hooks/use-toast";

interface MarketingCampaignManagerProps {
  organizationId: string;
}

const MarketingCampaignManager = ({ organizationId }: MarketingCampaignManagerProps) => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, [organizationId]);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('org_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignCreated = () => {
    loadCampaigns();
  };

  const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "Planning") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Marketing Campaigns
            </CardTitle>
            <CardDescription>
              Manage your community and creator outreach campaigns
            </CardDescription>
          </div>
          <Button onClick={() => setShowBuilder(true)} className="bg-atlas-purple hover:bg-atlas-purple/90">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({campaigns.filter(c => c.status === "active").length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({campaigns.filter(c => c.status === "draft").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No campaigns yet. Create your first campaign to get started.</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.type}</p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Created {new Date(campaign.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Posts
                  </Button>
                </div>
              </div>
            ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {campaigns.filter(c => c.status === "active").length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active campaigns</p>
              </div>
            ) : (
              campaigns.filter(c => c.status === "active").map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {campaigns.filter(c => c.status === "draft").length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No draft campaigns</p>
              </div>
            ) : (
              campaigns.filter(c => c.status === "draft").map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-atlas-purple hover:bg-atlas-purple/90">
                      Continue Setup
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CampaignBuilder
        open={showBuilder}
        onOpenChange={setShowBuilder}
        organizationId={organizationId}
        onCampaignCreated={handleCampaignCreated}
      />
    </Card>
  );
};

export default MarketingCampaignManager;
