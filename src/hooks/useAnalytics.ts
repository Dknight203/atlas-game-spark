
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AnalyticsData, CompetitorData, UserAnalytics } from "@/types/analytics";

export const useAnalytics = (projectId: string) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);

        // Fetch analytics data
        const { data: analytics, error: analyticsError } = await supabase
          .from('analytics_data')
          .select('*')
          .eq('project_id', projectId)
          .order('metric_date', { ascending: false })
          .limit(100);

        if (analyticsError) throw analyticsError;

        // Fetch competitor data
        const { data: competitors, error: competitorsError } = await supabase
          .from('competitor_tracking')
          .select('*')
          .eq('project_id', projectId)
          .order('last_updated', { ascending: false })
          .limit(20);

        if (competitorsError) throw competitorsError;

        // Fetch user analytics
        const { data: userStats, error: userStatsError } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('project_id', projectId)
          .order('date_recorded', { ascending: false })
          .limit(50);

        if (userStatsError) throw userStatsError;

        // Type cast the results to match our interfaces
        setAnalyticsData((analytics || []).map(item => ({
          ...item,
          metadata: item.metadata as Record<string, any>
        })) as AnalyticsData[]);
        
        setCompetitorData(competitors || []);
        
        setUserAnalytics((userStats || []).map(item => ({
          ...item,
          metadata: item.metadata as Record<string, any>
        })) as UserAnalytics[]);

      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [projectId, toast]);

  return {
    analyticsData,
    competitorData,
    userAnalytics,
    isLoading,
    refetch: () => window.location.reload()
  };
};
