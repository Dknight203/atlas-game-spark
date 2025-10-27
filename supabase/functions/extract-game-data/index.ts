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

    // Use Gemini to extract structured data
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract game information from this store page and return ONLY a valid JSON object (no markdown, no explanations). Include these fields:

{
  "name": "game title",
  "description": "brief description (2-3 sentences)",
  "genre": "primary genre",
  "platforms": ["platform1", "platform2"],
  "genres": ["genre1", "genre2"],
  "tags": ["tag1", "tag2", "tag3"],
  "themes": ["theme1", "theme2"],
  "mechanics": ["mechanic1", "mechanic2"],
  "tone": "overall tone/mood",
  "targetAudience": "target audience description",
  "uniqueFeatures": "what makes this game unique"
}

Store page content:
${textContent}`
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
    console.log('Gemini response:', JSON.stringify(geminiData));

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
