
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

  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonData: any): string[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.filter(item => typeof item === 'string');
    }
    return [];
  };

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

          // Load match criteria if exists - using optional chaining to handle missing properties
          if (signalData) {
            setMatchCriteria({
              yearFilter: (signalData as any).year_filter || "all",
              teamSizeFilter: (signalData as any).team_size_filter || "all",
              platformFilter: (signalData as any).platform_filter || "all",
              businessModelFilter: (signalData as any).business_model_filter || "all",
              budgetRangeFilter: (signalData as any).budget_range_filter || "all",
              revenueFilter: (signalData as any).revenue_filter || "all",
              publisherFilter: (signalData as any).publisher_filter || "all",
              reviewScoreFilter: (signalData as any).review_score_filter || "all",
              similarityThreshold: (signalData as any).similarity_threshold || "70"
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

  // Filter functions
  const filteredThemes = profile.themes.filter(theme => 
    theme.toLowerCase().includes(filters.themeFilter.toLowerCase())
  );

  const filteredMechanics = profile.mechanics.filter(mechanic => 
    mechanic.toLowerCase().includes(filters.mechanicFilter.toLowerCase())
  );

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

  const saveProfile = async () => {
    setIsSaving(true);
    
    try {
      const profileData = {
        project_id: projectId,
        themes: profile.themes,
        mechanics: profile.mechanics,
        tone: profile.tone,
        target_audience: profile.targetAudience,
        unique_features: profile.uniqueFeatures,
        // Save match criteria - using any type to bypass TypeScript errors
        ...(matchCriteria.yearFilter !== "all" && { year_filter: matchCriteria.yearFilter }),
        ...(matchCriteria.teamSizeFilter !== "all" && { team_size_filter: matchCriteria.teamSizeFilter }),
        ...(matchCriteria.platformFilter !== "all" && { platform_filter: matchCriteria.platformFilter }),
        ...(matchCriteria.businessModelFilter !== "all" && { business_model_filter: matchCriteria.businessModelFilter }),
        ...(matchCriteria.budgetRangeFilter !== "all" && { budget_range_filter: matchCriteria.budgetRangeFilter }),
        ...(matchCriteria.revenueFilter !== "all" && { revenue_filter: matchCriteria.revenueFilter }),
        ...(matchCriteria.publisherFilter !== "all" && { publisher_filter: matchCriteria.publisherFilter }),
        ...(matchCriteria.reviewScoreFilter !== "all" && { review_score_filter: matchCriteria.reviewScoreFilter }),
        similarity_threshold: matchCriteria.similarityThreshold
      } as any;

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
            Define your game's core attributes and match criteria to help our matching engine find similar games and communities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-atlas-purple" />
              <Label className="text-base font-semibold">Profile Filters</Label>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">Filter Themes</Label>
                <Input
                  value={filters.themeFilter}
                  onChange={(e) => setFilters({ ...filters, themeFilter: e.target.value })}
                  placeholder="Search themes..."
                />
              </div>
              <div>
                <Label className="text-sm">Filter Mechanics</Label>
                <Input
                  value={filters.mechanicFilter}
                  onChange={(e) => setFilters({ ...filters, mechanicFilter: e.target.value })}
                  placeholder="Search mechanics..."
                />
              </div>
              <div>
                <Label className="text-sm">Filter by Genre</Label>
                <Select value={filters.genreFilter} onValueChange={(value) => setFilters({ ...filters, genreFilter: value === "all-genres" ? "" : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genres" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white">
                    <SelectItem value="all-genres">All genres</SelectItem>
                    {gameGenres
                      .filter(genre => !filters.genreFilter || genre.toLowerCase().includes(filters.genreFilter.toLowerCase()))
                      .map((genre) => (
                        <SelectItem key={genre} value={genre.toLowerCase()}>
                          {genre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Enhanced Match Criteria Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-blue-600" />
              <Label className="text-base font-semibold">Match Criteria</Label>
              <Button variant="outline" size="sm" onClick={resetMatchCriteria}>
                Reset to Default
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Set specific criteria to filter the games that will be matched to your project.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Release Year</Label>
                <Select value={matchCriteria.yearFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, yearFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Team Size</Label>
                <Select value={matchCriteria.teamSizeFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, teamSizeFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {teamSizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Platform Focus</Label>
                <Select value={matchCriteria.platformFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, platformFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {platformOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Business Model</Label>
                <Select value={matchCriteria.businessModelFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, businessModelFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {businessModelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Budget Range</Label>
                <Select value={matchCriteria.budgetRangeFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, budgetRangeFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {budgetRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Revenue Range</Label>
                <Select value={matchCriteria.revenueFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, revenueFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {revenueOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Publisher Status</Label>
                <Select value={matchCriteria.publisherFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, publisherFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {publisherOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Review Score</Label>
                <Select value={matchCriteria.reviewScoreFilter} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, reviewScoreFilter: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {reviewScoreOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Minimum Similarity</Label>
                <Select value={matchCriteria.similarityThreshold} onValueChange={(value) => setMatchCriteria({ ...matchCriteria, similarityThreshold: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="50">50% - Show all matches</SelectItem>
                    <SelectItem value="60">60% - Good matches</SelectItem>
                    <SelectItem value="70">70% - Strong matches</SelectItem>
                    <SelectItem value="80">80% - Very strong matches</SelectItem>
                    <SelectItem value="90">90% - Only best matches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Genre Selection */}
          <div>
            <Label className="text-base font-semibold">Game Genre</Label>
            <p className="text-sm text-gray-600 mb-3">What genre best describes your game?</p>
            <Select value={profile.genre} onValueChange={(value) => setProfile({ ...profile, genre: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white">
                {gameGenres
                  .filter(genre => !filters.genreFilter || genre.toLowerCase().includes(filters.genreFilter.toLowerCase()))
                  .map((genre) => (
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
              {filteredThemes.map((theme) => (
                <Badge key={theme} variant="secondary" className="flex items-center gap-1">
                  {theme}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeTheme(theme)}
                  />
                </Badge>
              ))}
              {filters.themeFilter && filteredThemes.length === 0 && (
                <p className="text-sm text-gray-500">No themes match your filter</p>
              )}
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
              {filteredMechanics.map((mechanic) => (
                <Badge key={mechanic} variant="secondary" className="flex items-center gap-1">
                  {mechanic}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeMechanic(mechanic)}
                  />
                </Badge>
              ))}
              {filters.mechanicFilter && filteredMechanics.length === 0 && (
                <p className="text-sm text-gray-500">No mechanics match your filter</p>
              )}
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
              {isSaving ? "Saving..." : "Save Profile & Criteria"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalProfileBuilder;
