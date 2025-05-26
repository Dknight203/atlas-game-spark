
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Save } from "lucide-react";

interface SignalProfileBuilderProps {
  projectId: string;
}

const SignalProfileBuilder = ({ projectId }: SignalProfileBuilderProps) => {
  const [profile, setProfile] = useState({
    themes: ["Space", "Exploration", "Crafting"],
    mechanics: ["Turn-based Combat", "Resource Management", "Trading"],
    tone: "Adventure",
    targetAudience: "RPG enthusiasts, space game fans",
    uniqueFeatures: "Procedural galaxy generation, complex economy system"
  });
  
  const [newTheme, setNewTheme] = useState("");
  const [newMechanic, setNewMechanic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTheme = () => {
    if (newTheme.trim() && !profile.themes.includes(newTheme.trim())) {
      setProfile({
        ...profile,
        themes: [...profile.themes, newTheme.trim()]
      });
      setNewTheme("");
    }
  };

  const removeTheme = (theme: string) => {
    setProfile({
      ...profile,
      themes: profile.themes.filter(t => t !== theme)
    });
  };

  const addMechanic = () => {
    if (newMechanic.trim() && !profile.mechanics.includes(newMechanic.trim())) {
      setProfile({
        ...profile,
        mechanics: [...profile.mechanics, newMechanic.trim()]
      });
      setNewMechanic("");
    }
  };

  const removeMechanic = (mechanic: string) => {
    setProfile({
      ...profile,
      mechanics: profile.mechanics.filter(m => m !== mechanic)
    });
  };

  const saveProfile = async () => {
    setIsLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile Saved",
        description: "Your signal profile has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Signal Profile Builder</CardTitle>
          <CardDescription>
            Define your game's core attributes to help our matching engine find similar games and communities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Themes */}
          <div>
            <Label className="text-base font-semibold">Themes & Setting</Label>
            <p className="text-sm text-gray-600 mb-3">What themes and settings does your game explore?</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.themes.map((theme) => (
                <Badge key={theme} variant="secondary" className="flex items-center gap-1">
                  {theme}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeTheme(theme)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
                placeholder="Add a theme..."
                onKeyPress={(e) => e.key === 'Enter' && addTheme()}
              />
              <Button onClick={addTheme} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mechanics */}
          <div>
            <Label className="text-base font-semibold">Core Mechanics</Label>
            <p className="text-sm text-gray-600 mb-3">What are the main gameplay mechanics?</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.mechanics.map((mechanic) => (
                <Badge key={mechanic} variant="secondary" className="flex items-center gap-1">
                  {mechanic}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeMechanic(mechanic)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newMechanic}
                onChange={(e) => setNewMechanic(e.target.value)}
                placeholder="Add a mechanic..."
                onKeyPress={(e) => e.key === 'Enter' && addMechanic()}
              />
              <Button onClick={addMechanic} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tone */}
          <div>
            <Label htmlFor="tone" className="text-base font-semibold">Tone & Mood</Label>
            <p className="text-sm text-gray-600 mb-3">How would you describe the overall feel of your game?</p>
            <Input
              id="tone"
              value={profile.tone}
              onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
              placeholder="e.g., Dark and mysterious, Light-hearted, Epic adventure"
            />
          </div>

          {/* Target Audience */}
          <div>
            <Label htmlFor="audience" className="text-base font-semibold">Target Audience</Label>
            <p className="text-sm text-gray-600 mb-3">Who is your ideal player?</p>
            <Textarea
              id="audience"
              value={profile.targetAudience}
              onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
              placeholder="Describe your target audience..."
              rows={3}
            />
          </div>

          {/* Unique Features */}
          <div>
            <Label htmlFor="features" className="text-base font-semibold">Unique Features</Label>
            <p className="text-sm text-gray-600 mb-3">What makes your game special?</p>
            <Textarea
              id="features"
              value={profile.uniqueFeatures}
              onChange={(e) => setProfile({ ...profile, uniqueFeatures: e.target.value })}
              placeholder="Describe what sets your game apart..."
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={saveProfile} 
              className="bg-atlas-purple hover:bg-opacity-90"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalProfileBuilder;
