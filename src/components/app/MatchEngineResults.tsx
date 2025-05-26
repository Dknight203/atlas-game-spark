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
  releaseYear: number;
  teamSize: string;
  marketPerformance: {
    revenue: string;
    playerBase: string;
    growthRate: string;
  };
}

const MatchEngineResults = ({ projectId, onMatchesUpdate }: MatchEngineResultsProps) => {
  const [matches, setMatches] = useState<GameMatch[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMarketData, setShowMarketData] = useState(false);
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
      
      // Update parent component with match count
      if (onMatchesUpdate) {
        onMatchesUpdate(generatedMatches.length);
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
                  ? "Live games from Steam and other databases matching your signal profile criteria."
                  : "Sample games matching your signal profile criteria. Live data temporarily unavailable."
                }
                <span className="block mt-1 text-sm">
                  Found {matches.length} matches based on your signal profile and match criteria.
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
            {matches.map((match) => (
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
            
            {matches.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No matches found. Try updating your signal profile to get better results.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchEngineResults;
