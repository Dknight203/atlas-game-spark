
import { Button } from "@/components/ui/button";
import { Rocket, Target, TrendingUp } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-atlas-purple/10 rounded-full flex items-center justify-center mx-auto">
          <Rocket className="w-8 h-8 text-atlas-purple" />
        </div>
        <h3 className="text-3xl font-bold text-atlas-purple">
          Let's Get You Started!
        </h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          GameAtlas helps indie developers find their perfect audience through AI-powered 
          marketing intelligence. Let's set up your first project in just a few steps.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 my-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Target className="w-6 h-6 text-atlas-teal mb-2 mx-auto" />
          <h4 className="font-semibold mb-1">Discover</h4>
          <p className="text-sm text-gray-600">Find communities and creators who love games like yours</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-atlas-teal mb-2 mx-auto" />
          <h4 className="font-semibold mb-1">Connect</h4>
          <p className="text-sm text-gray-600">Manage relationships and campaigns in one place</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Rocket className="w-6 h-6 text-atlas-teal mb-2 mx-auto" />
          <h4 className="font-semibold mb-1">Grow</h4>
          <p className="text-sm text-gray-600">Track ROI and optimize your marketing performance</p>
        </div>
      </div>

      <Button 
        onClick={onNext}
        className="bg-atlas-purple hover:bg-opacity-90 text-white px-8 py-3"
        size="lg"
      >
        Get Started
      </Button>
    </div>
  );
};

export default WelcomeStep;
