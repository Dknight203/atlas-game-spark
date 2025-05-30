
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GenreSelectors from "./GenreSelectors";
import PlatformSelectors from "./PlatformSelectors";

interface ProjectFormFieldsProps {
  formData: {
    name: string;
    description: string;
    genre: string;
    secondary_genre: string;
    platforms: string[];
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onPlatformsChange: (platforms: string[]) => void;
}

const ProjectFormFields = ({ formData, onInputChange, onSelectChange, onPlatformsChange }: ProjectFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Game Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Enter your game name"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Describe your game..."
          className="mt-1"
          rows={4}
        />
      </div>

      <GenreSelectors 
        primaryGenre={formData.genre}
        secondaryGenre={formData.secondary_genre}
        onSelectChange={onSelectChange}
      />

      <PlatformSelectors
        selectedPlatforms={formData.platforms}
        onPlatformChange={onPlatformsChange}
      />
    </>
  );
};

export default ProjectFormFields;
