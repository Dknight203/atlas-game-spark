
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
    const { projectData } = await req.json();
    
    const recommendations = generateMarketingRecommendations(projectData);
    
    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-marketing-recommendations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateMarketingRecommendations(projectData: any) {
  const recommendations = {
    suggestedCreators: [
      {
        name: 'IndieGameReviewer',
        platform: 'YouTube',
        audienceSize: '50K-100K',
        relevanceScore: 85,
        reasoning: 'Focuses on indie games in your genre with engaged audience'
      },
      {
        name: 'GameDevCommunity',
        platform: 'Twitch',
        audienceSize: '25K-50K',
        relevanceScore: 78,
        reasoning: 'Streams indie game discoveries and has supportive community'
      }
    ],
    communityTargets: [
      {
        name: 'r/IndieGaming',
        platform: 'Reddit',
        memberCount: '500K+',
        engagementLevel: 'High',
        reasoning: 'Active community for indie game discoveries and feedback'
      },
      {
        name: 'Indie Game Developers',
        platform: 'Discord',
        memberCount: '50K+',
        engagementLevel: 'Very High',
        reasoning: 'Supportive community of developers and players'
      }
    ],
    marketingStrategies: [
      {
        strategy: 'Community Engagement',
        description: 'Actively participate in gaming communities and forums',
        expectedROI: 'Medium',
        difficulty: 'Easy'
      },
      {
        strategy: 'Influencer Outreach',
        description: 'Reach out to content creators for game coverage',
        expectedROI: 'High',
        difficulty: 'Medium'
      },
      {
        strategy: 'Social Media Campaigns',
        description: 'Create engaging content for social media platforms',
        expectedROI: 'Medium',
        difficulty: 'Easy'
      }
    ]
  };

  return recommendations;
}
