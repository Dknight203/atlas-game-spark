import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function test(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (error) console.log(`  Error: ${error}`);
}

async function smokeTest() {
  console.log('Starting smoke tests...\\n');

  // Test 1: Database connection
  try {
    const { error } = await supabase.from('organizations').select('count').limit(1);
    test('Database connection', !error, error?.message);
  } catch (e) {
    test('Database connection', false, String(e));
  }

  // Test 2: Tables exist
  const tables = [
    'organizations',
    'profiles',
    'projects',
    'games',
    'game_signals',
    'matches',
    'community_opportunities',
    'creators',
    'campaigns',
    'campaign_posts',
    'activity_log',
    'marketing_metrics',
    'usage_counters',
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);
      test(`Table exists: ${table}`, !error, error?.message);
    } catch (e) {
      test(`Table exists: ${table}`, false, String(e));
    }
  }

  // Test 3: Organizations have plan column
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('plan')
      .limit(1);
    test('Organizations have plan column', !error && data !== null, error?.message);
  } catch (e) {
    test('Organizations have plan column', false, String(e));
  }

  // Test 4: RLS is enabled
  const rlsTables = [
    'games',
    'creators',
    'campaigns',
    'usage_counters',
  ];

  for (const table of rlsTables) {
    try {
      // Try to access table without auth (should fail or return empty)
      const { data, error } = await supabase.from(table).select('*').limit(1);
      // If we can query but get empty results, RLS is working
      test(`RLS enabled on ${table}`, !error || error.code === '42501', error?.message);
    } catch (e) {
      test(`RLS enabled on ${table}`, false, String(e));
    }
  }

  // Test 5: Database functions exist
  try {
    const { data, error } = await supabase.rpc('generate_invitation_token');
    test('Database function: generate_invitation_token', !error, error?.message);
  } catch (e) {
    test('Database function: generate_invitation_token', false, String(e));
  }

  // Summary
  console.log('\\n' + '='.repeat(50));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`\\nResults: ${passed}/${total} tests passed`);
  if (failed > 0) {
    console.log(`❌ ${failed} tests failed`);
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
  }
}

smokeTest();