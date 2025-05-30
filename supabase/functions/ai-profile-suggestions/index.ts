
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { partialProfile } = await req.json();
    
    // Generate suggestions based on profile data
    const suggestions = generateProfileSuggestions(partialProfile);
    
    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-profile-suggestions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateProfileSuggestions(partialProfile: any) {
  const genre = partialProfile.genre?.toLowerCase() || '';
  const existingThemes = partialProfile.themes || [];
  const existingMechanics = partialProfile.mechanics || [];
  
  const suggestions = {
    themes: [] as string[],
    mechanics: [] as string[],
    tone: [] as string[],
    targetAudience: [] as string[],
    uniqueFeatures: [] as string[]
  };

  // Genre-based theme suggestions
  const genreThemeMap: Record<string, string[]> = {
    'rpg': ['Fantasy', 'Character Development', 'Epic Journey', 'Magic', 'Quests'],
    'puzzle': ['Problem Solving', 'Logic', 'Brain Training', 'Pattern Recognition', 'Minimalist'],
    'action': ['Fast-paced', 'Combat', 'Reflexes', 'Adrenaline', 'Competition'],
    'strategy': ['Planning', 'Resource Management', 'Tactical', 'Empire Building', 'Decision Making'],
    'simulation': ['Realistic', 'Management', 'Building', 'Economics', 'Life-like'],
    'adventure': ['Exploration', 'Story-driven', 'Discovery', 'Journey', 'Mystery'],
    'horror': ['Dark', 'Suspense', 'Fear', 'Supernatural', 'Psychological'],
    'racing': ['Speed', 'Competition', 'Vehicles', 'Tracks', 'Performance'],
    'sports': ['Athletics', 'Team-based', 'Competition', 'Skills', 'Tournament'],
    'platformer': ['Jumping', 'Precise Movement', 'Obstacles', 'Collectibles', 'Level-based']
  };

  // Genre-based mechanic suggestions
  const genreMechanicMap: Record<string, string[]> = {
    'rpg': ['Turn-based Combat', 'Skill Trees', 'Character Customization', 'Inventory Management', 'Dialogue Choices'],
    'puzzle': ['Pattern Recognition', 'Progressive Difficulty', 'Hint System', 'Time Challenges', 'Logic Gates'],
    'action': ['Real-time Combat', 'Combo System', 'Power-ups', 'Dodging', 'Weapon Variety'],
    'strategy': ['Resource Collection', 'Unit Management', 'Base Building', 'Tech Trees', 'Turn-based Planning'],
    'simulation': ['Real-time Management', 'Economic Systems', 'Construction', 'Automation', 'Statistics Tracking'],
    'adventure': ['Point-and-click', 'Inventory Puzzles', 'Story Progression', 'Exploration', 'Interactive Dialogue'],
    'horror': ['Stealth Mechanics', 'Limited Resources', 'Atmosphere Building', 'Jump Scares', 'Sanity System'],
    'racing': ['Vehicle Customization', 'Track Design', 'Time Trials', 'Multiplayer Racing', 'Physics Engine'],
    'sports': ['Team Management', 'Skill Development', 'Tournament Modes', 'Statistics', 'Training Systems'],
    'platformer': ['Precise Jumping', 'Collectible Items', 'Moving Platforms', 'Enemy Avoidance', 'Level Progression']
  };

  // Add genre-specific suggestions
  if (genre && genreThemeMap[genre]) {
    suggestions.themes = genreThemeMap[genre].filter(theme => !existingThemes.includes(theme));
  }

  if (genre && genreMechanicMap[genre]) {
    suggestions.mechanics = genreMechanicMap[genre].filter(mechanic => !existingMechanics.includes(mechanic));
  }

  // Tone suggestions based on genre
  const genreToneMap: Record<string, string[]> = {
    'rpg': ['Epic and Heroic', 'Dramatic', 'Atmospheric'],
    'puzzle': ['Relaxing', 'Satisfying', 'Meditative'],
    'action': ['Intense', 'Fast-paced', 'Adrenaline-pumping'],
    'horror': ['Dark and Serious', 'Suspenseful', 'Atmospheric'],
    'adventure': ['Mysterious', 'Epic and Heroic', 'Whimsical'],
    'simulation': ['Realistic', 'Detailed', 'Engaging']
  };

  if (genre && genreToneMap[genre]) {
    suggestions.tone = genreToneMap[genre];
  }

  // Target audience suggestions
  suggestions.targetAudience = [
    'Casual gamers looking for accessible gameplay',
    'Hardcore enthusiasts seeking deep mechanics',
    'Story-driven players who enjoy narrative',
    'Competitive players who like challenges',
    'Social gamers who enjoy multiplayer experiences'
  ];

  return suggestions;
}
