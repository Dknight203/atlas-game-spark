
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Target, TrendingUp, Users, MessageSquare } from "lucide-react";

interface MarketingCampaignManagerProps {
  onCreateCampaign: () => void;
}

const MarketingCampaignManager = ({ onCreateCampaign }: MarketingCampaignManagerProps) => {
  const [activeCampaigns] = useState([
    {
      id: 1,
      name: "Launch Week Outreach",
      status: "Active",
      type: "Creator Partnership",
      progress: 65,
      responses: 8,
      totalOutreach: 15,
      estimatedReach: "45K",
      budget: "$800"
    },
    {
      id: 2,
      name: "Reddit Community Engagement",
      status: "Planning",
      type: "Community Posts",
      progress: 25,
      responses: 0,
      totalOutreach: 12,
      estimatedReach: "120K",
      budget: "Free"
    }
  ]);

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
          <Button onClick={onCreateCampaign} className="bg-atlas-purple hover:bg-atlas-purple/90">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({activeCampaigns.filter(c => c.status === "Active").length})</TabsTrigger>
            <TabsTrigger value="planning">Planning ({activeCampaigns.filter(c => c.status === "Planning").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed (3)</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeCampaigns.filter(c => c.status === "Active").map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.type}</p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span>{campaign.responses}/{campaign.totalOutreach} responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{campaign.estimatedReach} reach</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span>{campaign.progress}% complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span>{campaign.budget} budget</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-atlas-purple h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
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
            ))}
          </TabsContent>

          <TabsContent value="planning" className="space-y-4">
            {activeCampaigns.filter(c => c.status === "Planning").map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.type}</p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Setup in progress - defining target communities and content strategy</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-atlas-purple hover:bg-atlas-purple/90">
                    Continue Setup
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Campaign
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Completed campaigns will appear here with performance analytics</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketingCampaignManager;
