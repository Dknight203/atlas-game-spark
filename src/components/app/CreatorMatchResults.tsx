
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, Play, Calendar, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreatorMatchResultsProps {
  projectId: string;
  onCreatorsUpdate?: (count: number) => void;
}

const CreatorMatchResults = ({ projectId, onCreatorsUpdate }: CreatorMatchResultsProps) => {
  const [creators, setCreators] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          
          // Search for real creators using YouTube API
          const realCreators = await searchYouTubeCreators(projectData);
          setCreators(realCreators);
          
          // Update parent component with creators count
          if (onCreatorsUpdate) {
            onCreatorsUpdate(realCreators.length);
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

  const searchYouTubeCreators = async (projectData: any) => {
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
      console.log('Calling YouTube API with search queries:', searchQueries);
      
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
          setError('YouTube API key not configured. Please set up your YouTube API key to search for real creators.');
          return [];
        }
        throw new Error(data.error);
      }

      console.log('Received creators from YouTube API:', data?.creators?.length || 0);
      return data?.creators || [];
      
    } catch (error) {
      console.error('Error searching YouTube creators:', error);
      throw error;
    }
  };

  const handleSearchCreator = (creator: any) => {
    if (creator.channelUrl) {
      window.open(creator.channelUrl, '_blank');
    } else {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(creator.name)}`;
      window.open(searchUrl, '_blank');
    }
  };

  const handleGetContactInfo = (creator: any) => {
    toast({
      title: "Contact Information",
      description: `To contact ${creator.name}: ${creator.contactMethod || 'Check their YouTube channel about section for business contact details'}`,
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
    if (platform === "YouTube") return "🔴";
    if (platform === "Twitch") return "🟣";
    return "📺";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
        <p className="ml-4 text-gray-600">Searching real YouTube creators...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Creator Match Engine</CardTitle>
          <CardDescription>
            Find real content creators for your indie game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            {error.includes('API key') && (
              <p className="text-gray-600 text-sm">
                You'll need a YouTube Data API v3 key to search for real creators. 
                Once configured, this will show actual YouTube channels that cover games similar to yours.
              </p>
            )}
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
            Real YouTube content creators who cover games similar to yours.
            {project && (
              <span className="block mt-2 text-sm">
                Searching for creators who cover <strong>{project.genre}</strong> games on <strong>{project.platform}</strong>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {creators.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No creators found matching your criteria. Try adjusting your project's genre or platform settings.</p>
            </div>
          ) : (
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
                        <h3 className="text-lg font-semibold">{creator.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{creator.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
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
                    <p className="text-sm text-gray-600 mb-2">Content focus:</p>
                    <div className="flex flex-wrap gap-2">
                      {creator.recentGames.map((game: string, index: number) => (
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
                        View Channel
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorMatchResults;
