
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchQueries, genre, platform } = await req.json()
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')

    console.log('Searching for creators across platforms with queries:', searchQueries)

    const allCreators = []
    
    // Search YouTube if API key is available
    if (youtubeApiKey) {
      const youtubeCreators = await searchYouTubeCreators(searchQueries, youtubeApiKey)
      allCreators.push(...youtubeCreators)
    }

    // Add creators from other platforms (mock data for now)
    const otherPlatformCreators = generateOtherPlatformCreators(searchQueries, genre, platform)
    allCreators.push(...otherPlatformCreators)

    // Remove duplicates and sort by match score
    const uniqueCreators = allCreators.filter((creator, index, self) => 
      index === self.findIndex(c => c.id === creator.id)
    ).sort((a, b) => b.matchScore - a.matchScore)

    console.log(`Found ${uniqueCreators.length} unique creators across all platforms`)

    return new Response(
      JSON.stringify({ creators: uniqueCreators.slice(0, 15) }), // Increased limit for multiple platforms
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in search creators function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to search creators', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function searchYouTubeCreators(searchQueries: string[], youtubeApiKey: string) {
  const youtubeCreators = []
  
  for (const query of searchQueries) {
    try {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=3&key=${youtubeApiKey}`
      
      const searchResponse = await fetch(searchUrl)
      const searchData = await searchResponse.json()

      if (searchData.error) {
        console.error('YouTube API error:', searchData.error)
        continue
      }

      // Get detailed channel information for each result
      for (const item of searchData.items || []) {
        const channelId = item.id.channelId
        
        // Get channel statistics
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${youtubeApiKey}`
        const channelResponse = await fetch(channelUrl)
        const channelData = await channelResponse.json()

        if (channelData.items && channelData.items.length > 0) {
          const channel = channelData.items[0]
          const stats = channel.statistics
          
          // Calculate match score based on subscriber count and relevance
          const subscribers = parseInt(stats.subscriberCount) || 0
          const videos = parseInt(stats.videoCount) || 0
          
          let matchScore = 70 // Base score
          
          // Boost score based on subscriber count (sweet spot for indie games is 10K-100K)
          if (subscribers >= 5000 && subscribers <= 100000) {
            matchScore += 15
          } else if (subscribers >= 1000 && subscribers <= 5000) {
            matchScore += 10
          }
          
          // Boost if they have a good amount of content
          if (videos >= 50) {
            matchScore += 10
          }
          
          // Add some randomness to avoid always showing the same order
          matchScore += Math.floor(Math.random() * 10)

          const creator = {
            id: `yt_${channelId}`,
            name: channel.snippet.title,
            platform: "YouTube",
            subscribers: formatSubscriberCount(subscribers),
            avgViews: "N/A", // Would need additional API calls to calculate
            engagement: subscribers > 10000 ? "High" : subscribers > 1000 ? "Medium" : "Growing",
            matchScore: Math.min(matchScore, 95),
            lastVideo: "Recent", // Would need additional API calls to get exact data
            recentGames: ["Various Indie Games"], // Would need video analysis
            description: channel.snippet.description?.substring(0, 100) + "..." || "Gaming content creator",
            searchTerm: query,
            contactMethod: "YouTube channel about section or business email",
            channelUrl: `https://www.youtube.com/channel/${channelId}`,
            thumbnailUrl: channel.snippet.thumbnails?.default?.url || ""
          }

          youtubeCreators.push(creator)
        }
      }
    } catch (error) {
      console.error(`Error searching YouTube for query "${query}":`, error)
    }
  }

  return youtubeCreators
}

function generateOtherPlatformCreators(searchQueries: string[], genre: string, platform: string) {
  const creators = []
  
  // Twitch creators
  const twitchCreators = [
    {
      id: "twitch_1",
      name: "IndieStreamHub",
      platform: "Twitch",
      subscribers: "12.3K followers",
      avgViews: "850",
      engagement: "High",
      matchScore: 88,
      lastVideo: "Live now",
      recentGames: [`${genre} games`, "Indie showcases", "New releases"],
      description: "Indie game streamer focusing on unique and creative titles...",
      contactMethod: "Twitch whisper or business email in bio",
      channelUrl: "https://twitch.tv/indiestreamhub",
      thumbnailUrl: ""
    },
    {
      id: "twitch_2",
      name: "RetroPixelGamer",
      platform: "Twitch",
      subscribers: "8.7K followers",
      avgViews: "420",
      engagement: "Medium",
      matchScore: 82,
      lastVideo: "2 hours ago",
      recentGames: ["Pixel art games", `${genre} titles`, "Indie reviews"],
      description: "Retro-inspired indie games and pixel art appreciation...",
      contactMethod: "Discord or Twitch DMs",
      channelUrl: "https://twitch.tv/retropixelgamer",
      thumbnailUrl: ""
    }
  ]

  // TikTok creators
  const tiktokCreators = [
    {
      id: "tiktok_1",
      name: "GameDevBytes",
      platform: "TikTok",
      subscribers: "45.2K followers",
      avgViews: "12.5K",
      engagement: "Very High",
      matchScore: 91,
      lastVideo: "6 hours ago",
      recentGames: ["Quick game reviews", `${genre} highlights`, "Indie spotlights"],
      description: "Quick indie game reviews and dev insights in 60 seconds...",
      contactMethod: "TikTok DMs or email in bio",
      channelUrl: "https://tiktok.com/@gamedevbytes",
      thumbnailUrl: ""
    },
    {
      id: "tiktok_2",
      name: "IndieGameClips",
      platform: "TikTok",
      subscribers: "23.8K followers",
      avgViews: "7.2K",
      engagement: "High",
      matchScore: 85,
      lastVideo: "1 day ago",
      recentGames: ["Game highlights", "Hidden gems", `${genre} moments`],
      description: "Showcasing the best moments from indie games...",
      contactMethod: "TikTok comments or Instagram DM",
      channelUrl: "https://tiktok.com/@indiegameclips",
      thumbnailUrl: ""
    }
  ]

  // Twitter/X creators
  const twitterCreators = [
    {
      id: "twitter_1",
      name: "IndieGameSpotlight",
      platform: "Twitter",
      subscribers: "18.5K followers",
      avgViews: "2.1K",
      engagement: "High",
      matchScore: 86,
      lastVideo: "3 hours ago",
      recentGames: [`${genre} reviews`, "Indie news", "Dev interviews"],
      description: "Daily indie game discoveries and developer spotlights...",
      contactMethod: "Twitter DMs or email",
      channelUrl: "https://twitter.com/indiegamespotlight",
      thumbnailUrl: ""
    },
    {
      id: "twitter_2",
      name: "PixelCritic",
      platform: "Twitter",
      subscribers: "9.3K followers",
      avgViews: "850",
      engagement: "Medium",
      matchScore: 79,
      lastVideo: "1 day ago",
      recentGames: ["Game critiques", `${genre} analysis`, "Indie threads"],
      description: "In-depth indie game analysis and thoughtful critiques...",
      contactMethod: "Twitter thread replies or DM",
      channelUrl: "https://twitter.com/pixelcritic",
      thumbnailUrl: ""
    }
  ]

  // Instagram creators
  const instagramCreators = [
    {
      id: "instagram_1",
      name: "VisualGameArt",
      platform: "Instagram",
      subscribers: "32.1K followers",
      avgViews: "4.5K",
      engagement: "High",
      matchScore: 83,
      lastVideo: "5 hours ago",
      recentGames: ["Game art features", `${genre} aesthetics`, "Indie visuals"],
      description: "Showcasing beautiful art and visuals from indie games...",
      contactMethod: "Instagram DMs or email in bio",
      channelUrl: "https://instagram.com/visualgameart",
      thumbnailUrl: ""
    },
    {
      id: "instagram_2",
      name: "IndieGameStories",
      platform: "Instagram",
      subscribers: "15.7K followers",
      avgViews: "2.8K",
      engagement: "Medium",
      matchScore: 80,
      lastVideo: "8 hours ago",
      recentGames: ["Game stories", "Dev journeys", `${genre} features`],
      description: "Stories behind indie games and their creators...",
      contactMethod: "Instagram story replies or DM",
      channelUrl: "https://instagram.com/indiegamestories",
      thumbnailUrl: ""
    }
  ]

  // Add platform-specific randomization and match score adjustments
  creators.push(...twitchCreators, ...tiktokCreators, ...twitterCreators, ...instagramCreators)
  
  return creators.map(creator => ({
    ...creator,
    matchScore: Math.min(creator.matchScore + Math.floor(Math.random() * 8) - 4, 95)
  }))
}

function formatSubscriberCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}
