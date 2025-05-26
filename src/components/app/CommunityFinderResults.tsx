
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageCircle, Users, TrendingUp, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CommunityFinderResultsProps {
  projectId: string;
}

const CommunityFinderResults = ({ projectId }: CommunityFinderResultsProps) => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjectAndCommunities = async () => {
      try {
        // Fetch project details to generate relevant communities
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .maybeSingle();

        if (projectData) {
          setProject(projectData);
          
          // Generate communities based on project genre and platform
          const generatedCommunities = generateCommunitiesFromProject(projectData);
          setCommunities(generatedCommunities);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAndCommunities();
  }, [projectId]);

  const generateCommunitiesFromProject = (projectData: any) => {
    const genre = projectData.genre?.toLowerCase() || '';
    const platform = projectData.platform?.toLowerCase() || '';
    
    const baseCommunities = [];

    // Always include the main indie games community
    baseCommunities.push({
      id: 1,
      name: "r/indiegames",
      platform: "Reddit",
      members: "890K",
      activity: "Very High",
      relevance: 95,
      lastPost: "2 hours ago",
      description: "A place for indie game developers to share their work",
      tags: ["Indie", "Development", "Showcase"],
      url: "https://reddit.com/r/indiegames",
      guidelines: "Post only on weekends for game showcases. Include [DEV] tag and be active in comments."
    });

    // Add genre-specific communities
    if (genre.includes('space') || genre.includes('sci-fi')) {
      baseCommunities.push({
        id: 2,
        name: "r/spacegames",
        platform: "Reddit",
        members: "45K",
        activity: "High",
        relevance: 88,
        lastPost: "5 hours ago",
        description: "Discussion about space-themed games",
        tags: ["Space", "Gaming", "Discussion"],
        url: "https://reddit.com/r/spacegames",
        guidelines: "Focus on space exploration themes. Screenshots and gameplay videos welcome."
      });
    }

    if (genre.includes('rpg')) {
      baseCommunities.push({
        id: 3,
        name: "r/rpg_gamers",
        platform: "Reddit",
        members: "156K",
        activity: "High",
        relevance: 85,
        lastPost: "1 hour ago",
        description: "Community for RPG enthusiasts and developers",
        tags: ["RPG", "Character Development", "Storytelling"],
        url: "https://reddit.com/r/rpg_gamers",
        guidelines: "Include character progression mechanics. Story-driven content preferred."
      });
    }

    if (genre.includes('life') || genre.includes('sim')) {
      baseCommunities.push({
        id: 4,
        name: "r/LifeSimulationGames",
        platform: "Reddit",
        members: "89K",
        activity: "High",
        relevance: 92,
        lastPost: "3 hours ago",
        description: "Dedicated to life simulation and virtual life games",
        tags: ["Life Sim", "Virtual Life", "Character Creation"],
        url: "https://reddit.com/r/LifeSimulationGames",
        guidelines: "Focus on daily life mechanics and character relationships. Building/customization content welcome."
      });
    }

    // Add platform-specific communities
    if (platform.includes('pc') || platform.includes('steam')) {
      baseCommunities.push({
        id: 5,
        name: "r/pcgaming",
        platform: "Reddit",
        members: "2.8M",
        activity: "Very High",
        relevance: 79,
        lastPost: "30 minutes ago",
        description: "PC gaming community for discussions and recommendations",
        tags: ["PC", "Steam", "Gaming"],
        url: "https://reddit.com/r/pcgaming",
        guidelines: "Tech specs and performance discussions welcome. Follow self-promotion rules."
      });
    }

    // Always add Discord community
    baseCommunities.push({
      id: 6,
      name: "Indie Game Developers",
      platform: "Discord",
      members: "12K",
      activity: "High",
      relevance: 85,
      lastPost: "1 hour ago",
      description: "Active community of indie developers sharing resources and feedback",
      tags: ["Development", "Community", "Feedback"],
      url: "https://discord.gg/indiegamedev",
      guidelines: "Share work-in-progress for feedback. Participate in weekly showcases."
    });

    return baseCommunities;
  };

  const handleViewGuidelines = (community: any) => {
    toast({
      title: `${community.name} Guidelines`,
      description: community.guidelines || "General community guidelines apply. Be respectful and follow posting rules.",
    });
  };

  const handleVisitCommunity = (community: any) => {
    if (community.url && community.url !== "#") {
      window.open(community.url, '_blank');
    } else {
      toast({
        title: "Community Link",
        description: `Visit ${community.name} to connect with the community`,
      });
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
        <p className="ml-4 text-gray-600">Finding relevant communities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Opportunity Map</CardTitle>
          <CardDescription>
            Active communities where your target audience is already engaging. Perfect for organic discovery and feedback.
            {project && (
              <span className="block mt-2 text-sm">
                Showing communities relevant to <strong>{project.genre}</strong> games on <strong>{project.platform}</strong>
              </span>
            )}
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewGuidelines(community)}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      View Guidelines
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-atlas-purple hover:bg-opacity-90"
                      onClick={() => handleVisitCommunity(community)}
                    >
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
