import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SERVER_SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedProduction() {
  console.log('🌱 Starting production seed...');

  try {
    // Check if admin user exists
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'chrisley@aesopco.com')
      .single();

    if (!adminProfile) {
      console.error('❌ Admin user not found. Please sign up first.');
      return;
    }

    console.log('✅ Admin user found:', adminProfile.id);

    // Check if admin organization exists
    let { data: adminOrg } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('created_by', adminProfile.id)
      .single();

    if (!adminOrg) {
      // Create admin organization
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: 'GameAtlas Admin',
          description: 'Administrative organization for GameAtlas',
          plan: 'enterprise',
          created_by: adminProfile.id
        })
        .select()
        .single();

      if (orgError) {
        console.error('❌ Error creating organization:', orgError);
        return;
      }

      adminOrg = newOrg;
      console.log('✅ Created admin organization:', adminOrg.name);
    } else {
      console.log('✅ Admin organization exists:', adminOrg.name);
    }

    // Seed sample games
    const sampleGames = [
      {
        title: 'Indie Puzzle Adventure',
        org_id: adminOrg.id,
        genres: ['Puzzle', 'Adventure'],
        platforms: ['PC', 'Nintendo Switch'],
        tags: ['indie', 'casual', 'story-rich']
      },
      {
        title: 'Roguelike Dungeon Crawler',
        org_id: adminOrg.id,
        genres: ['Roguelike', 'Action'],
        platforms: ['PC', 'PlayStation', 'Xbox'],
        tags: ['roguelike', 'procedural', 'difficult']
      },
      {
        title: 'Cozy Life Sim',
        org_id: adminOrg.id,
        genres: ['Simulation', 'Casual'],
        platforms: ['PC', 'Mobile'],
        tags: ['cozy', 'relaxing', 'farming']
      }
    ];

    for (const game of sampleGames) {
      const { data: existingGame } = await supabase
        .from('games')
        .select('id')
        .eq('title', game.title)
        .eq('org_id', adminOrg.id)
        .single();

      if (!existingGame) {
        const { error } = await supabase
          .from('games')
          .insert(game);

        if (error) {
          console.error(`❌ Error creating game ${game.title}:`, error);
        } else {
          console.log(`✅ Created game: ${game.title}`);
        }
      } else {
        console.log(`ℹ️  Game already exists: ${game.title}`);
      }
    }

    console.log('✅ Production seed complete!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedProduction();
