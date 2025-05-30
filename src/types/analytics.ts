
export interface AnalyticsData {
  id: string;
  project_id: string;
  metric_type: string;
  metric_value: number;
  metric_date: string;
  source: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CompetitorData {
  id: string;
  project_id: string;
  competitor_name: string;
  competitor_id?: string;
  platform: string;
  current_rank?: number;
  previous_rank?: number;
  downloads_estimate?: number;
  revenue_estimate?: number;
  rating_average?: number;
  review_count?: number;
  last_updated?: string;
  created_at: string;
}

export interface MarketTrend {
  id: string;
  genre: string;
  platform: string;
  trend_type: string;
  trend_value: number;
  trend_date: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserAnalytics {
  id: string;
  project_id: string;
  metric_name: string;
  metric_value: number;
  user_segment: string;
  date_recorded: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface NotificationPreference {
  id: string;
  project_id: string;
  notification_type: string;
  is_enabled: boolean;
  threshold_value?: number;
  email_enabled: boolean;
  in_app_enabled: boolean;
  created_at: string;
  updated_at: string;
}
