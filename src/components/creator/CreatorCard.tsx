
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, Play, Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Creator } from "@/types/creator";

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const { toast } = useToast();

  const handleSearchCreator = () => {
    if (creator.channelUrl) {
      window.open(creator.channelUrl, '_blank');
    } else {
      let searchUrl = '';
      switch (creator.platform.toLowerCase()) {
        case 'youtube':
          searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(creator.name)}`;
          break;
        case 'twitch':
          searchUrl = `https://www.twitch.com/search?term=${encodeURIComponent(creator.name)}`;
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

  const handleGetContactInfo = () => {
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

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
            onClick={handleSearchCreator}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button 
            size="sm" 
            className="bg-atlas-purple hover:bg-opacity-90"
            onClick={handleGetContactInfo}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
