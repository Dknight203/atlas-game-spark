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
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all");
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

  // Fallback sample data (existing generateMatches function)
  const generateMatches = (themes: string[], mechanics: string[], tone: string, genre?: string) => {
    const gameDatabase = {
      "Life Sim": [
        {
          id: 1,
          name: "The Sims 4",
          similarity: 92,
          sharedTags: ["Life Simulation", "Character Customization", "Building", "Relationships"],
          platform: "Multiple",
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
          name: "Life by You",
          similarity: 88,
          sharedTags: ["Life Simulation", "Character Customization", "Building", "Modding"],
          platform: "PC",
          communitySize: "Medium",
          recentActivity: "Very High",
          description: "Next-generation life simulation with unprecedented customization",
          steamUrl: "https://store.steampowered.com/app/1521190/Life_by_You/",
          releaseYear: 2025,
          teamSize: "Medium (20-50 developers)",
          marketPerformance: {
            revenue: "$15M pre-launch",
            playerBase: "500K+ wishlist",
            growthRate: "+200% YoY"
          }
        },
        {
          id: 12,
          name: "Paralives",
          similarity: 85,
          sharedTags: ["Life Simulation", "Architecture", "Creativity", "Community"],
          platform: "PC",
          communitySize: "Large",
          recentActivity: "Very High",
          description: "Innovative life simulation focusing on creativity and player freedom",
          releaseYear: 2025,
          teamSize: "Small (5-20 developers)",
          marketPerformance: {
            revenue: "$8M crowdfunded",
            playerBase: "1M+ followers",
            growthRate: "+150% YoY"
          }
        }
      ],
      "RPG": [
        {
          id: 1,
          name: "The Elder Scrolls V: Skyrim",
          similarity: 89,
          sharedTags: ["Open World", "Character Progression", "Fantasy", "Exploration"],
          platform: "Multiple",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Epic fantasy RPG with massive open world and endless possibilities",
          steamUrl: "https://store.steampowered.com/app/489830/The_Elder_Scrolls_V_Skyrim_Special_Edition/",
          releaseYear: 2011,
          teamSize: "Large (100+ developers)",
          marketPerformance: {
            revenue: "$1.9B+ lifetime",
            playerBase: "60M+ players",
            growthRate: "+4% YoY"
          }
        },
        {
          id: 2,
          name: "The Witcher 3",
          similarity: 86,
          sharedTags: ["Story-Rich", "Fantasy", "Character Development", "Open World"],
          platform: "Multiple",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Hunt monsters and navigate political intrigue in this acclaimed RPG",
          steamUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
          releaseYear: 2015,
          teamSize: "Large (100+ developers)",
          marketPerformance: {
            revenue: "$688M lifetime",
            playerBase: "50M+ players",
            growthRate: "+6% YoY"
          }
        },
        {
          id: 3,
          name: "Divinity: Original Sin 2",
          similarity: 83,
          sharedTags: ["Turn-Based", "Co-op", "Fantasy", "Strategic Combat"],
          platform: "Multiple",
          communitySize: "Large",
          recentActivity: "Medium",
          description: "Tactical RPG with deep character customization and cooperative gameplay",
          steamUrl: "https://store.steampowered.com/app/435150/Divinity_Original_Sin_2__Definitive_Edition/",
          releaseYear: 2017,
          teamSize: "Medium (20-50 developers)",
          marketPerformance: {
            revenue: "$85M lifetime",
            playerBase: "7M+ players",
            growthRate: "+10% YoY"
          }
        },
        {
          id: 4,
          name: "Baldur's Gate 3",
          similarity: 91,
          sharedTags: ["Turn-Based", "Story-Rich", "Character Development", "Fantasy"],
          platform: "Multiple",
          communitySize: "Very Large",
          recentActivity: "Very High",
          description: "Epic D&D adventure with unprecedented choice and consequence",
          steamUrl: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
          releaseYear: 2023,
          teamSize: "Large (100+ developers)",
          marketPerformance: {
            revenue: "$650M in 2023",
            playerBase: "22M+ players",
            growthRate: "+180% YoY"
          }
        }
      ],
      "Space": [
        {
          id: 1,
          name: "Starbound",
          similarity: 87,
          sharedTags: ["Space", "Exploration", "Crafting", "2D"],
          platform: "Steam",
          communitySize: "Large",
          recentActivity: "High",
          description: "2D space exploration game with building and crafting mechanics",
          steamUrl: "https://store.steampowered.com/app/211820/Starbound/",
          releaseYear: 2016,
          teamSize: "Small (5-20 developers)",
          marketPerformance: {
            revenue: "$45M lifetime",
            playerBase: "5M+ players",
            growthRate: "+2% YoY"
          }
        },
        {
          id: 2,
          name: "No Man's Sky",
          similarity: 82,
          sharedTags: ["Space", "Exploration", "Crafting", "Procedural"],
          platform: "Steam",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Infinite procedural space exploration and survival game",
          steamUrl: "https://store.steampowered.com/app/275850/No_Mans_Sky/",
          releaseYear: 2016,
          teamSize: "Small (5-20 developers)",
          marketPerformance: {
            revenue: "$200M+ lifetime",
            playerBase: "15M+ players",
            growthRate: "+25% YoY"
          }
        },
        {
          id: 3,
          name: "Kerbal Space Program",
          similarity: 79,
          sharedTags: ["Space", "Physics", "Building", "Educational"],
          platform: "Multiple",
          communitySize: "Large",
          recentActivity: "Medium",
          description: "Build and fly spacecraft in this realistic space simulation",
          steamUrl: "https://store.steampowered.com/app/220200/Kerbal_Space_Program/",
          releaseYear: 2015,
          teamSize: "Medium (20-50 developers)",
          marketPerformance: {
            revenue: "$100M+ lifetime",
            playerBase: "8M+ players",
            growthRate: "+1% YoY"
          }
        }
      ]
    };

    // Determine game category based on themes, mechanics, and genre
    let category = "Life Sim"; // default for life simulation projects
    
    if (genre) {
      if (genre.toLowerCase().includes("rpg")) {
        category = "RPG";
      } else if (genre.toLowerCase().includes("strategy")) {
        category = "RPG"; // Use RPG as fallback for strategy
      }
    }

    // Check themes for space-related content
    const spaceThemes = themes.some(theme => 
      theme.toLowerCase().includes("space") || 
      theme.toLowerCase().includes("sci-fi") || 
      theme.toLowerCase().includes("futuristic")
    );
    
    if (spaceThemes) {
      category = "Space";
    }

    return gameDatabase[category as keyof typeof gameDatabase] || gameDatabase["Life Sim"];
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

      // Also fetch project details for genre - fix the column name
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

  // Filter matches based on selected criteria
  useEffect(() => {
    let filtered = [...matches];

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

    setFilteredMatches(filtered);
  }, [matches, yearFilter, teamSizeFilter]);

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

          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-40">
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
              <SelectTrigger className="w-40">
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
                <p className="text-gray-500">No matches found for the selected filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setYearFilter("all");
                    setTeamSizeFilter("all");
                  }}
                >
                  Clear Filters
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
