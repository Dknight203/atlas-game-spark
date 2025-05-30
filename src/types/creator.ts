
export interface Creator {
  id: string;
  name: string;
  platform: string;
  subscribers: string;
  avgViews: string;
  engagement: string;
  matchScore: number;
  lastVideo: string;
  recentGames: string[];
  description: string;
  contactMethod?: string;
  channelUrl?: string;
  thumbnailUrl?: string;
}

export interface CreatorSearchResponse {
  creators: Creator[];
  error?: string;
}

export interface CreatorSearchParams {
  searchQueries: string[];
  genre: string;
  platform: string;
}
