
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PlatformSelectorsProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
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

const PlatformSelectors = ({ selectedPlatforms, onPlatformChange }: PlatformSelectorsProps) => {
  const handlePlatformToggle = (platform: string, checked: boolean) => {
    if (checked) {
      onPlatformChange([...selectedPlatforms, platform]);
    } else {
      onPlatformChange(selectedPlatforms.filter(p => p !== platform));
    }
  };

  return (
    <div>
      <Label>Target Platforms</Label>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
        {platformOptions.map((platform) => (
          <div key={platform} className="flex items-center space-x-2">
            <Checkbox
              id={platform}
              checked={selectedPlatforms.includes(platform)}
              onCheckedChange={(checked) => handlePlatformToggle(platform, checked as boolean)}
            />
            <Label 
              htmlFor={platform}
              className="text-sm font-normal cursor-pointer"
            >
              {platform}
            </Label>
          </div>
        ))}
      </div>
      {selectedPlatforms.length === 0 && (
        <p className="text-sm text-gray-500 mt-1">Select at least one platform</p>
      )}
    </div>
  );
};

export default PlatformSelectors;
