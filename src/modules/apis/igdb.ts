import { supabase } from '@/integrations/supabase/client';

export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ id: number; name: string }>;
  tags?: number[];
  cover?: { url: string };
  rating?: number;
  release_dates?: Array<{ date: number }>;
}

export async function searchIGDB(query: string): Promise<IGDBGame[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-game-data', {
      body: { source: 'igdb', query, limit: 20 }
    });

    if (error) throw error;
    return data?.results || [];
  } catch (error) {
    console.error('IGDB search error:', error);
    return [];
  }
}

export async function getIGDBGameById(id: number): Promise<IGDBGame | null> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-game-data', {
      body: { source: 'igdb', id }
    });

    if (error) throw error;
    return data?.game || null;
  } catch (error) {
    console.error('IGDB fetch error:', error);
    return null;
  }
}
