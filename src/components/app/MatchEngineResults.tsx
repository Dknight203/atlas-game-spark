
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw, Filter } from "lucide-react";
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
}

const MatchEngineResults = ({ projectId }: MatchEngineResultsProps) => {
  const [matches, setMatches] = useState<GameMatch[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonData: any): string[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.filter(item => typeof item === 'string');
    }
    return [];
  };

  // Generate matches based on signal profile
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
          description: "Create and control virtual people in a detailed life simulation game"
        },
        {
          id: 2,
          name: "Animal Crossing: New Horizons",
          similarity: 88,
          sharedTags: ["Life Simulation", "Customization", "Social", "Collecting"],
          platform: "Nintendo Switch",
          communitySize: "Large",
          recentActivity: "High",
          description: "Build your island paradise in this charming social simulation"
        },
        {
          id: 3,
          name: "Stardew Valley",
          similarity: 85,
          sharedTags: ["Life Simulation", "Farming", "Relationships", "Crafting"],
          platform: "Multiple",
          communitySize: "Large",
          recentActivity: "High",
          description: "Farm, mine, fight, and build relationships in this pixel art life sim"
        },
        {
          id: 4,
          name: "My Time at Portia",
          similarity: 78,
          sharedTags: ["Life Simulation", "Crafting", "Building", "RPG Elements"],
          platform: "Multiple",
          communitySize: "Medium",
          recentActivity: "Medium",
          description: "Restore your father's workshop in this charming post-apocalyptic life sim"
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
          description: "Epic fantasy RPG with massive open world and endless possibilities"
        },
        {
          id: 2,
          name: "The Witcher 3",
          similarity: 86,
          sharedTags: ["Story-Rich", "Fantasy", "Character Development", "Open World"],
          platform: "Multiple",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Hunt monsters and navigate political intrigue in this acclaimed RPG"
        },
        {
          id: 3,
          name: "Divinity: Original Sin 2",
          similarity: 83,
          sharedTags: ["Turn-Based", "Co-op", "Fantasy", "Strategic Combat"],
          platform: "Multiple",
          communitySize: "Large",
          recentActivity: "Medium",
          description: "Tactical RPG with deep character customization and cooperative gameplay"
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
          description: "2D space exploration game with building and crafting mechanics"
        },
        {
          id: 2,
          name: "No Man's Sky",
          similarity: 82,
          sharedTags: ["Space", "Exploration", "Crafting", "Procedural"],
          platform: "Steam",
          communitySize: "Very Large",
          recentActivity: "High",
          description: "Infinite procedural space exploration and survival game"
        }
      ],
      "Strategy": [
        {
          id: 1,
          name: "Civilization VI",
          similarity: 91,
          sharedTags: ["Turn-Based", "Empire Building", "Historical", "Strategy"],
          platform: "Multiple",
          communitySize: "Large",
          recentActivity: "High",
          description: "Build an empire to stand the test of time in this classic strategy game"
        },
        {
          id: 2,
          name: "Cities: Skylines",
          similarity: 88,
          sharedTags: ["City Building", "Management", "Simulation", "Planning"],
          platform: "Multiple",
          communitySize: "Large",
          recentActivity: "Medium",
          description: "Design and manage your own modern city in this city-building simulation"
        }
      ]
    };

    // Determine game category based on themes, mechanics, and genre
    let category = "RPG"; // default
    
    if (genre) {
      if (genre.toLowerCase().includes("life") || genre.toLowerCase().includes("sim")) {
        category = "Life Sim";
      } else if (genre.toLowerCase().includes("strategy")) {
        category = "Strategy";
      } else if (genre.toLowerCase().includes("rpg")) {
        category = "RPG";
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

    return gameDatabase[category as keyof typeof gameDatabase] || gameDatabase["RPG"];
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

      const generatedMatches = generateMatches(themes, mechanics, tone, genre);
      setMatches(generatedMatches);

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

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return "bg-green-100 text-green-800";
    if (similarity >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getActivityColor = (activity: string) => {
    if (activity === "High") return "text-green-600";
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
              <CardTitle>Cross-Game Match Engine</CardTitle>
              <CardDescription>
                Games with similar audiences and mechanics to help you identify potential communities and marketing opportunities.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
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
                  <div>
                    <h3 className="text-lg font-semibold">{match.name}</h3>
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
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Community: {match.communitySize}</span>
                    <span className={getActivityColor(match.recentActivity)}>
                      Activity: {match.recentActivity}
                    </span>
                    <span>Platform: {match.platform}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchEngineResults;
