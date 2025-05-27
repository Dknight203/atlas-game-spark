
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

    if (!youtubeApiKey) {
      return new Response(
        JSON.stringify({ error: 'YouTube API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Searching YouTube for creators with queries:', searchQueries)

    const allCreators = []
    
    // Search for channels using each query
    for (const query of searchQueries) {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=5&key=${youtubeApiKey}`
        
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
              id: channelId,
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

            allCreators.push(creator)
          }
        }
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error)
      }
    }

    // Remove duplicates and sort by match score
    const uniqueCreators = allCreators.filter((creator, index, self) => 
      index === self.findIndex(c => c.id === creator.id)
    ).sort((a, b) => b.matchScore - a.matchScore)

    console.log(`Found ${uniqueCreators.length} unique creators`)

    return new Response(
      JSON.stringify({ creators: uniqueCreators.slice(0, 10) }), // Limit to top 10
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in search-youtube-creators function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to search YouTube creators', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function formatSubscriberCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}
