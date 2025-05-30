
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, Star, DollarSign, MessageSquare, TrendingUp } from "lucide-react";
import type { Creator } from "@/types/creator";

interface EnhancedCreatorCardProps {
  creator: Creator;
  onStartCampaign: (creator: Creator) => void;
  onViewProfile: (creator: Creator) => void;
}

const EnhancedCreatorCard = ({ creator, onStartCampaign, onViewProfile }: EnhancedCreatorCardProps) => {
  const getCollaborationType = (matchScore: number, platform: string) => {
    if (matchScore >= 90) return { type: "Sponsored Review", budget: "$200-500", icon: "🌟" };
    if (matchScore >= 80) return { type: "Stream Feature", budget: "$100-300", icon: "🎮" };
    if (matchScore >= 70) return { type: "Social Mention", budget: "$50-150", icon: "📱" };
    return { type: "Free Copy", budget: "Free", icon: "🎁" };
  };

  const getPlatformStyle = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower === "youtube") return { bg: "bg-red-50", text: "text-red-700", icon: "🔴" };
    if (platformLower === "twitch") return { bg: "bg-purple-50", text: "text-purple-700", icon: "🟣" };
    if (platformLower === "tiktok") return { bg: "bg-gray-50", text: "text-gray-700", icon: "⚫" };
    if (platformLower === "twitter") return { bg: "bg-blue-50", text: "text-blue-700", icon: "🔵" };
    if (platformLower === "instagram") return { bg: "bg-orange-50", text: "text-orange-700", icon: "🟠" };
    return { bg: "bg-gray-50", text: "text-gray-700", icon: "📺" };
  };

  const collaboration = getCollaborationType(creator.matchScore, creator.platform);
  const platformStyle = getPlatformStyle(creator.platform);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border hover:border-atlas-purple/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative">
              {creator.thumbnailUrl ? (
                <img 
                  src={creator.thumbnailUrl} 
                  alt={creator.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className={`w-12 h-12 rounded-lg ${platformStyle.bg} flex items-center justify-center text-lg`}>
                  {platformStyle.icon}
                </div>
              )}
              <div className="absolute -top-1 -right-1">
                <Badge variant="secondary" className={`text-xs ${platformStyle.bg} ${platformStyle.text}`}>
                  {creator.platform}
                </Badge>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold group-hover:text-atlas-purple transition-colors mb-1">
                {creator.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{creator.description}</p>
              
              {/* Recommended Collaboration */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{collaboration.icon}</span>
                <span className="text-sm font-medium">{collaboration.type}</span>
                <Badge variant="outline" className="text-xs">
                  {collaboration.budget}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-medium text-atlas-purple">
              <Star className="w-4 h-4 fill-current" />
              {creator.matchScore}% match
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Creator Stats */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="font-medium">{creator.subscribers}</div>
            <div className="text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{creator.avgViews}</div>
            <div className="text-gray-500">Avg Views</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{creator.engagement}</div>
            <div className="text-gray-500">Engagement</div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Recent Coverage</div>
          <div className="flex flex-wrap gap-1">
            {creator.recentGames.slice(0, 3).map((game, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {game}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-atlas-purple hover:bg-atlas-purple/90"
            onClick={() => onStartCampaign(creator)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Campaign
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewProfile(creator)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCreatorCard;
