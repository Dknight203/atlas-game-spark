import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SERVER_SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL or SERVER_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Starting seed...');

  try {
    // Create test organizations for each plan
    const plans = ['starter', 'professional', 'studio', 'enterprise'];
    const orgs: any[] = [];

    for (const plan of plans) {
      const { data: org, error } = await supabase
        .from('organizations')
        .insert({
          name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Test Org`,
          description: `Test organization for ${plan} plan`,
          plan,
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${plan} org:`, error);
        continue;
      }

      console.log(`Created ${plan} organization:`, org.id);
      orgs.push(org);

      // Create a sample game for each org
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert({
          org_id: org.id,
          title: `Sample Game for ${plan}`,
          platforms: JSON.stringify(['PC', 'Console']),
          genres: JSON.stringify(['Action', 'Adventure']),
          tags: JSON.stringify(['Indie', 'Single Player']),
        })
        .select()
        .single();

      if (gameError) {
        console.error(`Error creating game for ${plan} org:`, gameError);
        continue;
      }

      console.log(`Created sample game for ${plan}:`, game.id);

      // Create 10 fake creators for each org
      const creators = [];
      const platforms = ['YouTube', 'Twitch', 'TikTok', 'Twitter', 'Instagram'];
      
      for (let i = 0; i < 10; i++) {
        creators.push({
          org_id: org.id,
          platform: platforms[i % platforms.length],
          external_id: `creator_${plan}_${i}`,
          handle: `@${plan}Creator${i}`,
          url: `https://${platforms[i % platforms.length].toLowerCase()}.com/${plan}creator${i}`,
          stats: JSON.stringify({
            subscribers: Math.floor(Math.random() * 100000) + 1000,
            avgViews: Math.floor(Math.random() * 50000) + 500,
            engagement: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          }),
        });
      }

      const { error: creatorsError } = await supabase
        .from('creators')
        .insert(creators);

      if (creatorsError) {
        console.error(`Error creating creators for ${plan} org:`, creatorsError);
      } else {
        console.log(`Created 10 creators for ${plan} org`);
      }

      // Create 5 fake community opportunities for each game
      const opportunities = [];
      const communityPlatforms = ['Reddit', 'Discord', 'Steam', 'Twitter'];
      
      for (let i = 0; i < 5; i++) {
        opportunities.push({
          game_id: game.id,
          platform: communityPlatforms[i % communityPlatforms.length],
          title: `Community Opportunity ${i + 1} for ${plan}`,
          url: `https://reddit.com/r/gamedev/post_${plan}_${i}`,
          metrics: JSON.stringify({
            upvotes: Math.floor(Math.random() * 500) + 10,
            comments: Math.floor(Math.random() * 100) + 5,
            score: Math.floor(Math.random() * 100) + 50,
          }),
        });
      }

      const { error: opportunitiesError } = await supabase
        .from('community_opportunities')
        .insert(opportunities);

      if (opportunitiesError) {
        console.error(`Error creating opportunities for ${plan} org:`, opportunitiesError);
      } else {
        console.log(`Created 5 community opportunities for ${plan} org`);
      }

      // Create a sample campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          org_id: org.id,
          name: `Launch Campaign for ${plan}`,
          status: 'active',
        })
        .select()
        .single();

      if (campaignError) {
        console.error(`Error creating campaign for ${plan} org:`, campaignError);
        continue;
      }

      console.log(`Created campaign for ${plan}:`, campaign.id);

      // Create sample campaign posts
      const posts = [
        {
          campaign_id: campaign.id,
          game_id: game.id,
          channel: 'Twitter',
          planned_at: new Date(Date.now() + 86400000).toISOString(),
          copy: 'Excited to announce our new game!',
          status: 'planned',
        },
        {
          campaign_id: campaign.id,
          game_id: game.id,
          channel: 'Reddit',
          planned_at: new Date(Date.now() + 172800000).toISOString(),
          copy: 'Check out our gameplay trailer!',
          status: 'planned',
        },
      ];

      const { error: postsError } = await supabase
        .from('campaign_posts')
        .insert(posts);

      if (postsError) {
        console.error(`Error creating posts for ${plan} org:`, postsError);
      } else {
        console.log(`Created 2 campaign posts for ${plan} org`);
      }

      // Create sample marketing metrics
      const { error: metricsError } = await supabase
        .from('marketing_metrics')
        .insert({
          campaign_id: campaign.id,
          channel: 'Twitter',
          period_start: new Date(Date.now() - 604800000).toISOString().split('T')[0],
          period_end: new Date().toISOString().split('T')[0],
          impressions: Math.floor(Math.random() * 10000) + 1000,
          clicks: Math.floor(Math.random() * 500) + 50,
          conversions: Math.floor(Math.random() * 50) + 5,
          revenue: (Math.random() * 1000 + 100).toFixed(2),
        });

      if (metricsError) {
        console.error(`Error creating metrics for ${plan} org:`, metricsError);
      } else {
        console.log(`Created sample metrics for ${plan} org`);
      }
    }

    console.log('\\n✅ Seed completed successfully!');
    console.log(`Created ${orgs.length} organizations with sample data`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();