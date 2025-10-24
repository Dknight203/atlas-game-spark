export type Plan = 'starter' | 'professional' | 'studio' | 'enterprise';

export interface PlanLimits {
  projects: number;
  users: number;
  crossMatches: number | 'unlimited';
  communityOpportunities: number | 'unlimited';
  creatorMatches: number | 'unlimited';
  aiVariationsPerPost: number;
  isSoft?: boolean; // For soft caps that allow exceed with warning
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  starter: {
    projects: 1,
    users: 1,
    crossMatches: 5,
    communityOpportunities: 10,
    creatorMatches: 15,
    aiVariationsPerPost: 3,
  },
  professional: {
    projects: 3,
    users: 5,
    crossMatches: 'unlimited',
    communityOpportunities: 50, // Soft cap
    creatorMatches: 100, // Soft cap
    aiVariationsPerPost: 10,
  },
  studio: {
    projects: 10,
    users: 15,
    crossMatches: 'unlimited',
    communityOpportunities: 200, // Soft cap
    creatorMatches: 500, // Soft cap
    aiVariationsPerPost: 10,
  },
  enterprise: {
    projects: Infinity,
    users: Infinity,
    crossMatches: 'unlimited',
    communityOpportunities: 'unlimited',
    creatorMatches: 'unlimited',
    aiVariationsPerPost: Infinity,
  },
};

// Soft cap thresholds (90% warning)
export const SOFT_CAP_WARN_THRESHOLD = 0.9;

// Features that have soft caps in professional and studio plans
export const SOFT_CAP_FEATURES = {
  professional: ['communityOpportunities', 'creatorMatches'],
  studio: ['communityOpportunities', 'creatorMatches'],
};

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.starter;
}

export function isUnlimited(limit: number | 'unlimited'): boolean {
  return limit === 'unlimited' || limit === Infinity;
}

export function hasSoftCap(plan: Plan, feature: string): boolean {
  const softFeatures = SOFT_CAP_FEATURES[plan as keyof typeof SOFT_CAP_FEATURES];
  return softFeatures ? softFeatures.includes(feature) : false;
}

export function shouldWarnSoftCap(usage: number, limit: number): boolean {
  if (limit === Infinity) return false;
  return usage >= limit * SOFT_CAP_WARN_THRESHOLD;
}
