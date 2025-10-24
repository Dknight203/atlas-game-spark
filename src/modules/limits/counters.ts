import { supabase } from '@/integrations/supabase/client';

export type CounterKey =
  | 'cross_matches'
  | 'community_opportunities'
  | 'creator_matches'
  | 'ai_variations';

interface IncrementResult {
  success: boolean;
  currentCount: number;
  error?: string;
}

/**
 * Get current month period boundaries
 */
function getCurrentMonthPeriod(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

/**
 * Get usage count for an organization in current month
 */
export async function getUsageCount(
  orgId: string,
  key: CounterKey
): Promise<number> {
  const { start, end } = getCurrentMonthPeriod();

  const { data, error } = await supabase
    .from('usage_counters')
    .select('count')
    .eq('org_id', orgId)
    .eq('key', key)
    .gte('period_start', start.toISOString().split('T')[0])
    .lte('period_end', end.toISOString().split('T')[0])
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching usage count:', error);
    return 0;
  }

  return data?.count || 0;
}

/**
 * Increment usage counter for an organization
 */
export async function incrementUsage(
  orgId: string,
  key: CounterKey,
  amount: number = 1
): Promise<IncrementResult> {
  const { start, end } = getCurrentMonthPeriod();
  const periodStart = start.toISOString().split('T')[0];
  const periodEnd = end.toISOString().split('T')[0];

  try {
    // Try to get existing counter
    const { data: existing } = await supabase
      .from('usage_counters')
      .select('id, count')
      .eq('org_id', orgId)
      .eq('key', key)
      .eq('period_start', periodStart)
      .eq('period_end', periodEnd)
      .single();

    if (existing) {
      // Update existing counter
      const newCount = existing.count + amount;
      const { error } = await supabase
        .from('usage_counters')
        .update({
          count: newCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;

      return { success: true, currentCount: newCount };
    } else {
      // Create new counter for this month
      const { data, error } = await supabase
        .from('usage_counters')
        .insert({
          org_id: orgId,
          key,
          period_start: periodStart,
          period_end: periodEnd,
          count: amount,
        })
        .select('count')
        .single();

      if (error) throw error;

      return { success: true, currentCount: data.count };
    }
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return {
      success: false,
      currentCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all usage counts for an organization in current month
 */
export async function getAllUsageCounts(
  orgId: string
): Promise<Record<CounterKey, number>> {
  const { start, end } = getCurrentMonthPeriod();

  const { data, error } = await supabase
    .from('usage_counters')
    .select('key, count')
    .eq('org_id', orgId)
    .gte('period_start', start.toISOString().split('T')[0])
    .lte('period_end', end.toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching all usage counts:', error);
    return {
      cross_matches: 0,
      community_opportunities: 0,
      creator_matches: 0,
      ai_variations: 0,
    };
  }

  const counts: Record<string, number> = {};
  data?.forEach((row) => {
    counts[row.key] = row.count;
  });

  return {
    cross_matches: counts.cross_matches || 0,
    community_opportunities: counts.community_opportunities || 0,
    creator_matches: counts.creator_matches || 0,
    ai_variations: counts.ai_variations || 0,
  };
}

/**
 * Reset all counters for an organization (admin only)
 */
export async function resetUsageCounters(orgId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('usage_counters')
      .delete()
      .eq('org_id', orgId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error resetting usage counters:', error);
    return false;
  }
}
