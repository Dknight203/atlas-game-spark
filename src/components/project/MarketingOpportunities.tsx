
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityFinderResults from "@/components/app/CommunityFinderResults";
import CreatorMatchResults from "@/components/app/CreatorMatchResults";
import SmartSuggestions from "@/components/ai/SmartSuggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, TrendingUp } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("communities");
  
  const handleMarketingSuggestionApply = (suggestion: any) => {
    // Handle marketing suggestion application
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
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="communities" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Communities
                  </TabsTrigger>
                  <TabsTrigger value="creators" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Creators
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="communities">
                  <CommunityFinderResults 
                    projectId={projectId} 
                    onCommunitiesUpdate={onCommunitiesUpdate}
                  />
                </TabsContent>

                <TabsContent value="creators">
                  <CreatorMatchResults 
                    projectId={projectId} 
                    onCreatorsUpdate={onCreatorsUpdate}
                  />
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
