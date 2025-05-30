
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, Users, TrendingUp, Clock, Star, CheckCircle } from "lucide-react";

interface Community {
  id: string;
  name: string;
  platform: string;
  members: string;
  activity: string;
  relevance: number;
  lastPost: string;
  description: string;
  tags: string[];
  url: string;
  guidelines: string;
}

interface CommunityCardProps {
  community: Community;
  onViewGuidelines: (community: Community) => void;
  onVisitCommunity: (community: Community) => void;
}

const CommunityCard = ({ community, onViewGuidelines, onVisitCommunity }: CommunityCardProps) => {
  const getSuccessProbability = (relevance: number) => {
    if (relevance >= 85) return { label: "High conversion potential", color: "text-green-700 bg-green-50", icon: "🎯" };
    if (relevance >= 75) return { label: "Good for feedback", color: "text-blue-700 bg-blue-50", icon: "💬" };
    return { label: "Awareness building", color: "text-purple-700 bg-purple-50", icon: "📢" };
  };

  const getActivityIndicator = (activity: string) => {
    if (activity === "Very High") return { color: "bg-green-500", pulse: true };
    if (activity === "High") return { color: "bg-green-400", pulse: false };
    if (activity === "Medium") return { color: "bg-yellow-400", pulse: false };
    return { color: "bg-gray-400", pulse: false };
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === "Reddit") return "🟠";
    if (platform === "Discord") return "🟣";
    return "🌐";
  };

  const successProb = getSuccessProbability(community.relevance);
  const activityIndicator = getActivityIndicator(community.activity);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border hover:border-atlas-purple/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative">
              <div className="text-2xl bg-white rounded-lg p-2 shadow-sm border">
                {getPlatformIcon(community.platform)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${activityIndicator.color} ${activityIndicator.pulse ? 'animate-pulse' : ''}`}></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold group-hover:text-atlas-purple transition-colors">
                  {community.name}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {community.platform}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{community.description}</p>
              
              {/* Success Probability */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${successProb.color}`}>
                <span>{successProb.icon}</span>
                <span>{successProb.label}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{community.members} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{community.lastPost}</span>
          </div>
        </div>

        {/* Action Tags */}
        <div className="flex flex-wrap gap-2">
          {community.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Primary Action */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-atlas-purple hover:bg-atlas-purple/90"
            onClick={() => onVisitCommunity(community)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Start Engagement
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewGuidelines(community)}
          >
            Guidelines
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
