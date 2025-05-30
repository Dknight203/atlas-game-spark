
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GenreSelectors from "./GenreSelectors";

interface ProjectFormFieldsProps {
  formData: {
    name: string;
    description: string;
    genre: string;
    secondary_genre: string;
    platform: string;
    status: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (field: string, value: string) => void;
}

const platformOptions = [
  "PC (Windows)",
  "PC (Mac)",
  "PC (Linux)",
  "Mobile (iOS)",
  "Mobile (Android)",
  "Nintendo Switch",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X/S",
  "Xbox One",
  "Web Browser",
  "VR (Meta Quest)",
  "VR (Steam VR)",
  "Cross-Platform",
  "Other"
];

const ProjectFormFields = ({ formData, onInputChange, onSelectChange }: ProjectFormFieldsProps) => {
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

      <div>
        <Label htmlFor="platform">Target Platform</Label>
        <Select value={formData.platform} onValueChange={(value) => onSelectChange('platform', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ProjectFormFields;
