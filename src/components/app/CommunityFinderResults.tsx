
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageCircle, Users, TrendingUp } from "lucide-react";

interface CommunityFinderResultsProps {
  projectId: string;
}

const CommunityFinderResults = ({ projectId }: CommunityFinderResultsProps) => {
  const [communities] = useState([
    {
      id: 1,
      name: "r/indiegames",
      platform: "Reddit",
      members: "890K",
      activity: "Very High",
      relevance: 92,
      lastPost: "2 hours ago",
      description: "A place for indie game developers to share their work",
      tags: ["Indie", "Development", "Showcase"],
      url: "https://reddit.com/r/indiegames"
    },
    {
      id: 2,
      name: "r/spacegames",
      platform: "Reddit",
      members: "45K",
      activity: "High",
      relevance: 88,
      lastPost: "5 hours ago",
      description: "Discussion about space-themed games",
      tags: ["Space", "Gaming", "Discussion"],
      url: "https://reddit.com/r/spacegames"
    },
    {
      id: 3,
      name: "Indie Game Developers",
      platform: "Discord",
      members: "12K",
      activity: "High",
      relevance: 85,
      lastPost: "1 hour ago",
      description: "Active community of indie developers sharing resources and feedback",
      tags: ["Development", "Community", "Feedback"],
      url: "#"
    },
    {
      id: 4,
      name: "Space Game Enthusiasts",
      platform: "Discord",
      members: "8K",
      activity: "Medium",
      relevance: 79,
      lastPost: "3 hours ago",
      description: "Dedicated to discussing and sharing space exploration games",
      tags: ["Space", "Gaming", "Enthusiasts"],
      url: "#"
    }
  ]);

  const getActivityColor = (activity: string) => {
    if (activity === "Very High") return "text-green-600";
    if (activity === "High") return "text-green-500";
    if (activity === "Medium") return "text-yellow-600";
    return "text-gray-600";
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 85) return "bg-green-100 text-green-800";
    if (relevance >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === "Reddit") return "🟠";
    if (platform === "Discord") return "🟣";
    return "🌐";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Opportunity Map</CardTitle>
          <CardDescription>
            Active communities where your target audience is already engaging. Perfect for organic discovery and feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communities.map((community) => (
              <div 
                key={community.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getPlatformIcon(community.platform)}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{community.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{community.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {community.members} members
                        </span>
                        <span className={`flex items-center gap-1 ${getActivityColor(community.activity)}`}>
                          <TrendingUp className="w-4 h-4" />
                          {community.activity} activity
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {community.lastPost}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRelevanceColor(community.relevance)}`}>
                    {community.relevance}% relevant
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {community.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Platform: {community.platform}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Guidelines
                    </Button>
                    <Button size="sm" className="bg-atlas-purple hover:bg-opacity-90">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Community
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

export default CommunityFinderResults;
