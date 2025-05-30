
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  Target,
  Plus,
  Calendar,
  Mail,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import CommunityFinderResults from "@/components/app/CommunityFinderResults";
import CreatorMatchResults from "@/components/app/CreatorMatchResults";

interface MarketingOpportunitiesProps {
  projectId: string;
  onCommunitiesUpdate: (count: number) => void;
  onCreatorsUpdate: (count: number) => void;
}

const MarketingOpportunities = ({ 
  projectId, 
  onCommunitiesUpdate, 
  onCreatorsUpdate 
}: MarketingOpportunitiesProps) => {
  const [activeView, setActiveView] = useState("overview");

  const marketingStats = [
    {
      title: "Total Opportunities",
      value: "156",
      change: "+12%",
      icon: Target,
    },
    {
      title: "Communities Found",
      value: "89",
      change: "+8%", 
      icon: Users,
    },
    {
      title: "Creator Matches",
      value: "67",
      change: "+15%",
      icon: MessageSquare,
    },
    {
      title: "Campaign Ready",
      value: "23",
      change: "+5%",
      icon: Calendar,
    }
  ];

  const quickActions = [
    {
      title: "Start Outreach Campaign",
      description: "Begin reaching out to top-matched creators",
      icon: Mail,
      action: "start-campaign",
      variant: "default" as const,
    },
    {
      title: "Join Communities",
      description: "Engage with high-potential gaming communities",
      icon: Users,
      action: "join-communities", 
      variant: "outline" as const,
    },
    {
      title: "Create Content Calendar",
      description: "Plan your marketing content strategy",
      icon: Calendar,
      action: "content-calendar",
      variant: "outline" as const,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Marketing Overview */}
      {activeView === "overview" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Marketing Opportunities</h2>
            <p className="text-muted-foreground">
              Discover and manage communities and creators for your game marketing.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketingStats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600">{stat.change} this week</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Start your marketing campaigns with these recommended actions
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <Card key={action.action} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <action.icon className="h-6 w-6 text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{action.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {action.description}
                          </p>
                          <Button size="sm" variant={action.variant} className="w-full">
                            Get Started
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation to Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => setActiveView("communities")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Community Opportunities</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover gaming communities that match your target audience
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveView("creators")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Creator Partnerships</h3>
                    <p className="text-sm text-muted-foreground">
                      Find content creators and influencers for collaborations
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Communities Detail View */}
      {activeView === "communities" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Community Opportunities</h2>
              <p className="text-muted-foreground">
                Gaming communities that match your target audience
              </p>
            </div>
            <Button variant="outline" onClick={() => setActiveView("overview")}>
              Back to Overview
            </Button>
          </div>
          <CommunityFinderResults 
            projectId={projectId} 
            onCommunitiesUpdate={onCommunitiesUpdate} 
          />
        </div>
      )}

      {/* Creators Detail View */}
      {activeView === "creators" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Creator Partnerships</h2>
              <p className="text-muted-foreground">
                Content creators and influencers for your game
              </p>
            </div>
            <Button variant="outline" onClick={() => setActiveView("overview")}>
              Back to Overview
            </Button>
          </div>
          <CreatorMatchResults 
            projectId={projectId} 
            onCreatorsUpdate={onCreatorsUpdate} 
          />
        </div>
      )}
    </div>
  );
};

export default MarketingOpportunities;
