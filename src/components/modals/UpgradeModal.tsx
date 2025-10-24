import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
  currentPlan?: string;
}

export function UpgradeModal({ open, onOpenChange, feature, currentPlan = 'Starter' }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleSeePlans = () => {
    onOpenChange(false);
    navigate('/pricing');
  };

  const benefits = [
    {
      icon: <Zap className="w-5 h-5 text-atlas-purple" />,
      text: 'More Cross Game Matches',
    },
    {
      icon: <Users className="w-5 h-5 text-atlas-purple" />,
      text: 'More Community Opportunities',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-atlas-purple" />,
      text: 'More Creator Matches with filters',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-atlas-purple" />,
      text: 'Advanced AI Copy Variations',
    },
  ];

  const additionalBenefits = [
    'Portfolio wide dashboards',
    'Automated campaign triggers',
    'Competitor intelligence',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            You have reached your current plan limit
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Upgrade to unlock more matches and opportunities for your game marketing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-r from-atlas-purple/10 to-purple-100 rounded-lg p-4 border border-atlas-purple/20">
            <p className="text-sm font-medium text-gray-700">
              {feature && `Your ${currentPlan} plan has reached its limit for ${feature}.`}
              {!feature && `Your ${currentPlan} plan has reached its usage limit.`}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-atlas-purple" />
              What you gain
            </h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">{benefit.icon}</div>
                  <span className="text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pl-8 space-y-2">
              {additionalBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-atlas-purple" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleSeePlans}
              className="w-full bg-atlas-purple hover:bg-atlas-purple/90"
              size="lg"
            >
              See Plans
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Not now
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Have questions?{' '}
              <a href="/contact" className="text-atlas-purple hover:underline font-medium">
                Contact sales
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
