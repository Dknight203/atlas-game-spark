
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
          .order('metric_date', { ascending: false });

        if (analyticsError) throw analyticsError;

        // Fetch competitor data
        const { data: competitors, error: competitorsError } = await supabase
          .from('competitor_tracking')
          .select('*')
          .eq('project_id', projectId)
          .order('last_updated', { ascending: false });

        if (competitorsError) throw competitorsError;

        // Fetch user analytics
        const { data: userStats, error: userStatsError } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('project_id', projectId)
          .order('date_recorded', { ascending: false });

        if (userStatsError) throw userStatsError;

        setAnalyticsData(analytics || []);
        setCompetitorData(competitors || []);
        setUserAnalytics(userStats || []);

        // If no data exists, populate with sample data
        if (!analytics?.length && !competitors?.length && !userStats?.length) {
          await populateSampleData(projectId);
        }

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

  const populateSampleData = async (projectId: string) => {
    try {
      // Sample analytics data
      const sampleAnalytics = [
        { project_id: projectId, metric_type: 'revenue', metric_value: 15000, metric_date: '2024-01-01', source: 'steam' },
        { project_id: projectId, metric_type: 'downloads', metric_value: 5000, metric_date: '2024-01-01', source: 'steam' },
        { project_id: projectId, metric_type: 'ratings', metric_value: 4.2, metric_date: '2024-01-01', source: 'steam' },
      ];

      // Sample competitor data
      const sampleCompetitors = [
        {
          project_id: projectId,
          competitor_name: 'Similar Indie Game',
          platform: 'Steam',
          current_rank: 15,
          previous_rank: 18,
          downloads_estimate: 25000,
          revenue_estimate: 75000,
          rating_average: 4.5,
          review_count: 1250
        }
      ];

      // Sample user analytics
      const sampleUserAnalytics = [
        { project_id: projectId, metric_name: 'retention_d1', metric_value: 0.65, user_segment: 'all', date_recorded: '2024-01-01' },
        { project_id: projectId, metric_name: 'retention_d7', metric_value: 0.35, user_segment: 'all', date_recorded: '2024-01-01' },
        { project_id: projectId, metric_name: 'retention_d30', metric_value: 0.15, user_segment: 'all', date_recorded: '2024-01-01' },
        { project_id: projectId, metric_name: 'session_length', metric_value: 25.5, user_segment: 'all', date_recorded: '2024-01-01' },
        { project_id: projectId, metric_name: 'ltv', metric_value: 12.50, user_segment: 'paying_users', date_recorded: '2024-01-01' },
      ];

      await Promise.all([
        supabase.from('analytics_data').insert(sampleAnalytics),
        supabase.from('competitor_tracking').insert(sampleCompetitors),
        supabase.from('user_analytics').insert(sampleUserAnalytics)
      ]);

      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error('Error populating sample data:', error);
    }
  };

  return {
    analyticsData,
    competitorData,
    userAnalytics,
    isLoading,
    refetch: () => window.location.reload()
  };
};
