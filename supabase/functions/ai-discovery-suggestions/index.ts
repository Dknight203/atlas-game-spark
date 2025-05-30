
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentFilters } = await req.json();
    
    const suggestions = generateDiscoverySuggestions(currentFilters);
    
    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-discovery-suggestions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateDiscoverySuggestions(currentFilters: any) {
  const suggestions = {
    platforms: ['PC', 'Nintendo Switch', 'Mobile', 'PlayStation', 'Xbox'],
    genres: ['Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Simulation'],
    tags: ['Single-player', 'Multiplayer', 'Story Rich', 'Casual', 'Competitive'],
    priceRanges: [
      { label: 'Free', range: [0, 0] },
      { label: 'Budget ($1-$10)', range: [1, 10] },
      { label: 'Mid-range ($10-$30)', range: [10, 30] },
      { label: 'Premium ($30+)', range: [30, 100] }
    ],
    businessModels: ['Free-to-Play', 'Premium', 'Subscription', 'DLC']
  };

  // Filter out already selected options
  if (currentFilters.platforms) {
    suggestions.platforms = suggestions.platforms.filter(p => !currentFilters.platforms.includes(p));
  }
  
  if (currentFilters.genres) {
    suggestions.genres = suggestions.genres.filter(g => !currentFilters.genres.includes(g));
  }

  if (currentFilters.tags) {
    suggestions.tags = suggestions.tags.filter(t => !currentFilters.tags.includes(t));
  }

  return suggestions;
}
