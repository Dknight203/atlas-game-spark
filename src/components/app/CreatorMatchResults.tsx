
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, Play, Calendar } from "lucide-react";

interface CreatorMatchResultsProps {
  projectId: string;
}

const CreatorMatchResults = ({ projectId }: CreatorMatchResultsProps) => {
  const [creators] = useState([
    {
      id: 1,
      name: "SpaceGameReviews",
      platform: "YouTube",
      subscribers: "124K",
      avgViews: "35K",
      engagement: "High",
      matchScore: 91,
      lastVideo: "3 days ago",
      recentGames: ["Starbound", "No Man's Sky", "Astroneer"],
      description: "Reviews and gameplay of space exploration games",
      url: "#"
    },
    {
      id: 2,
      name: "IndieSpotlight",
      platform: "Twitch",
      subscribers: "67K",
      avgViews: "2.1K",
      engagement: "Very High",
      matchScore: 87,
      lastVideo: "1 day ago",
      recentGames: ["Hollow Knight", "Celeste", "A Hat in Time"],
      description: "Live streams focusing on indie game discoveries",
      url: "#"
    },
    {
      id: 3,
      name: "CosmicGamerTV",
      platform: "YouTube",
      subscribers: "89K",
      avgViews: "18K",
      engagement: "Medium",
      matchScore: 84,
      lastVideo: "5 days ago",
      recentGames: ["Elite Dangerous", "Kerbal Space Program", "Outer Worlds"],
      description: "Space simulation and exploration game content",
      url: "#"
    },
    {
      id: 4,
      name: "IndieDeveloperTalks",
      platform: "YouTube",
      subscribers: "203K",
      avgViews: "42K",
      engagement: "High",
      matchScore: 82,
      lastVideo: "1 week ago",
      recentGames: ["Various Indie Titles"],
      description: "Interviews with indie developers and game showcases",
      url: "#"
    }
  ]);

  const getEngagementColor = (engagement: string) => {
    if (engagement === "Very High") return "text-green-600";
    if (engagement === "High") return "text-green-500";
    if (engagement === "Medium") return "text-yellow-600";
    return "text-gray-600";
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800";
    if (score >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === "YouTube") return "🔴";
    if (platform === "Twitch") return "🟣";
    return "📺";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Creator Match Engine</CardTitle>
          <CardDescription>
            Content creators who have recently covered similar games and have active audiences that match your target demographic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creators.map((creator) => (
              <div 
                key={creator.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getPlatformIcon(creator.platform)}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{creator.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{creator.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {creator.subscribers} subs
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          {creator.avgViews} avg views
                        </span>
                        <span className={`flex items-center gap-1 ${getEngagementColor(creator.engagement)}`}>
                          📊 {creator.engagement} engagement
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {creator.lastVideo}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(creator.matchScore)}`}>
                    {creator.matchScore}% match
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Recently covered games:</p>
                  <div className="flex flex-wrap gap-2">
                    {creator.recentGames.map((game) => (
                      <Badge key={game} variant="outline" className="text-xs">
                        {game}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Platform: {creator.platform}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button size="sm" className="bg-atlas-purple hover:bg-opacity-90">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Contact Creator
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorMatchResults;
