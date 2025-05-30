
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoFormProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

const BasicInfoForm = ({ 
  name, 
  description, 
  onNameChange, 
  onDescriptionChange 
}: BasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">List Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Indie Puzzle Games"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the criteria for this list..."
          rows={2}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
