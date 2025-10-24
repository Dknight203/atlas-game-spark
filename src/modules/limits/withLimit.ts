import { supabase } from '@/integrations/supabase/client';
import { getPlanLimits, isUnlimited, hasSoftCap, shouldWarnSoftCap } from './limits';
import { getUsageCount, incrementUsage, CounterKey } from './counters';
import type { Plan } from './limits';

export interface LimitCheckResult {
  allowed: boolean;
  softCapWarning?: boolean;
  currentUsage: number;
  limit: number | 'unlimited';
  message?: string;
  shouldShowUpgrade?: boolean;
}

/**
 * Get organization plan from database
 */
async function getOrgPlan(orgId: string): Promise<Plan> {
  const { data, error } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', orgId)
    .single();

  if (error || !data) {
    console.error('Error fetching org plan:', error);
    return 'starter'; // Default fallback
  }

  return (data.plan as Plan) || 'starter';
}

/**
 * Check if action is within plan limits
 */
export async function checkLimit(
  orgId: string,
  feature: CounterKey
): Promise<LimitCheckResult> {
  try {
    // Get organization plan
    const plan = await getOrgPlan(orgId);
    const limits = getPlanLimits(plan);

    // Get feature limit
    let featureLimit: number | 'unlimited';
    switch (feature) {
      case 'cross_matches':
        featureLimit = limits.crossMatches;
        break;
      case 'community_opportunities':
        featureLimit = limits.communityOpportunities;
        break;
      case 'creator_matches':
        featureLimit = limits.creatorMatches;
        break;
      case 'ai_variations':
        featureLimit = limits.aiVariationsPerPost;
        break;
      default:
        featureLimit = 0;
    }

    // Unlimited plans always allowed
    if (isUnlimited(featureLimit)) {
      return {
        allowed: true,
        currentUsage: 0,
        limit: 'unlimited',
      };
    }

    // Get current usage
    const currentUsage = await getUsageCount(orgId, feature);

    // Check soft cap
    const isSoftCap = hasSoftCap(plan, feature);
    if (isSoftCap) {
      const shouldWarn = shouldWarnSoftCap(
        currentUsage,
        featureLimit as number
      );

      return {
        allowed: true, // Soft cap always allows
        softCapWarning: shouldWarn,
        currentUsage,
        limit: featureLimit,
        message: shouldWarn
          ? `You are approaching your ${feature.replace('_', ' ')} limit (${currentUsage}/${featureLimit}). Consider upgrading for higher limits.`
          : undefined,
      };
    }

    // Hard cap check
    if (currentUsage >= (featureLimit as number)) {
      return {
        allowed: false,
        currentUsage,
        limit: featureLimit,
        shouldShowUpgrade: true,
        message: `You have reached your ${plan} plan limit for ${feature.replace('_', ' ')} (${currentUsage}/${featureLimit}). Upgrade to continue.`,
      };
    }

    return {
      allowed: true,
      currentUsage,
      limit: featureLimit,
    };
  } catch (error) {
    console.error('Error checking limit:', error);
    // On error, allow but log
    return {
      allowed: true,
      currentUsage: 0,
      limit: 0,
    };
  }
}

/**
 * Higher order function to wrap actions with limit checks
 */
export function withLimit<T extends (...args: any[]) => Promise<any>>(
  feature: CounterKey,
  action: T
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>) => {
    // Extract orgId from first arg (convention)
    const orgId = args[0];
    if (!orgId) {
      console.error('withLimit: orgId not provided');
      return null;
    }

    // Check limit
    const limitCheck = await checkLimit(orgId, feature);

    if (!limitCheck.allowed) {
      console.warn('Action blocked by limit:', limitCheck.message);
      throw new Error(limitCheck.message || 'Plan limit reached');
    }

    if (limitCheck.softCapWarning) {
      console.info('Soft cap warning:', limitCheck.message);
      // Log upsell event
      await logUpsellEvent(orgId, feature, limitCheck);
    }

    // Execute action
    const result = await action(...args);

    // Increment usage counter after successful action
    if (result !== null && result !== undefined) {
      await incrementUsage(orgId, feature);
    }

    return result;
  };
}

/**
 * Log upsell opportunity to activity log
 */
async function logUpsellEvent(
  orgId: string,
  feature: string,
  limitCheck: LimitCheckResult
): Promise<void> {
  try {
    await supabase.from('activity_log').insert({
      org_id: orgId,
      type: 'upsell_opportunity',
      meta: {
        feature,
        currentUsage: limitCheck.currentUsage,
        limit: limitCheck.limit,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error logging upsell event:', error);
  }
}
