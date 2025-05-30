
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Compass } from "lucide-react";

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
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-atlas-purple">
          You're All Set!
        </h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Great! Now let's create your first project to start discovering 
          communities and creators for <strong>{projectData.name}</strong>.
        </p>
      </div>

      {projectData.name && (
        <div className="bg-gray-50 p-4 rounded-lg max-w-sm mx-auto">
          <h4 className="font-semibold mb-2">Your Project Setup:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Game:</strong> {projectData.name}</p>
            <p><strong>Genre:</strong> {projectData.genre}</p>
            <p><strong>Platform:</strong> {projectData.platform}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Button 
            onClick={onCreateProject}
            className="bg-atlas-purple hover:bg-opacity-90 flex items-center gap-2"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/dashboard"}
            className="flex items-center gap-2"
            size="lg"
          >
            <Compass className="w-4 h-4" />
            Explore Dashboard
          </Button>
        </div>
        
        <Button variant="ghost" onClick={onPrevious} className="text-sm">
          Go Back
        </Button>
      </div>

      <div className="text-xs text-gray-500 mt-6">
        You can always create more projects later from your dashboard.
      </div>
    </div>
  );
};

export default CompletionStep;
