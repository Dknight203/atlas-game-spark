
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import YouTubeApiKeySetup from "./YouTubeApiKeySetup";
import EnhancedCreatorCard from "@/components/creator/EnhancedCreatorCard";
import { useCreatorSearch } from "@/hooks/useCreatorSearch";
import { useToast } from "@/hooks/use-toast";
import type { Creator } from "@/types/creator";

interface CreatorMatchResultsProps {
  projectId: string;
  onCreatorsUpdate?: (count: number) => void;
}

const CreatorMatchResults = ({ projectId, onCreatorsUpdate }: CreatorMatchResultsProps) => {
  const { creators, isLoading, error, needsApiKey } = useCreatorSearch(projectId);
  const { toast } = useToast();

  // Update parent component with creators count
  useEffect(() => {
    if (onCreatorsUpdate) {
      onCreatorsUpdate(creators.length);
    }
  }, [creators.length, onCreatorsUpdate]);

  const handleStartCreatorCampaign = (creator: Creator) => {
    toast({
      title: "Creator Campaign",
      description: `Starting outreach campaign for ${creator.name}. Check the Campaigns tab for details.`,
    });
  };

  const handleViewCreatorProfile = (creator: Creator) => {
    if (creator.channelUrl) {
      window.open(creator.channelUrl, '_blank');
    } else {
      toast({
        title: "Creator Profile",
        description: `View ${creator.name}'s profile on ${creator.platform}`,
      });
    }
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
  }, {} as Record<string, Creator[]>);

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

              {/* All creators using enhanced cards */}
              <div className="space-y-4">
                {creators.map((creator) => (
                  <EnhancedCreatorCard 
                    key={creator.id} 
                    creator={creator}
                    onStartCampaign={handleStartCreatorCampaign}
                    onViewProfile={handleViewCreatorProfile}
                  />
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
