
import { Button } from "@/components/ui/button";
import { Search, Users, BarChart3, MessageSquare } from "lucide-react";

interface FeaturesOverviewStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const FeaturesOverviewStep = ({ onNext, onPrevious }: FeaturesOverviewStepProps) => {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-atlas-purple" />,
      title: "AI-Powered Discovery",
      description: "Find communities and creators who love games like yours using our advanced matching algorithms."
    },
    {
      icon: <Users className="w-6 h-6 text-atlas-purple" />,
      title: "Relationship Management",
      description: "Track your outreach, manage collaborations, and build lasting relationships with creators."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-atlas-purple" />,
      title: "Campaign Tools",
      description: "Plan, execute, and track marketing campaigns with built-in templates and automation."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-atlas-purple" />,
      title: "Analytics & ROI",
      description: "Measure real marketing performance with detailed attribution and reporting tools."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-atlas-purple">Your Marketing Toolkit</h3>
        <p className="text-gray-600">
          Here's what you can do with GameAtlas to grow your game's audience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-atlas-purple/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-atlas-purple/10 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-atlas-teal/10 p-4 rounded-lg text-center">
        <p className="text-sm text-atlas-dark">
          💡 <strong>Pro Tip:</strong> Start by exploring the Discovery tab to find your first communities and creators to connect with.
        </p>
      </div>

      <div className="flex gap-4 justify-center pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={onNext}
          className="bg-atlas-purple hover:bg-opacity-90"
        >
          Almost Done!
        </Button>
      </div>
    </div>
  );
};

export default FeaturesOverviewStep;
