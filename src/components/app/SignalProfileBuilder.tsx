import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SmartSuggestions from "@/components/ai/SmartSuggestions";
import TagAutoComplete from "@/components/ai/TagAutoComplete";
import AutoComplete from "@/components/ai/AutoComplete";

interface SignalProfileBuilderProps {
  projectId: string;
  onComplete?: () => void;
}

const SignalProfileBuilder = ({ projectId, onComplete }: SignalProfileBuilderProps) => {
  const [profile, setProfile] = useState({
    themes: [] as string[],
    mechanics: [] as string[],
    tone: "",
    targetAudience: "",
    uniqueFeatures: "",
    genre: ""
  });
  
  const [filters, setFilters] = useState({
    genreFilter: "",
    themeFilter: "",
    mechanicFilter: ""
  });

  const [matchCriteria, setMatchCriteria] = useState({
    yearFilter: "all",
    teamSizeFilter: "all",
    platformFilter: "all",
    businessModelFilter: "all",
    budgetRangeFilter: "all",
    revenueFilter: "all",
    publisherFilter: "all",
    reviewScoreFilter: "all",
    similarityThreshold: "70"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Predefined suggestions for autocomplete
  const themeSuggestions = [
    "Fantasy", "Sci-Fi", "Medieval", "Post-Apocalyptic", "Cyberpunk", "Steampunk",
    "Horror", "Mystery", "Adventure", "Comedy", "Romance", "War", "Space",
    "Pirates", "Zombies", "Magic", "Technology", "Nature", "Urban", "Western"
  ];

  const mechanicSuggestions = [
    "Turn-based Combat", "Real-time Strategy", "Puzzle Solving", "Platform Jumping",
    "Resource Management", "Base Building", "Crafting", "Inventory Management",
    "Skill Trees", "Character Customization", "Dialogue Choices", "Stealth",
    "Racing", "Time Management", "Card Battles", "Match-3", "Physics-based",
    "Roguelike", "Permadeath", "Procedural Generation"
  ];

  const toneSuggestions = [
    "Dark and Serious", "Light-hearted", "Epic and Heroic", "Mysterious",
    "Comedic", "Dramatic", "Relaxing", "Intense", "Nostalgic", "Quirky",
    "Atmospheric", "Cheerful", "Melancholic", "Suspenseful", "Whimsical"
  ];

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

  // Match criteria options
  const yearOptions = [
    { value: "all", label: "Any year" },
    { value: "current", label: "This year (2025)" },
    { value: "recent", label: "Last 2 years (2023-2025)" },
    { value: "2020s", label: "2020s (2020-2025)" },
    { value: "2010s", label: "2010s (2010-2019)" },
    { value: "2000s", label: "2000s (2000-2009)" }
  ];

  const teamSizeOptions = [
    { value: "all", label: "Any team size" },
    { value: "solo", label: "Solo/Indie (1-5 people)" },
    { value: "small", label: "Small team (5-20 people)" },
    { value: "medium", label: "Medium studio (20-50 people)" },
    { value: "large", label: "Large studio (50+ people)" }
  ];

  const platformOptions = [
    { value: "all", label: "All platforms" },
    { value: "pc", label: "PC" },
    { value: "switch", label: "Nintendo Switch" },
    { value: "console", label: "Console (PS/Xbox/Switch)" },
    { value: "mobile", label: "Mobile (iOS/Android)" },
    { value: "cross-platform", label: "Cross-platform" }
  ];

  const businessModelOptions = [
    { value: "all", label: "Any business model" },
    { value: "f2p", label: "Free-to-Play" },
    { value: "premium", label: "Premium/Paid" },
    { value: "subscription", label: "Subscription" },
    { value: "dlc", label: "Base + DLC" },
    { value: "early-access", label: "Early Access" }
  ];

  const budgetRangeOptions = [
    { value: "all", label: "Any budget range" },
    { value: "indie", label: "Indie (<$1M)" },
    { value: "aa", label: "AA ($1M-$10M)" },
    { value: "aaa", label: "AAA ($10M+)" }
  ];

  const revenueOptions = [
    { value: "all", label: "Any revenue" },
    { value: "under-1m", label: "Under $1M" },
    { value: "1m-10m", label: "$1M - $10M" },
    { value: "10m-50m", label: "$10M - $50M" },
    { value: "50m-100m", label: "$50M - $100M" },
    { value: "over-100m", label: "Over $100M" }
  ];

  const publisherOptions = [
    { value: "all", label: "Any publisher status" },
    { value: "self-published", label: "Self-published" },
    { value: "indie-publisher", label: "Indie publisher" },
    { value: "major-publisher", label: "Major publisher" }
  ];

  const reviewScoreOptions = [
    { value: "all", label: "Any review score" },
    { value: "90-plus", label: "90+ (Exceptional)" },
    { value: "80-89", label: "80-89 (Great)" },
    { value: "70-79", label: "70-79 (Good)" },
    { value: "60-69", label: "60-69 (Mixed)" },
    { value: "under-60", label: "Under 60 (Poor)" }
  ];

  // Load existing signal profile and project data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Load signal profile
        const { data: signalData, error: signalError } = await supabase
          .from('signal_profiles')
          .select('*')
          .eq('project_id', projectId)
          .maybeSingle();

        // Load project data for genre
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('genre')
          .eq('id', projectId)
          .single();

        if (signalError && signalError.code !== 'PGRST116') {
          console.error('Error loading signal profile:', signalError);
        }

        if (projectError) {
          console.error('Error loading project:', projectError);
        }

        // Set profile data
        if (signalData || projectData) {
          setProfile({
            themes: signalData ? jsonToStringArray(signalData.themes) : [],
            mechanics: signalData ? jsonToStringArray(signalData.mechanics) : [],
            tone: signalData?.tone || "",
            targetAudience: signalData?.target_audience || "",
            uniqueFeatures: signalData?.unique_features || "",
            genre: projectData?.genre || ""
          });

          // Load match criteria if exists
          if (signalData) {
            setMatchCriteria({
              yearFilter: signalData.year_filter || "all",
              teamSizeFilter: signalData.team_size_filter || "all",
              platformFilter: signalData.platform_filter || "all",
              businessModelFilter: signalData.business_model_filter || "all",
              budgetRangeFilter: signalData.budget_range_filter || "all",
              revenueFilter: signalData.revenue_filter || "all",
              publisherFilter: signalData.publisher_filter || "all",
              reviewScoreFilter: signalData.review_score_filter || "all",
              similarityThreshold: signalData.similarity_threshold || "70"
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [projectId]);

  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonData: any): string[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.filter(item => typeof item === 'string');
    }
    return [];
  };

  // Handle AI suggestions
  const handleSuggestionApply = (suggestion: any) => {
    switch (suggestion.type) {
      case 'theme':
        if (!profile.themes.includes(suggestion.value)) {
          setProfile(prev => ({
            ...prev,
            themes: [...prev.themes, suggestion.value]
          }));
        }
        break;
      case 'mechanic':
        if (!profile.mechanics.includes(suggestion.value)) {
          setProfile(prev => ({
            ...prev,
            mechanics: [...prev.mechanics, suggestion.value]
          }));
        }
        break;
      case 'tone':
        setProfile(prev => ({ ...prev, tone: suggestion.value }));
        break;
    }
  };

  const clearFilters = () => {
    setFilters({
      genreFilter: "",
      themeFilter: "",
      mechanicFilter: ""
    });
  };

  const resetMatchCriteria = () => {
    setMatchCriteria({
      yearFilter: "all",
      teamSizeFilter: "all",
      platformFilter: "all",
      businessModelFilter: "all",
      budgetRangeFilter: "all",
      revenueFilter: "all",
      publisherFilter: "all",
      reviewScoreFilter: "all",
      similarityThreshold: "70"
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      const profileData = {
        project_id: projectId,
        themes: profile.themes,
        mechanics: profile.mechanics,
        tone: profile.tone,
        target_audience: profile.targetAudience,
        unique_features: profile.uniqueFeatures,
        year_filter: matchCriteria.yearFilter,
        team_size_filter: matchCriteria.teamSizeFilter,
        platform_filter: matchCriteria.platformFilter,
        business_model_filter: matchCriteria.businessModelFilter,
        budget_range_filter: matchCriteria.budgetRangeFilter,
        revenue_filter: matchCriteria.revenueFilter,
        publisher_filter: matchCriteria.publisherFilter,
        review_score_filter: matchCriteria.reviewScoreFilter,
        similarity_threshold: matchCriteria.similarityThreshold
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
        // Also update the project's genre
        if (profile.genre) {
          const { error: projectError } = await supabase
            .from('projects')
            .update({ genre: profile.genre })
            .eq('id', projectId);

          if (projectError) {
            console.error('Error updating project genre:', projectError);
          }
        }

        toast({
          title: "Profile Saved",
          description: "Your signal profile and match criteria have been updated successfully.",
        });

        // Notify parent component that profile is complete
        onComplete?.();
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Profile Builder */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Signal Profile Builder</CardTitle>
            <CardDescription>
              Define your game's core attributes and match criteria to help our matching engine find similar games and communities.
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

            {/* Themes with AI suggestions */}
            <TagAutoComplete
              tags={profile.themes}
              onTagsChange={(themes) => setProfile({ ...profile, themes })}
              suggestions={themeSuggestions}
              label="Themes & Setting"
              placeholder="Add a theme..."
              className="w-full"
            />

            {/* Mechanics with AI suggestions */}
            <TagAutoComplete
              tags={profile.mechanics}
              onTagsChange={(mechanics) => setProfile({ ...profile, mechanics })}
              suggestions={mechanicSuggestions}
              label="Core Mechanics"
              placeholder="Add a mechanic..."
              className="w-full"
            />

            {/* Tone with autocomplete */}
            <div>
              <Label htmlFor="tone" className="text-base font-semibold">Tone & Mood</Label>
              <p className="text-sm text-gray-600 mb-3">How would you describe the overall feel of your game?</p>
              <AutoComplete
                value={profile.tone}
                onChange={(tone) => setProfile({ ...profile, tone })}
                suggestions={toneSuggestions}
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
                onClick={handleSaveProfile} 
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

      {/* AI Suggestions Sidebar */}
      <div className="lg:col-span-1">
        <SmartSuggestions
          type="profile"
          data={profile}
          onSuggestionApply={handleSuggestionApply}
          className="sticky top-4"
        />
      </div>
    </div>
  );
};

export default SignalProfileBuilder;
