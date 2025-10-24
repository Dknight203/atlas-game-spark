import { useState } from 'react';
import { checkLimit, type LimitCheckResult } from '@/modules/limits/withLimit';
import { type CounterKey } from '@/modules/limits/counters';

export function useLimitCheck() {
  const [isChecking, setIsChecking] = useState(false);

  const checkFeatureLimit = async (
    orgId: string,
    feature: CounterKey
  ): Promise<LimitCheckResult> => {
    setIsChecking(true);
    try {
      return await checkLimit(orgId, feature);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkFeatureLimit,
    isChecking
  };
}
