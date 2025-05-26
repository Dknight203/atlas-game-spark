
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw, Filter } from "lucide-react";

interface MatchEngineResultsProps {
  projectId: string;
}

const MatchEngineResults = ({ projectId }: MatchEngineResultsProps) => {
  const [matches] = useState([
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
    },
    {
      id: 3,
      name: "Astroneer",
      similarity: 79,
      sharedTags: ["Space", "Exploration", "Crafting", "Co-op"],
      platform: "Steam",
      communitySize: "Medium",
      recentActivity: "Medium",
      description: "Space exploration and crafting game with unique deformation mechanics"
    },
    {
      id: 4,
      name: "Elite Dangerous",
      similarity: 75,
      sharedTags: ["Space", "Trading", "Simulation"],
      platform: "Steam",
      communitySize: "Large",
      recentActivity: "Medium",
      description: "Space trading and combat simulation with massive galaxy"
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMatches = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
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
