import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw, TrendingUp, Calendar, Users, Wifi, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MatchEngineResultsProps {
  projectId: string;
  onMatchesUpdate?: (count: number) => void;
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
  consoleUrl?: string;
  releaseYear: number;
  teamSize: string;
  marketPerformance: {
    revenue: string;
    playerBase: string;
    growthRate: string;
  };
}

interface MatchCriteria {
  yearFilter: string;
  teamSizeFilter: string;
  platformFilter: string;
  genreFilter: string;
  similarityFilter: string;
  revenueFilter: string;
  playerBaseFilter: string;
}

const MatchEngineResults = ({ projectId, onMatchesUpdate }: MatchEngineResultsProps) => {
  const [matches, setMatches] = useState<GameMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<GameMatch[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMarketData, setShowMarketData] = useState(false);
  const [isLiveData, setIsLiveData] = useState(false);
  const [matchCriteria, setMatchCriteria] = useState<MatchCriteria>({
    yearFilter: "all",
    teamSizeFilter: "all",
    platformFilter: "all",
    genreFilter: "all",
    similarityFilter: "all",
    revenueFilter: "all",
    playerBaseFilter: "all"
  });
  const { toast } = useToast();

  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonData: unknown): string[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.filter((item): item is string => typeof item === 'string');
    }
    return [];
  };

  // Load match criteria from signal profile
  const loadMatchCriteria = async (): Promise<void> => {
    try {
      const { data: signalProfile, error } = await supabase
        .from('signal_profiles')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading signal profile:', error);
        return;
      }

      if (signalProfile) {
        const profile = signalProfile as any;
        setMatchCriteria({
          yearFilter: profile.year_filter || "all",
          teamSizeFilter: profile.team_size_filter || "all",
          platformFilter: profile.platform_filter || "all",
          genreFilter: profile.genre_filter || "all",
          similarityFilter: profile.similarity_filter || "all",
          revenueFilter: profile.revenue_filter || "all",
          playerBaseFilter: profile.player_base_filter || "all"
        });
      }
    } catch (error) {
      console.error('Error loading match criteria:', error);
    }
  };

  // Simplified filter functions with explicit return types
  const filterByYear = (games: GameMatch[]): GameMatch[] => {
    if (matchCriteria.yearFilter === "all") return games;
    
    const currentYear = new Date().getFullYear();
    const result: GameMatch[] = [];
    
    for (const game of games) {
      let shouldInclude = false;
      switch (matchCriteria.yearFilter) {
        case "current":
          shouldInclude = game.releaseYear === currentYear;
          break;
        case "recent":
          shouldInclude = game.releaseYear >= 2022 && game.releaseYear <= currentYear;
          break;
        case "2020s":
          shouldInclude = game.releaseYear >= 2020 && game.releaseYear < 2030;
          break;
        case "2010s":
          shouldInclude = game.releaseYear >= 2010 && game.releaseYear < 2020;
          break;
        default:
          shouldInclude = true;
      }
      if (shouldInclude) result.push(game);
    }
    return result;
  };

  const filterByTeamSize = (games: GameMatch[]): GameMatch[] => {
    if (matchCriteria.teamSizeFilter === "all") return games;
    
    const result: GameMatch[] = [];
    for (const game of games) {
      const teamSize = game.teamSize.toLowerCase();
      let shouldInclude = false;
      
      switch (matchCriteria.teamSizeFilter) {
        case "solo":
          shouldInclude = teamSize.includes("solo") || teamSize.includes("1-5");
          break;
        case "small":
          shouldInclude = teamSize.includes("5-20") || teamSize.includes("small");
          break;
        case "medium":
          shouldInclude = teamSize.includes("20-50") || teamSize.includes("medium");
          break;
        case "large":
          shouldInclude = teamSize.includes("100+") || teamSize.includes("large");
          break;
        default:
          shouldInclude = true;
      }
      if (shouldInclude) result.push(game);
    }
    return result;
  };

  const filterByPlatform = (games: GameMatch[]): GameMatch[] => {
    if (matchCriteria.platformFilter === "all") return games;
    
    const result: GameMatch[] = [];
    for (const game of games) {
      const platform = game.platform.toLowerCase();
      let shouldInclude = false;
      
      switch (matchCriteria.platformFilter) {
        case "pc":
          shouldInclude = platform.includes("pc") || platform.includes("steam");
          break;
        case "switch":
          shouldInclude = platform.includes("switch");
          break;
        case "console":
          shouldInclude = platform.includes("playstation") || platform.includes("xbox") || platform.includes("switch");
          break;
        case "mobile":
          shouldInclude = platform.includes("ios") || platform.includes("android") || platform.includes("mobile");
          break;
        case "cross-platform":
          shouldInclude = platform.includes(",") || platform.includes("+");
          break;
        default:
          shouldInclude = true;
      }
      if (shouldInclude) result.push(game);
    }
    return result;
  };

  const filterBySimilarity = (games: GameMatch[]): GameMatch[] => {
    if (matchCriteria.similarityFilter === "all") return games;
    
    const result: GameMatch[] = [];
    for (const game of games) {
      let shouldInclude = false;
      
      switch (matchCriteria.similarityFilter) {
        case "high":
          shouldInclude = game.similarity >= 85;
          break;
        case "medium":
          shouldInclude = game.similarity >= 70 && game.similarity < 85;
          break;
        case "low":
          shouldInclude = game.similarity < 70;
          break;
        default:
          shouldInclude = true;
      }
      if (shouldInclude) result.push(game);
    }
    return result;
  };

  const filterByRevenue = (games: GameMatch[]): GameMatch[] => {
    if (matchCriteria.revenueFilter === "all") return games;
    
    const result: GameMatch[] = [];
    for (const game of games) {
      const revenueNum = parseInt(game.marketPerformance.revenue.replace(/[^\d]/g, ""));
      let shouldInclude = false;
      
      switch (matchCriteria.revenueFilter) {
        case "indie":
          shouldInclude = revenueNum < 100;
          break;
        case "aa":
          shouldInclude = revenueNum >= 100 && revenueNum < 1000;
          break;
        case "aaa":
          shouldInclude = revenueNum >= 1000;
          break;
        default:
          shouldInclude = true;
      }
      if (shouldInclude) result.push(game);
    }
    return result;
  };

  const filterByPlayerBase = (games: GameMatch[]): GameMatch[] => {
    if (matchCriteria.playerBaseFilter === "all") return games;
    
    const result: GameMatch[] = [];
    for (const game of games) {
      const playerNum = parseInt(game.marketPerformance.playerBase.replace(/[^\d]/g, ""));
      let shouldInclude = false;
      
      switch (matchCriteria.playerBaseFilter) {
        case "niche":
          shouldInclude = playerNum < 5;
          break;
        case "popular":
          shouldInclude = playerNum >= 5 && playerNum < 20;
          break;
        case "mainstream":
          shouldInclude = playerNum >= 20;
          break;
        default:
          shouldInclude = true;
      }
      if (shouldInclude) result.push(game);
    }
    return result;
  };

  // Apply filters step by step with explicit types
  const applyMatchCriteria = (gameMatches: GameMatch[]): GameMatch[] => {
    console.log(`Starting with ${gameMatches.length} matches`);
    
    const step1: GameMatch[] = filterByYear(gameMatches);
    console.log(`After year filter: ${step1.length} matches`);
    
    const step2: GameMatch[] = filterByTeamSize(step1);
    console.log(`After team size filter: ${step2.length} matches`);
    
    const step3: GameMatch[] = filterByPlatform(step2);
    console.log(`After platform filter: ${step3.length} matches`);
    
    const step4: GameMatch[] = filterBySimilarity(step3);
    console.log(`After similarity filter: ${step4.length} matches`);
    
    const step5: GameMatch[] = filterByRevenue(step4);
    console.log(`After revenue filter: ${step5.length} matches`);
    
    const final: GameMatch[] = filterByPlayerBase(step5);
    console.log(`Final filtered result: ${final.length} matches`);
    
    return final;
  };

  // Fetch live game data from external APIs
  const fetchLiveGameData = async (themes: string[], mechanics: string[], tone: string, genre?: string, platform?: string): Promise<GameMatch[]> => {
    try {
      console.log('Fetching cross-platform game data...');
      
      const { data, error } = await supabase.functions.invoke('fetch-game-data', {
        body: {
          genre: genre || '',
          themes: themes,
          mechanics: mechanics,
          tone: tone,
          platform: platform || ''
        }
      });

      if (error) {
        console.error('Error calling fetch-game-data function:', error);
        throw error;
      }

      console.log('Cross-platform game data received:', data);
      return data.games || [];
    } catch (error) {
      console.error('Error fetching cross-platform game data:', error);
      toast({
        title: "Live Data Unavailable",
        description: "Falling back to sample data. Check your internet connection.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Enhanced sample data with console games
  const generateMatches = (themes: string[], mechanics: string[], tone: string, genre?: string, platform?: string): GameMatch[] => {
    const gameDatabase = {
      "Nintendo Switch": [
        {
          id: 2001,
          name: "Animal Crossing: New Horizons",
          similarity: 94,
          sharedTags: ["Life Simulation", "Social", "Customization", "Relaxing"],
          platform: "Nintendo Switch",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Create your perfect island paradise with friends in this beloved life simulation",
          consoleUrl: "https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/",
          releaseYear: 2020,
          teamSize: "Large (100+ developers)",
          marketPerformance: {
            revenue: "$2B+ lifetime",
            playerBase: "39M+ players",
            growthRate: "+15% YoY"
          }
        },
        {
          id: 2002,
          name: "Spiritfarer",
          similarity: 89,
          sharedTags: ["Life Simulation", "Management", "Emotional", "Indie"],
          platform: "Switch, PC, Console",
          communitySize: "Medium",
          recentActivity: "Medium",
          description: "A cozy management game about caring for spirits before releasing them into the afterlife",
          steamUrl: "https://store.steampowered.com/app/972660/Spiritfarer/",
          consoleUrl: "https://www.nintendo.com/us/store/products/spiritfarer-switch/",
          releaseYear: 2020,
          teamSize: "Small (5-20 developers)",
          marketPerformance: {
            revenue: "$15M+ lifetime",
            playerBase: "1.5M+ players",
            growthRate: "+8% YoY"
          }
        }
      ],
      "PlayStation": [
        {
          id: 2003,
          name: "Dreams",
          similarity: 87,
          sharedTags: ["Creation", "Community", "Sandbox", "Social"],
          platform: "PlayStation 4, PlayStation 5",
          communitySize: "Large",
          recentActivity: "Medium",
          description: "Create, share and play an endless collection of games, films, art and music",
          consoleUrl: "https://store.playstation.com/en-us/product/UP9000-CUSA08010_00-DREAMS0000000000",
          releaseYear: 2020,
          teamSize: "Medium (20-50 developers)",
          marketPerformance: {
            revenue: "$40M+ lifetime",
            playerBase: "3M+ players",
            growthRate: "+6% YoY"
          }
        }
      ],
      "Mobile": [
        {
          id: 2004,
          name: "Sky: Children of the Light",
          similarity: 85,
          sharedTags: ["Social", "Exploration", "Relaxing", "MMO"],
          platform: "iOS, Android, Switch",
          communitySize: "Very Large",
          recentActivity: "Very High",
          description: "A peaceful MMO about exploring mystical realms and connecting with others",
          consoleUrl: "https://apps.apple.com/us/app/sky-children-of-the-light/id1462117269",
          releaseYear: 2019,
          teamSize: "Medium (20-50 developers)",
          marketPerformance: {
            revenue: "$100M+ lifetime",
            playerBase: "160M+ downloads",
            growthRate: "+25% YoY"
          }
        }
      ],
      "Default": [
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
        }
      ]
    };

    // Return platform-specific games
    if (platform?.toLowerCase().includes('switch')) {
      return gameDatabase["Nintendo Switch"];
    } else if (platform?.toLowerCase().includes('playstation') || platform?.toLowerCase().includes('ps')) {
      return gameDatabase["PlayStation"];
    } else if (platform?.toLowerCase().includes('mobile') || platform?.toLowerCase().includes('ios') || platform?.toLowerCase().includes('android')) {
      return gameDatabase["Mobile"];
    }

    // Default to mixed results
    return [...gameDatabase["Default"], ...gameDatabase["Nintendo Switch"].slice(0, 1)];
  };

  const loadMatches = async (): Promise<void> => {
    try {
      // Load match criteria first
      await loadMatchCriteria();

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

      // Also fetch project details for genre and platform
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('genre, platform')
        .eq('project_id', projectId)
        .maybeSingle();

      if (projectError && projectError.code !== 'PGRST116') {
        console.error('Error loading project:', projectError);
      }

      // Generate matches based on the signal profile data
      const themes: string[] = signalProfile ? jsonToStringArray(signalProfile.themes) : [];
      const mechanics: string[] = signalProfile ? jsonToStringArray(signalProfile.mechanics) : [];
      const tone: string = signalProfile?.tone || "";
      const genre: string = project?.genre || "";
      const platform: string = project?.platform || "";

      // Try to fetch live data first, fall back to sample data
      let generatedMatches: GameMatch[] = [];
      
      try {
        console.log('Attempting to fetch cross-platform game data...');
        generatedMatches = await fetchLiveGameData(themes, mechanics, tone, genre, platform);
        setIsLiveData(true);
        toast({
          title: "Live Data Connected",
          description: "Showing current games from multiple platforms and databases",
        });
      } catch (error) {
        console.log('Live data fetch failed, using enhanced sample data');
        generatedMatches = generateMatches(themes, mechanics, tone, genre, platform);
        setIsLiveData(false);
      }

      setMatches(generatedMatches);
      
      // Apply filters and update filtered matches
      const filtered: GameMatch[] = applyMatchCriteria(generatedMatches);
      setFilteredMatches(filtered);
      
      // Update parent component with filtered match count
      if (onMatchesUpdate) {
        onMatchesUpdate(filtered.length);
      }

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

  useEffect(() => {
    loadMatches();
  }, [projectId]);

  // Re-apply filters when criteria changes
  useEffect(() => {
    if (matches.length > 0) {
      const filtered: GameMatch[] = applyMatchCriteria(matches);
      setFilteredMatches(filtered);
      if (onMatchesUpdate) {
        onMatchesUpdate(filtered.length);
      }
    }
  }, [matchCriteria, matches]);

  const refreshMatches = async (): Promise<void> => {
    setIsRefreshing(true);
    await loadMatches();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleViewDetails = (match: GameMatch): void => {
    if (match.steamUrl) {
      window.open(match.steamUrl, '_blank');
    } else if (match.consoleUrl) {
      window.open(match.consoleUrl, '_blank');
    } else {
      toast({
        title: "Game Details",
        description: `${match.name} - ${match.description}`,
      });
    }
  };

  const getSimilarityColor = (similarity: number): string => {
    if (similarity >= 80) return "bg-green-100 text-green-800";
    if (similarity >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getActivityColor = (activity: string): string => {
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

  const displayMatches: GameMatch[] = filteredMatches.length > 0 ? filteredMatches : matches;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Cross-Platform Match Engine
                {isLiveData ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-gray-400" />
                )}
              </CardTitle>
              <CardDescription>
                {isLiveData 
                  ? "Live games from Steam, console stores, and game databases matching your signal profile."
                  : "Sample games matching your signal profile. Live data temporarily unavailable."
                }
                <span className="block mt-1 text-sm">
                  Found {displayMatches.length} matches 
                  {filteredMatches.length !== matches.length && matches.length > 0 && 
                    ` (filtered from ${matches.length} total)`
                  } across all gaming platforms based on your criteria.
                </span>
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
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {displayMatches.map((match: GameMatch) => (
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
                  {match.sharedTags.map((tag: string) => (
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
                  <div className="flex gap-2">
                    {match.consoleUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(match.consoleUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Console Store
                      </Button>
                    )}
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
              </div>
            ))}
            
            {displayMatches.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {matches.length === 0 
                    ? "No matches found. Try updating your signal profile to get better results."
                    : "No matches found with current filters. Try adjusting your match criteria in the Signal Profile Builder."
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchEngineResults;
