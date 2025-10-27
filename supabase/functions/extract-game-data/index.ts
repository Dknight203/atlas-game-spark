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
    const { url } = await req.json();
    console.log('Extracting game data from URL:', url);

    // Fetch the game store page
    const pageResponse = await fetch(url);
    const html = await pageResponse.text();
    
    // Extract text content (remove HTML tags for better processing)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 30000); // Limit to 30k chars

    console.log('Fetched page content, length:', textContent.length);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Step 1: Extract game name first
    console.log('Step 1: Extracting game name...');
    const nameResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract ONLY the game title from this store page. Return just the title text, nothing else.\n\n${textContent.substring(0, 5000)}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 100,
          }
        })
      }
    );

    if (!nameResponse.ok) {
      throw new Error('Failed to extract game name');
    }

    const nameData = await nameResponse.json();
    const gameName = nameData.candidates[0].content.parts[0].text.trim();
    console.log('Extracted game name:', gameName);

    // Step 2: Perform web search for additional context
    console.log('Step 2: Performing web search...');
    const searchQuery = `"${gameName}" video game platforms release date genres gameplay mechanics target audience themes`;
    const searchResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Search the web and provide comprehensive information about the video game "${gameName}". Include: all platforms it's available on (PC, consoles, mobile), genres, gameplay mechanics, themes, target audience, and unique features. Be thorough.`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1500,
          }
        })
      }
    );

    let webContext = '';
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      webContext = searchData.candidates[0].content.parts[0].text;
      console.log('Web search context obtained, length:', webContext.length);
    } else {
      console.log('Web search failed, continuing with store page only');
    }

    // Step 3: Combine data sources and extract complete information
    console.log('Step 3: Final extraction with combined context...');
    const combinedContext = `
STORE PAGE DATA:
${textContent}

ADDITIONAL WEB INFORMATION:
${webContext}
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract complete game information from the provided sources and return ONLY a valid JSON object (no markdown, no explanations).

CRITICAL PLATFORM REQUIREMENTS:
- Use ONLY these standardized platform names: "PC (Windows)", "PC (Mac)", "PC (Linux)", "Mobile (iOS)", "Mobile (Android)", "Nintendo Switch", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Web Browser", "VR (Meta Quest)", "VR (Steam VR)", "Cross-Platform"
- Include ALL platforms mentioned in either source
- If a game is on Steam but also released on consoles, include ALL platforms
- Be thorough - don't miss any platforms

Return this exact JSON structure:
{
  "name": "game title",
  "description": "2-3 sentence description covering what the game is about",
  "genre": "primary genre (Action, RPG, Strategy, Simulation, Puzzle, Adventure, Sports, Racing, Fighting, etc.)",
  "platforms": ["array of ALL platforms using standardized names above"],
  "genres": ["all applicable genre tags"],
  "tags": ["gameplay-related tags like 'multiplayer', 'story-rich', 'open-world', etc."],
  "themes": ["narrative/aesthetic themes like 'sci-fi', 'fantasy', 'horror', 'historical', etc."],
  "mechanics": ["core gameplay mechanics like 'turn-based', 'real-time', 'crafting', 'building', etc."],
  "tone": "overall mood/atmosphere (e.g., 'dark and atmospheric', 'lighthearted and humorous', 'epic and cinematic')",
  "targetAudience": "who this game is designed for (e.g., 'hardcore strategy fans', 'casual mobile gamers', 'competitive FPS players')",
  "uniqueFeatures": "what makes this game stand out from others in its genre"
}

Sources:
${combinedContext}`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Gemini API error:', error);
      throw new Error('Failed to extract game data');
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');

    const extractedText = geminiData.candidates[0].content.parts[0].text;
    
    // Remove markdown code blocks if present
    const cleanedText = extractedText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    console.log('Cleaned extracted text:', cleanedText);
    
    const gameData = JSON.parse(cleanedText);
    
    console.log('Successfully extracted game data:', gameData.name);

    return new Response(
      JSON.stringify({ success: true, data: gameData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error extracting game data:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to extract game data'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
