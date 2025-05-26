import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, Play, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CreatorMatchResultsProps {
  projectId: string;
}

const CreatorMatchResults = ({ projectId }: CreatorMatchResultsProps) => {
  const [creators, setCreators] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndCreators = async () => {
      try {
        // Fetch project details to generate relevant creators
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .maybeSingle();

        if (projectData) {
          setProject(projectData);
          
          // Generate creators based on project genre and platform
          const generatedCreators = generateCreatorsFromProject(projectData);
          setCreators(generatedCreators);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAndCreators();
  }, [projectId]);

  const generateCreatorsFromProject = (projectData: any) => {
    const genre = projectData.genre?.toLowerCase() || '';
    const platform = projectData.platform?.toLowerCase() || '';
    
    const baseCreators = [];

    // Always include general indie creator
    baseCreators.push({
      id: 1,
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
    });

    // Add genre-specific creators
    if (genre.includes('space') || genre.includes('sci-fi')) {
      baseCreators.unshift({
        id: 2,
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
      });

      baseCreators.push({
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
      });
    }

    if (genre.includes('rpg')) {
      baseCreators.push({
        id: 4,
        name: "RPGMasterClass",
        platform: "YouTube",
        subscribers: "178K",
        avgViews: "28K",
        engagement: "High",
        matchScore: 89,
        lastVideo: "2 days ago",
        recentGames: ["Baldur's Gate 3", "Divinity: Original Sin 2", "Disco Elysium"],
        description: "In-depth RPG reviews and character build guides",
        url: "#"
      });
    }

    if (genre.includes('action') || genre.includes('adventure')) {
      baseCreators.push({
        id: 5,
        name: "ActionAdventureHub",
        platform: "YouTube",
        subscribers: "203K",
        avgViews: "42K",
        engagement: "High",
        matchScore: 82,
        lastVideo: "1 week ago",
        recentGames: ["The Legend of Zelda", "Assassin's Creed", "Horizon"],
        description: "Action-adventure game reviews and walkthroughs",
        url: "#"
      });
    }

    // Always add indie-focused creator
    baseCreators.push({
      id: 6,
      name: "IndieDeveloperTalks",
      platform: "YouTube",
      subscribers: "156K",
      avgViews: "22K",
      engagement: "High",
      matchScore: 80,
      lastVideo: "4 days ago",
      recentGames: ["Various Indie Titles"],
      description: "Interviews with indie developers and game showcases",
      url: "#"
    });

    // Return only the number that matches the actual count
    return baseCreators.slice(0, Math.min(baseCreators.length, 6));
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
        <p className="ml-4 text-gray-600">Finding relevant creators...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Creator Match Engine</CardTitle>
          <CardDescription>
            Content creators who have recently covered similar games and have active audiences that match your target demographic.
            {project && (
              <span className="block mt-2 text-sm">
                Showing creators who cover <strong>{project.genre}</strong> games on <strong>{project.platform}</strong>
              </span>
            )}
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
