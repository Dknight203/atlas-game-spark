
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalytics } from "@/hooks/useAnalytics";
import MarketPerformance from "./MarketPerformance";
import CompetitorAnalysis from "./CompetitorAnalysis";
import PlayerBehaviorAnalytics from "./PlayerBehaviorAnalytics";
import MarketingIntelligence from "./MarketingIntelligence";

interface AnalyticsDashboardProps {
  projectId: string;
}

const AnalyticsDashboard = ({ projectId }: AnalyticsDashboardProps) => {
  const { analyticsData, competitorData, userAnalytics, isLoading } = useAnalytics(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
        <p className="ml-4 text-gray-600">Loading comprehensive analytics...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Game Analytics</CardTitle>
        <CardDescription>
          Complete market intelligence and performance analytics for your indie game
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market-performance" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="market-performance">Market Performance</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="player-behavior">Player Behavior</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Intelligence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market-performance">
            <MarketPerformance data={analyticsData} />
          </TabsContent>
          
          <TabsContent value="competitor-analysis">
            <CompetitorAnalysis data={competitorData} />
          </TabsContent>
          
          <TabsContent value="player-behavior">
            <PlayerBehaviorAnalytics data={userAnalytics} />
          </TabsContent>
          
          <TabsContent value="marketing">
            <MarketingIntelligence analyticsData={analyticsData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
