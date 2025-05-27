import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, Play, Calendar, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import YouTubeApiKeySetup from "./YouTubeApiKeySetup";

interface CreatorMatchResultsProps {
  projectId: string;
  onCreatorsUpdate?: (count: number) => void;
}

const CreatorMatchResults = ({ projectId, onCreatorsUpdate }: CreatorMatchResultsProps) => {
  const [creators, setCreators] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjectAndCreators = async () => {
      try {
        // Fetch project details
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .maybeSingle();

        if (projectData) {
          setProject(projectData);
          
          // Search for creators across multiple platforms
          const allCreators = await searchMultiPlatformCreators(projectData);
          setCreators(allCreators);
          
          // Update parent component with creators count
          if (onCreatorsUpdate && Array.isArray(allCreators)) {
            onCreatorsUpdate(allCreators.length);
          }
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError('Failed to load creators. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAndCreators();
  }, [projectId, onCreatorsUpdate]);

  const searchMultiPlatformCreators = async (projectData: any) => {
    const genre = projectData.genre?.toLowerCase() || '';
    const platform = projectData.platform?.toLowerCase() || '';
    
    // Build search queries based on project data
    const searchQueries = [
      `${genre} game review`,
      `indie ${genre} games`,
      `${platform} gaming review`,
      'indie game review',
      'small indie games',
      `${genre} gameplay`
    ];

    try {
      console.log('Calling multi-platform creator search with queries:', searchQueries);
      
      const { data, error } = await supabase.functions.invoke('search-youtube-creators', {
        body: { 
          searchQueries,
          genre,
          platform 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        if (data.error.includes('API key not configured')) {
          setNeedsApiKey(true);
          setError('Some platforms require API keys. You can still see creators from other platforms.');
          return Array.isArray(data?.creators) ? data.creators : [];
        }
        throw new Error(data.error);
      }

      const creatorsArray = Array.isArray(data?.creators) ? data.creators : [];
      console.log('Received creators from multi-platform search:', creatorsArray.length);
      return creatorsArray;
      
    } catch (error) {
      console.error('Error searching creators:', error);
      throw error;
    }
  };

  const handleSearchCreator = (creator: any) => {
    if (creator.channelUrl) {
      window.open(creator.channelUrl, '_blank');
    } else {
      let searchUrl = '';
      switch (creator.platform.toLowerCase()) {
        case 'youtube':
          searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(creator.name)}`;
          break;
        case 'twitch':
          searchUrl = `https://www.twitch.tv/search?term=${encodeURIComponent(creator.name)}`;
          break;
        case 'tiktok':
          searchUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(creator.name)}`;
          break;
        case 'twitter':
          searchUrl = `https://twitter.com/search?q=${encodeURIComponent(creator.name)}`;
          break;
        case 'instagram':
          searchUrl = `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(creator.name)}`;
          break;
        default:
          searchUrl = `https://www.google.com/search?q=${encodeURIComponent(creator.name + ' gaming')}`;
      }
      window.open(searchUrl, '_blank');
    }
  };

  const handleGetContactInfo = (creator: any) => {
    toast({
      title: "Contact Information",
      description: `To contact ${creator.name}: ${creator.contactMethod || 'Check their profile for business contact details'}`,
    });
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
    const platformLower = platform.toLowerCase();
    if (platformLower === "youtube") return "🔴";
    if (platformLower === "twitch") return "🟣";
    if (platformLower === "tiktok") return "⚫";
    if (platformLower === "twitter") return "🔵";
    if (platformLower === "instagram") return "🟠";
    return "📺";
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower === "youtube") return "bg-red-100 text-red-800";
    if (platformLower === "twitch") return "bg-purple-100 text-purple-800";
    if (platformLower === "tiktok") return "bg-gray-100 text-gray-800";
    if (platformLower === "twitter") return "bg-blue-100 text-blue-800";
    if (platformLower === "instagram") return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  // Group creators by platform for better organization
  const creatorsByPlatform = creators.reduce((acc, creator) => {
    const platform = creator.platform;
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(creator);
    return acc;
  }, {} as Record<string, any[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
        <p className="ml-4 text-gray-600">Searching creators across multiple platforms...</p>
      </div>
    );
  }

  if (needsApiKey && creators.length === 0) {
    return <YouTubeApiKeySetup />;
  }

  if (error && creators.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Creator Match Engine</CardTitle>
          <CardDescription>
            Find content creators across multiple platforms for your indie game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Creator Match Engine</CardTitle>
          <CardDescription>
            Content creators across YouTube, Twitch, TikTok, Twitter, and Instagram who cover games similar to yours.
            {project && (
              <span className="block mt-2 text-sm">
                Searching for creators who cover <strong>{project.genre}</strong> games on <strong>{project.platform}</strong>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {needsApiKey && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 For YouTube creators with real-time data, set up your YouTube API key. Currently showing sample data and other platforms.
              </p>
            </div>
          )}
          
          {creators.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No creators found matching your criteria. Try adjusting your project's genre or platform settings.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Platform summary */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(creatorsByPlatform).map(([platform, platformCreators]) => (
                  <Badge key={platform} variant="outline" className={getPlatformColor(platform)}>
                    {getPlatformIcon(platform)} {platform}: {platformCreators.length}
                  </Badge>
                ))}
              </div>

              {/* All creators in one list, sorted by match score */}
              <div className="space-y-4">
                {creators.map((creator) => (
                  <div 
                    key={creator.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getPlatformIcon(creator.platform)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{creator.name}</h3>
                            <Badge variant="outline" className={`text-xs ${getPlatformColor(creator.platform)}`}>
                              {creator.platform}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{creator.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {creator.subscribers}
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
                      <p className="text-sm text-gray-600 mb-2">Content focus:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(creator.recentGames) && creator.recentGames.map((game: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSearchCreator(creator)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-atlas-purple hover:bg-opacity-90"
                          onClick={() => handleGetContactInfo(creator)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Info
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorMatchResults;
