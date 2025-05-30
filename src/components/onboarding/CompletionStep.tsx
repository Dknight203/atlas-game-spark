
import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, ArrowRight } from "lucide-react";

interface CompletionStepProps {
  onCreateProject: () => void;
  onPrevious: () => void;
  projectData: {
    name: string;
    genre: string;
    platform: string;
  };
}

const CompletionStep = ({ onCreateProject, onPrevious, projectData }: CompletionStepProps) => {
  const hasProjectData = projectData.name || projectData.genre || projectData.platform;

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">You're All Set!</h3>
        <p className="text-gray-600 mb-6">
          Welcome to GameAtlas! You're ready to start discovering communities and creators for your games.
        </p>
      </div>

      {hasProjectData ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Ready to Create Your Project?</h4>
          <div className="text-blue-800 space-y-1">
            {projectData.name && <p>• Game: {projectData.name}</p>}
            {projectData.genre && <p>• Genre: {projectData.genre}</p>}
            {projectData.platform && <p>• Platform: {projectData.platform}</p>}
          </div>
        </div>
      ) : null}

      <div className="bg-gradient-to-r from-atlas-purple/10 to-atlas-teal/10 border border-atlas-purple/20 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Your Next Steps:</h4>
        <div className="text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-atlas-purple text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
              1
            </div>
            <div>
              <p className="font-medium">Create Your First Project</p>
              <p className="text-sm text-gray-600">Set up a project to unlock all discovery features</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-atlas-teal text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
              2
            </div>
            <div>
              <p className="font-medium">Build Your Signal Profile</p>
              <p className="text-sm text-gray-600">Define your game's themes and mechanics for better matches</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
              3
            </div>
            <div>
              <p className="font-medium">Discover Communities & Creators</p>
              <p className="text-sm text-gray-600">Find your target audience and marketing partners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Previous
        </Button>
        {hasProjectData ? (
          <Button
            type="button"
            onClick={onCreateProject}
            className="flex-1 bg-atlas-purple hover:bg-opacity-90"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Create Project & Get Started
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onCreateProject}
            className="flex-1 bg-atlas-purple hover:bg-opacity-90"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompletionStep;
