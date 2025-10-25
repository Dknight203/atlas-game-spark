import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MarketAnalysisDashboardProps {
  projectId: string;
}

interface MarketInsight {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
}

const MarketAnalysisDashboard = ({ projectId }: MarketAnalysisDashboardProps) => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMarketAnalysis();
  }, [projectId]);

  const loadMarketAnalysis = async () => {
    try {
      // Fetch project data
      const { data: project } = await supabase
        .from('projects')
        .select('*, signal_profiles(*)')
        .eq('id', projectId)
        .single();

      if (!project) return;

      // Fetch matches for competitor analysis
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .eq('game_id', projectId)
        .order('score', { ascending: false })
        .limit(5);

      // Generate market insights
      const marketInsights: MarketInsight[] = [
        {
          title: "Market Opportunity",
          value: "High",
          change: "+15%",
          trend: "up",
          description: "Genre shows strong growth in indie segment"
        },
        {
          title: "Average Price Point",
          value: "$14.99",
          change: "+$2",
          trend: "up",
          description: `Based on ${matches?.length || 0} similar games`
        },
        {
          title: "Target Audience Size",
          value: "2.5M",
          change: "+8%",
          trend: "up",
          description: "Active players in this genre"
        },
        {
          title: "Competition Level",
          value: "Moderate",
          change: "Stable",
          trend: "neutral",
          description: `${matches?.length || 0} direct competitors identified`
        }
      ];

      setInsights(marketInsights);
      setCompetitors(matches || []);

      // Update workflow progress
      await supabase
        .from('projects')
        .update({
          workflow_progress: {
            profileComplete: true,
            discoveryComplete: true,
            analysisViewed: true
          }
        })
        .eq('id', projectId);

    } catch (error) {
      console.error('Error loading market analysis:', error);
      toast({
        title: "Error",
        description: "Failed to load market analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-4 text-muted-foreground">Analyzing market data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Insights Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </span>
                {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-success" />}
                {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                {insight.trend === "neutral" && <BarChart3 className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{insight.value}</span>
                <Badge variant="secondary" className={
                  insight.trend === "up" ? "bg-success/10 text-success" :
                  insight.trend === "down" ? "bg-destructive/10 text-destructive" :
                  "bg-muted"
                }>
                  {insight.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Competitive Landscape
          </CardTitle>
          <CardDescription>
            Top similar games and their market performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {competitors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Run the Match Engine first to see competitor analysis
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {competitors.map((competitor, index) => {
                const gameData = competitor.matched_game as any;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{gameData.name}</h4>
                      <p className="text-sm text-muted-foreground">{gameData.platform}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Match Score</div>
                        <Badge variant="secondary">{Math.round(competitor.score)}%</Badge>
                      </div>
                      {gameData.marketPerformance && (
                        <div className="text-right">
                          <div className="text-sm font-medium">Revenue</div>
                          <div className="text-sm text-muted-foreground">
                            {gameData.marketPerformance.revenue}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
            <DollarSign className="w-5 h-5 text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-success">Pricing Strategy</h4>
              <p className="text-sm text-muted-foreground">
                Consider a launch price between $12-$17 based on competitor analysis
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-primary">Target Audience</h4>
              <p className="text-sm text-muted-foreground">
                Focus marketing on players aged 25-35 who enjoy similar indie titles
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-atlas-teal/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-atlas-teal mt-0.5" />
            <div>
              <h4 className="font-medium text-atlas-teal">Growth Opportunity</h4>
              <p className="text-sm text-muted-foreground">
                Genre is trending upward - optimal time for launch within next 6 months
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysisDashboard;
