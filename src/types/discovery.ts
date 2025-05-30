
export interface DiscoveryList {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  filters: Record<string, any>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataSource {
  id: string;
  source_name: string;
  platform: string;
  last_updated?: string;
  data_quality_score: number;
  is_active: boolean;
  refresh_interval_hours: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ConversionEvent {
  id: string;
  project_id: string;
  game_id: string;
  event_type: 'discovery' | 'view' | 'click' | 'download' | 'purchase';
  platform: string;
  user_segment: string;
  event_date: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface MarketPrediction {
  id: string;
  game_id: string;
  platform: string;
  prediction_type: 'revenue' | 'downloads' | 'rating' | 'market_share';
  predicted_value: number;
  confidence_score: number;
  prediction_date: string;
  model_version: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface EnhancedGameData {
  id: string;
  game_id: string;
  name: string;
  platform: string;
  genre: string[];
  tags: string[];
  release_date?: string;
  developer?: string;
  publisher?: string;
  price?: number;
  rating_average?: number;
  review_count?: number;
  download_count?: number;
  revenue_estimate?: number;
  player_retention_d1?: number;
  player_retention_d7?: number;
  player_retention_d30?: number;
  last_updated?: string;
  data_source_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface DiscoveryFilters {
  platforms?: string[];
  genres?: string[];
  tags?: string[];
  priceRange?: [number, number];
  ratingRange?: [number, number];
  releaseYearRange?: [number, number];
  downloadRange?: [number, number];
  revenueRange?: [number, number];
  retentionRange?: [number, number];
  developers?: string[];
  publishers?: string[];
}
