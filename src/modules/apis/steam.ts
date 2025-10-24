export interface SteamAppDetails {
  steam_appid: number;
  name: string;
  short_description?: string;
  detailed_description?: string;
  header_image?: string;
  genres?: Array<{ description: string }>;
  categories?: Array<{ description: string }>;
  release_date?: { date: string };
}

export interface SteamNewsItem {
  gid: string;
  title: string;
  url: string;
  contents: string;
  date: number;
}

const STEAM_BASE = 'https://store.steampowered.com/api';
const STEAM_NEWS_BASE = 'https://api.steampowered.com/ISteamNews';

export async function getSteamAppDetails(appid: number): Promise<SteamAppDetails | null> {
  try {
    const response = await fetch(`${STEAM_BASE}/appdetails?appids=${appid}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data[appid]?.success) return null;
    
    return data[appid].data;
  } catch (error) {
    console.error('Steam app details error:', error);
    return null;
  }
}

export async function getSteamNews(appid: number, count = 10): Promise<SteamNewsItem[]> {
  try {
    const params = new URLSearchParams({
      appid: appid.toString(),
      count: count.toString(),
      format: 'json'
    });
    
    const response = await fetch(`${STEAM_NEWS_BASE}/GetNewsForApp/v2/?${params}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.appnews?.newsitems || [];
  } catch (error) {
    console.error('Steam news error:', error);
    return [];
  }
}
