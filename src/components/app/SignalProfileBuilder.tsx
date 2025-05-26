
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Save, Filter } from "lucide-react";
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
    uniqueFeatures: ""
  });
  
  const [matchCriteria, setMatchCriteria] = useState({
    yearFilter: "all",
    teamSizeFilter: "all",
    platformFilter: "all",
    genreFilter: "all",
    similarityFilter: "all",
    revenueFilter: "all",
    playerBaseFilter: "all"
  });
  
  const [newTheme, setNewTheme] = useState("");
  const [newMechanic, setNewMechanic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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
            uniqueFeatures: data.unique_features || ""
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
        </CardContent>
      </Card>

      {/* Match Criteria Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Match Criteria
          </CardTitle>
          <CardDescription>
            Specify what types of games you want to match with to get more relevant results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* First row of criteria */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Release Year</Label>
              <Select value={matchCriteria.yearFilter} onValueChange={(value) => setMatchCriteria({...matchCriteria, yearFilter: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="current">Current Year (2025)</SelectItem>
                  <SelectItem value="recent">Recent (2022-2025)</SelectItem>
                  <SelectItem value="2020s">2020s</SelectItem>
                  <SelectItem value="2010s">2010s</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Team Size</Label>
              <Select value={matchCriteria.teamSizeFilter} onValueChange={(value) => setMatchCriteria({...matchCriteria, teamSizeFilter: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Sizes</SelectItem>
                  <SelectItem value="solo">Solo Developer</SelectItem>
                  <SelectItem value="small">Small (5-20)</SelectItem>
                  <SelectItem value="medium">Medium (20-50)</SelectItem>
                  <SelectItem value="large">Large (100+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Platform</Label>
              <Select value={matchCriteria.platformFilter} onValueChange={(value) => setMatchCriteria({...matchCriteria, platformFilter: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="pc">PC/Steam</SelectItem>
                  <SelectItem value="switch">Nintendo Switch</SelectItem>
                  <SelectItem value="console">Console</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="cross-platform">Cross-Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Similarity</Label>
              <Select value={matchCriteria.similarityFilter} onValueChange={(value) => setMatchCriteria({...matchCriteria, similarityFilter: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Similarities</SelectItem>
                  <SelectItem value="high">High Match (85%+)</SelectItem>
                  <SelectItem value="medium">Medium Match (70-84%)</SelectItem>
                  <SelectItem value="low">Low Match (&lt;70%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second row of criteria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Revenue Scale</Label>
              <Select value={matchCriteria.revenueFilter} onValueChange={(value) => setMatchCriteria({...matchCriteria, revenueFilter: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any revenue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Revenue Levels</SelectItem>
                  <SelectItem value="indie">Indie (&lt;$100M)</SelectItem>
                  <SelectItem value="aa">AA ($100M-$1B)</SelectItem>
                  <SelectItem value="aaa">AAA ($1B+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Player Base</Label>
              <Select value={matchCriteria.playerBaseFilter} onValueChange={(value) => setMatchCriteria({...matchCriteria, playerBaseFilter: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any player base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Player Bases</SelectItem>
                  <SelectItem value="niche">Niche (&lt;5M players)</SelectItem>
                  <SelectItem value="popular">Popular (5-20M players)</SelectItem>
                  <SelectItem value="mainstream">Mainstream (20M+ players)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Genre Focus</Label>
              <Select value={matchCriteria.genreFilter} onValueChange={(value) => setMatchCriteria({...matchCriteria, genreFilter: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="simulation">Simulation</SelectItem>
                  <SelectItem value="farming">Farming</SelectItem>
                  <SelectItem value="relationships">Social/Relationships</SelectItem>
                  <SelectItem value="customization">Customization</SelectItem>
                  <SelectItem value="relaxing">Relaxing/Cozy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={saveProfile} 
              className="bg-atlas-purple hover:bg-opacity-90"
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Profile & Criteria"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalProfileBuilder;
