import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, RefreshCw, Filter, TrendingUp, Calendar, Users, Wifi, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MatchEngineResultsProps {
  projectId: string;
}

interface GameMatch {
  id: number;
  name: string;
  similarity: number;
  sharedTags: string[];
  platform: string;
  communitySize: string;
  recentActivity: string;
  description: string;
  steamUrl?: string;
  releaseYear: number;
  teamSize: string;
  marketPerformance: {
    revenue: string;
    playerBase: string;
    growthRate: string;
  };
}

const MatchEngineResults = ({ projectId }: MatchEngineResultsProps) => {
  const [matches, setMatches] = useState<GameMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<GameMatch[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMarketData, setShowMarketData] = useState(false);
  
  // Enhanced filtering options
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [similarityFilter, setSimilarityFilter] = useState<string>("all");
  const [revenueFilter, setRevenueFilter] = useState<string>("all");
  const [playerBaseFilter, setPlayerBaseFilter] = useState<string>("all");
  
  const [isLiveData, setIsLiveData] = useState(false);
  const { toast } = useToast();

  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonData: unknown): string[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.filter((item): item is string => typeof item === 'string');
    }
    return [];
  };

  // Fetch live game data from external APIs
  const fetchLiveGameData = async (themes: string[], mechanics: string[], tone: string, genre?: string) => {
    try {
      console.log('Fetching live game data...');
      
      const { data, error } = await supabase.functions.invoke('fetch-game-data', {
        body: {
          genre: genre || '',
          themes: themes,
          mechanics: mechanics,
          tone: tone
        }
      });

      if (error) {
        console.error('Error calling fetch-game-data function:', error);
        throw error;
      }

      console.log('Live game data received:', data);
      return data.games || [];
    } catch (error) {
      console.error('Error fetching live game data:', error);
      toast({
        title: "Live Data Unavailable",
        description: "Falling back to sample data. Check your internet connection.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Enhanced sample data with better categorization
  const generateMatches = (themes: string[], mechanics: string[], tone: string, genre?: string) => {
    const gameDatabase = {
      "Life Sim": [
        {
          id: 1,
          name: "The Sims 4",
          similarity: 92,
          sharedTags: ["Life Simulation", "Character Customization", "Building", "Relationships"],
          platform: "PC, Console",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Create and control virtual people in a detailed life simulation game",
          steamUrl: "https://store.steampowered.com/app/1222670/The_Sims_4/",
          releaseYear: 2014,
          teamSize: "Large (100+ developers)",
          marketPerformance: {
            revenue: "$1.3B+ lifetime",
            playerBase: "36M+ players",
            growthRate: "+15% YoY"
          }
        },
        {
          id: 11,
          name: "Stardew Valley",
          similarity: 88,
          sharedTags: ["Life Simulation", "Farming", "Relationships", "Pixel Art"],
          platform: "PC, Switch, Mobile",
          communitySize: "Large",
          recentActivity: "Very High",
          description: "A farming simulation game with life sim elements and cozy gameplay",
          steamUrl: "https://store.steampowered.com/app/413150/Stardew_Valley/",
          releaseYear: 2016,
          teamSize: "Solo Developer",
          marketPerformance: {
            revenue: "$300M+ lifetime",
            playerBase: "20M+ players",
            growthRate: "+25% YoY"
          }
        },
        {
          id: 12,
          name: "Animal Crossing: New Horizons",
          similarity: 85,
          sharedTags: ["Life Simulation", "Social", "Customization", "Relaxing"],
          platform: "Switch",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Create your own island paradise and live a peaceful life",
          releaseYear: 2020,
          teamSize: "Large (100+ developers)",
          marketPerformance: {
            revenue: "$2B+ lifetime",
            playerBase: "39M+ players",
            growthRate: "+10% YoY"
          }
        },
        {
          id: 13,
          name: "My Time at Portia",
          similarity: 82,
          sharedTags: ["Life Simulation", "Crafting", "Adventure", "Relationships"],
          platform: "PC, Switch, Console",
          communitySize: "Medium",
          recentActivity: "Medium",
          description: "Restore your Pa's neglected workshop to its former glory",
          steamUrl: "https://store.steampowered.com/app/666140/My_Time_at_Portia/",
          releaseYear: 2019,
          teamSize: "Small (5-20 developers)",
          marketPerformance: {
            revenue: "$50M+ lifetime",
            playerBase: "3M+ players",
            growthRate: "+5% YoY"
          }
        }
      ]
    };

    // For life sim projects, return life sim games
    if (genre?.toLowerCase().includes("life") || genre?.toLowerCase().includes("sim")) {
      return gameDatabase["Life Sim"];
    }

    // Default fallback
    return gameDatabase["Life Sim"];
  };

  const loadMatches = async () => {
    try {
      // Fetch signal profile for this project
      const { data: signalProfile, error } = await supabase
        .from('signal_profiles')
        .select('themes, mechanics, tone')
        .eq('project_id', projectId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading signal profile:', error);
        toast({
          title: "Error",
          description: "Failed to load signal profile",
          variant: "destructive",
        });
        return;
      }

      // Also fetch project details for genre
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('genre')
        .eq('id', projectId)
        .maybeSingle();

      if (projectError && projectError.code !== 'PGRST116') {
        console.error('Error loading project:', projectError);
      }

      // Generate matches based on the signal profile data
      const themes = signalProfile ? jsonToStringArray(signalProfile.themes) : [];
      const mechanics = signalProfile ? jsonToStringArray(signalProfile.mechanics) : [];
      const tone = signalProfile?.tone || "";
      const genre = project?.genre || "";

      // Try to fetch live data first, fall back to sample data
      let generatedMatches: GameMatch[] = [];
      
      try {
        console.log('Attempting to fetch live game data...');
        generatedMatches = await fetchLiveGameData(themes, mechanics, tone, genre);
        setIsLiveData(true);
        toast({
          title: "Live Data Connected",
          description: "Showing current games from Steam and other databases",
        });
      } catch (error) {
        console.log('Live data fetch failed, using sample data');
        generatedMatches = generateMatches(themes, mechanics, tone, genre);
        setIsLiveData(false);
      }

      setMatches(generatedMatches);
      setFilteredMatches(generatedMatches);

    } catch (error) {
      console.error('Error loading matches:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced filter matches with more criteria
  useEffect(() => {
    let filtered = [...matches];

    // Year filter
    if (yearFilter !== "all") {
      const currentYear = new Date().getFullYear();
      
      if (yearFilter === "current") {
        filtered = filtered.filter(match => match.releaseYear === currentYear);
      } else if (yearFilter === "recent") {
        filtered = filtered.filter(match => match.releaseYear >= currentYear - 3);
      } else if (yearFilter === "2020s") {
        filtered = filtered.filter(match => match.releaseYear >= 2020);
      } else if (yearFilter === "2010s") {
        filtered = filtered.filter(match => match.releaseYear >= 2010 && match.releaseYear < 2020);
      }
    }

    // Team size filter
    if (teamSizeFilter !== "all") {
      filtered = filtered.filter(match => {
        const teamSize = match.teamSize.toLowerCase();
        if (teamSizeFilter === "solo") return teamSize.includes("solo");
        if (teamSizeFilter === "small") return teamSize.includes("small") || teamSize.includes("5-20");
        if (teamSizeFilter === "medium") return teamSize.includes("medium") || teamSize.includes("20-50");
        if (teamSizeFilter === "large") return teamSize.includes("large") || teamSize.includes("100+");
        return true;
      });
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter(match => {
        const platform = match.platform.toLowerCase();
        if (platformFilter === "pc") return platform.includes("pc") || platform.includes("steam");
        if (platformFilter === "switch") return platform.includes("switch");
        if (platformFilter === "console") return platform.includes("console");
        if (platformFilter === "mobile") return platform.includes("mobile");
        if (platformFilter === "cross-platform") return platform.includes(",") || platform.includes("multiple");
        return true;
      });
    }

    // Genre/Tag filter
    if (genreFilter !== "all") {
      filtered = filtered.filter(match => {
        const tags = match.sharedTags.join(" ").toLowerCase();
        return tags.includes(genreFilter.toLowerCase());
      });
    }

    // Similarity filter
    if (similarityFilter !== "all") {
      filtered = filtered.filter(match => {
        if (similarityFilter === "high") return match.similarity >= 85;
        if (similarityFilter === "medium") return match.similarity >= 70 && match.similarity < 85;
        if (similarityFilter === "low") return match.similarity < 70;
        return true;
      });
    }

    // Revenue filter
    if (revenueFilter !== "all") {
      filtered = filtered.filter(match => {
        const revenue = match.marketPerformance.revenue.toLowerCase();
        if (revenueFilter === "indie") return revenue.includes("m") && !revenue.includes("b");
        if (revenueFilter === "aa") return revenue.includes("100m") || revenue.includes("200m") || revenue.includes("300m");
        if (revenueFilter === "aaa") return revenue.includes("b") || revenue.includes("1.") || revenue.includes("2.");
        return true;
      });
    }

    // Player base filter
    if (playerBaseFilter !== "all") {
      filtered = filtered.filter(match => {
        const playerBase = match.marketPerformance.playerBase.toLowerCase();
        if (playerBaseFilter === "niche") return playerBase.includes("k") || (playerBase.includes("m") && parseInt(playerBase) < 5);
        if (playerBaseFilter === "popular") return playerBase.includes("m") && parseInt(playerBase) >= 5 && parseInt(playerBase) < 20;
        if (playerBaseFilter === "mainstream") return playerBase.includes("m") && parseInt(playerBase) >= 20;
        return true;
      });
    }

    setFilteredMatches(filtered);
  }, [matches, yearFilter, teamSizeFilter, platformFilter, genreFilter, similarityFilter, revenueFilter, playerBaseFilter]);

  useEffect(() => {
    loadMatches();
  }, [projectId]);

  const refreshMatches = async () => {
    setIsRefreshing(true);
    await loadMatches();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const clearAllFilters = () => {
    setYearFilter("all");
    setTeamSizeFilter("all");
    setPlatformFilter("all");
    setGenreFilter("all");
    setSimilarityFilter("all");
    setRevenueFilter("all");
    setPlayerBaseFilter("all");
  };

  const handleViewDetails = (match: GameMatch) => {
    if (match.steamUrl) {
      window.open(match.steamUrl, '_blank');
    } else {
      toast({
        title: "Game Details",
        description: `${match.name} - ${match.description}`,
      });
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return "bg-green-100 text-green-800";
    if (similarity >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getActivityColor = (activity: string) => {
    if (activity === "Very High") return "text-green-600";
    if (activity === "High") return "text-green-500";
    if (activity === "Medium") return "text-yellow-600";
    return "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
        <p className="ml-4 text-gray-600">Loading game matches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Cross-Game Match Engine
                {isLiveData ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-gray-400" />
                )}
              </CardTitle>
              <CardDescription>
                {isLiveData 
                  ? "Live games from Steam and other databases with similar audiences and mechanics."
                  : "Sample games with similar audiences and mechanics. Live data temporarily unavailable."
                }
                {filteredMatches.length !== matches.length && (
                  <span className="block mt-1 text-sm font-medium">
                    Showing {filteredMatches.length} of {matches.length} matches
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMarketData(!showMarketData)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {showMarketData ? 'Hide' : 'Show'} Market Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshMatches}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Match Criteria:</span>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            
            {/* First row of filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Release Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="current">Current Year (2025)</SelectItem>
                  <SelectItem value="recent">Recent (2022-2025)</SelectItem>
                  <SelectItem value="2020s">2020s</SelectItem>
                  <SelectItem value="2010s">2010s</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={teamSizeFilter} onValueChange={setTeamSizeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Team Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Sizes</SelectItem>
                  <SelectItem value="solo">Solo Developer</SelectItem>
                  <SelectItem value="small">Small (5-20)</SelectItem>
                  <SelectItem value="medium">Medium (20-50)</SelectItem>
                  <SelectItem value="large">Large (100+)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Platform" />
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

              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Genre/Theme" />
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

            {/* Second row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={similarityFilter} onValueChange={setSimilarityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Similarity Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Similarities</SelectItem>
                  <SelectItem value="high">High Match (85%+)</SelectItem>
                  <SelectItem value="medium">Medium Match (70-84%)</SelectItem>
                  <SelectItem value="low">Low Match (&lt;70%)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={revenueFilter} onValueChange={setRevenueFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Revenue Scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Revenue Levels</SelectItem>
                  <SelectItem value="indie">Indie (&lt;$100M)</SelectItem>
                  <SelectItem value="aa">AA ($100M-$1B)</SelectItem>
                  <SelectItem value="aaa">AAA ($1B+)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={playerBaseFilter} onValueChange={setPlayerBaseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Player Base Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Player Bases</SelectItem>
                  <SelectItem value="niche">Niche (&lt;5M players)</SelectItem>
                  <SelectItem value="popular">Popular (5-20M players)</SelectItem>
                  <SelectItem value="mainstream">Mainstream (20M+ players)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div 
                key={match.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{match.name}</h3>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {match.releaseYear}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {match.teamSize}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{match.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSimilarityColor(match.similarity)}`}>
                      {match.similarity}% match
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {match.sharedTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {showMarketData && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Market Performance
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <div className="font-medium">{match.marketPerformance.revenue}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Player Base:</span>
                        <div className="font-medium">{match.marketPerformance.playerBase}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Growth Rate:</span>
                        <div className="font-medium text-green-600">{match.marketPerformance.growthRate}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Community: {match.communitySize}</span>
                    <span className={getActivityColor(match.recentActivity)}>
                      Activity: {match.recentActivity}
                    </span>
                    <span>Platform: {match.platform}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(match)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredMatches.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No matches found for the selected criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchEngineResults;
