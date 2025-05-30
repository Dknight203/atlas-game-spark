
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gamepad2 } from "lucide-react";

interface ProjectSetupStepProps {
  onNext: () => void;
  onPrevious: () => void;
  projectData: {
    name: string;
    genre: string;
    platform: string;
  };
  onProjectDataChange: (data: Partial<{ name: string; genre: string; platform: string }>) => void;
}

const ProjectSetupStep = ({ onNext, onPrevious, projectData, onProjectDataChange }: ProjectSetupStepProps) => {
  const genres = [
    "Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", 
    "Racing", "Puzzle", "Platformer", "Shooter", "Fighting", "Horror", "Indie"
  ];

  const platforms = [
    "PC (Windows)", "PC (Mac)", "PC (Linux)", "Nintendo Switch", 
    "PlayStation", "Xbox", "Mobile (iOS)", "Mobile (Android)", "Web Browser"
  ];

  const isFormValid = projectData.name && projectData.genre && projectData.platform;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-atlas-purple/10 rounded-full flex items-center justify-center mx-auto">
          <Gamepad2 className="w-6 h-6 text-atlas-purple" />
        </div>
        <h3 className="text-2xl font-bold text-atlas-purple">Tell Us About Your Game</h3>
        <p className="text-gray-600">
          This helps us find the most relevant communities and creators for your project.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="gameName">Game Name</Label>
          <Input
            id="gameName"
            placeholder="Enter your game's name"
            value={projectData.name}
            onChange={(e) => onProjectDataChange({ name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="genre">Primary Genre</Label>
          <Select value={projectData.genre} onValueChange={(value) => onProjectDataChange({ genre: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your game's genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="platform">Primary Platform</Label>
          <Select value={projectData.platform} onValueChange={(value) => onProjectDataChange({ platform: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your target platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isFormValid}
          className="bg-atlas-purple hover:bg-opacity-90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ProjectSetupStep;
