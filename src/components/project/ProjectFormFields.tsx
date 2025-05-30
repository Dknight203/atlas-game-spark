
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
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
  const [showQuickProfile, setShowQuickProfile] = useState(false);
  const [quickThemes, setQuickThemes] = useState<string[]>([]);
  const [quickMechanics, setQuickMechanics] = useState<string[]>([]);

  const commonThemes = [
    "Fantasy", "Sci-Fi", "Horror", "Adventure", "Comedy", "Mystery",
    "Post-Apocalyptic", "Medieval", "Space", "Magic", "Cyberpunk"
  ];

  const commonMechanics = [
    "Turn-based Combat", "Real-time Strategy", "Puzzle Solving", "Platform Jumping",
    "Resource Management", "Crafting", "Character Customization", "Stealth"
  ];

  const addTheme = (theme: string) => {
    if (!quickThemes.includes(theme)) {
      setQuickThemes([...quickThemes, theme]);
    }
  };

  const removeTheme = (theme: string) => {
    setQuickThemes(quickThemes.filter(t => t !== theme));
  };

  const addMechanic = (mechanic: string) => {
    if (!quickMechanics.includes(mechanic)) {
      setQuickMechanics([...quickMechanics, mechanic]);
    }
  };

  const removeMechanic = (mechanic: string) => {
    setQuickMechanics(quickMechanics.filter(m => m !== mechanic));
  };

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
        <p className="text-xs text-gray-500 mt-1">
          A good description helps us suggest relevant themes and mechanics for your signal profile.
        </p>
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

      {/* Quick Profile Section */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-atlas-purple" />
              <CardTitle className="text-base">Quick Profile (Optional)</CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowQuickProfile(!showQuickProfile)}
            >
              {showQuickProfile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Add themes and mechanics now to skip parts of the profile builder later
          </p>
        </CardHeader>
        
        {showQuickProfile && (
          <CardContent className="space-y-4">
            {/* Quick Themes */}
            <div>
              <Label className="text-sm font-medium">Themes & Setting</Label>
              <div className="flex flex-wrap gap-1 mt-2 mb-2">
                {quickThemes.map((theme) => (
                  <Badge key={theme} variant="secondary" className="flex items-center gap-1">
                    {theme}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTheme(theme)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {commonThemes.filter(theme => !quickThemes.includes(theme)).map((theme) => (
                  <Button
                    key={theme}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addTheme(theme)}
                  >
                    + {theme}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Mechanics */}
            <div>
              <Label className="text-sm font-medium">Core Mechanics</Label>
              <div className="flex flex-wrap gap-1 mt-2 mb-2">
                {quickMechanics.map((mechanic) => (
                  <Badge key={mechanic} variant="secondary" className="flex items-center gap-1">
                    {mechanic}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeMechanic(mechanic)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {commonMechanics.filter(mechanic => !quickMechanics.includes(mechanic)).map((mechanic) => (
                  <Button
                    key={mechanic}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addMechanic(mechanic)}
                  >
                    + {mechanic}
                  </Button>
                ))}
              </div>
            </div>

            {(quickThemes.length > 0 || quickMechanics.length > 0) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  ✓ These will be automatically added to your signal profile after project creation
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default ProjectFormFields;
