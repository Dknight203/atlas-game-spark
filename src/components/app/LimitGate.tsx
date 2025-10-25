import { useState } from 'react';
import { useLimitCheck } from '@/hooks/useLimitCheck';
import { useOrganizationWithLimits } from '@/hooks/useOrganizationWithLimits';
import { CounterKey } from '@/modules/limits/counters';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface LimitGateProps {
  feature: CounterKey;
  children: (props: { canProceed: () => Promise<boolean> }) => React.ReactNode;
}

export function LimitGate({ feature, children }: LimitGateProps) {
  const { data: org } = useOrganizationWithLimits();
  const { checkFeatureLimit } = useLimitCheck();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<any>(null);
  const { toast } = useToast();

  const canProceed = async () => {
    if (!org?.id) {
      toast({
        title: 'Organization Required',
        description: 'Please join or create an organization first',
        variant: 'destructive'
      });
      return false;
    }

    const result = await checkFeatureLimit(org.id, feature);
    setLastCheckResult(result);

    if (!result.allowed) {
      setShowUpgrade(true);
      return false;
    }

    if (result.softCapWarning && result.message) {
      toast({
        title: 'Approaching Limit',
        description: result.message,
        action: (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowUpgrade(true)}
          >
            Upgrade
          </Button>
        )
      });
    }

    return true;
  };

  return (
    <>
      {children({ canProceed })}
      
      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        currentPlan={org?.plan || 'starter'}
        feature={feature}
      />
    </>
  );
}
