export interface RAWGGame {
  id: number;
  name: string;
  description?: string;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ platform: { id: number; name: string } }>;
  tags?: Array<{ id: number; name: string }>;
  background_image?: string;
  rating?: number;
  released?: string;
}

const RAWG_BASE = 'https://api.rawg.io/api';

export async function searchRAWG(query: string): Promise<RAWGGame[]> {
  const key = import.meta.env.VITE_RAWG_API_KEY;
  if (!key) {
    console.warn('RAWG API key not configured');
    return [];
  }

  try {
    const params = new URLSearchParams({
      key,
      search: query,
      page_size: '20'
    });
    
    const response = await fetch(`${RAWG_BASE}/games?${params}`);
    if (!response.ok) throw new Error(`RAWG error: ${response.status}`);
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('RAWG search error:', error);
    return [];
  }
}

export async function getRAWGGameById(id: number): Promise<RAWGGame | null> {
  const key = import.meta.env.VITE_RAWG_API_KEY;
  if (!key) return null;

  try {
    const response = await fetch(`${RAWG_BASE}/games/${id}?key=${key}`);
    if (!response.ok) throw new Error(`RAWG error: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('RAWG fetch error:', error);
    return null;
  }
}
