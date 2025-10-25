export const PLAN_CONFIG = {
  starter: {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for solo developers testing the waters',
    features: [
      '1 game project',
      '25 cross game matches per month',
      '50 community opportunities per month',
      '25 creator matches per month',
      'Basic analytics',
      'Email support'
    ],
    limits: {
      projects: 1,
      crossMatches: 25,
      communityOpportunities: 50,
      creatorMatches: 25,
      aiVariationsPerPost: 0
    }
  },
  professional: {
    name: 'Professional',
    price: '$49',
    period: 'per month',
    description: 'For indie studios ready to grow their audience',
    features: [
      '5 game projects',
      '500 cross game matches per month',
      '1,000 community opportunities per month',
      '500 creator matches per month',
      '3 AI copy variations per post',
      'Advanced analytics',
      'Priority email support',
      'Campaign management'
    ],
    limits: {
      projects: 5,
      crossMatches: 500,
      communityOpportunities: 1000,
      creatorMatches: 500,
      aiVariationsPerPost: 3
    },
    popular: true
  },
  studio: {
    name: 'Studio',
    price: '$149',
    period: 'per month',
    description: 'For growing studios managing multiple titles',
    features: [
      'Unlimited game projects',
      '2,000 cross game matches per month',
      '5,000 community opportunities per month',
      '2,000 creator matches per month',
      '10 AI copy variations per post',
      'Portfolio wide dashboards',
      'Automated campaign triggers',
      'Competitor intelligence',
      'Dedicated account manager'
    ],
    limits: {
      projects: 999,
      crossMatches: 2000,
      communityOpportunities: 5000,
      creatorMatches: 2000,
      aiVariationsPerPost: 10
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For publishers and large studios',
    features: [
      'Unlimited everything',
      'Custom integrations',
      'White label options',
      'API access',
      'Custom AI model training',
      'Multi region support',
      'SLA guarantees',
      '24/7 phone support'
    ],
    limits: {
      projects: 999999,
      crossMatches: 999999,
      communityOpportunities: 999999,
      creatorMatches: 999999,
      aiVariationsPerPost: 999999
    }
  }
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;
