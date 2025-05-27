
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SignalProfileBuilderProps {
  projectId: string;
}

const SignalProfileBuilder = ({ projectId }: SignalProfileBuilderProps) => {
  const [profile, setProfile] = useState({
    themes: [] as string[],
    mechanics: [] as string[],
    tone: "",
    targetAudience: "",
    uniqueFeatures: "",
    genre: ""
  });
  
  const [newTheme, setNewTheme] = useState("");
  const [newMechanic, setNewMechanic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Game genres for the dropdown
  const gameGenres = [
    "Action",
    "Adventure", 
    "RPG",
    "Strategy",
    "Simulation",
    "Life Sim",
    "Racing",
    "Sports",
    "Fighting",
    "Puzzle",
    "Platform",
    "Shooter",
    "Horror",
    "Survival",
    "Sandbox",
    "MMORPG",
    "Battle Royale",
    "Tower Defense",
    "Visual Novel",
    "Roguelike",
    "Casual",
    "Educational",
    "Music/Rhythm"
  ];

  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonData: any): string[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.filter(item => typeof item === 'string');
    }
    return [];
  };

  // Load existing signal profile
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('signal_profiles')
          .select('*')
          .eq('project_id', projectId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
        } else if (data) {
          setProfile({
            themes: jsonToStringArray(data.themes),
            mechanics: jsonToStringArray(data.mechanics),
            tone: data.tone || "",
            targetAudience: data.target_audience || "",
            uniqueFeatures: data.unique_features || "",
            genre: data.genre || ""
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [projectId]);

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
    setIsSaving(true);
    
    try {
      const profileData = {
        project_id: projectId,
        themes: profile.themes,
        mechanics: profile.mechanics,
        tone: profile.tone,
        target_audience: profile.targetAudience,
        unique_features: profile.uniqueFeatures
      };

      const { error } = await supabase
        .from('signal_profiles')
        .upsert(profileData, { onConflict: 'project_id' });

      if (error) {
        console.error('Save error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Saved",
          description: "Your signal profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
      </div>
    );
  }

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
          {/* Genre Selection */}
          <div>
            <Label className="text-base font-semibold">Game Genre</Label>
            <p className="text-sm text-gray-600 mb-3">What genre best describes your game?</p>
            <Select value={profile.genre} onValueChange={(value) => setProfile({ ...profile, genre: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white">
                {gameGenres.map((genre) => (
                  <SelectItem key={genre} value={genre.toLowerCase()}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalProfileBuilder;
