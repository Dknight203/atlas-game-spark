
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, DollarSign, TrendingUp, Calendar, Users } from "lucide-react";
import type { EnhancedGameData } from "@/types/discovery";

interface EnhancedGameCardProps {
  game: EnhancedGameData;
  onTrack?: (gameId: string) => void;
  onAnalyze?: (gameId: string) => void;
}

const EnhancedGameCard = ({ game, onTrack, onAnalyze }: EnhancedGameCardProps) => {
  const formatNumber = (num?: number): string => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num?: number): string => {
    if (!num) return 'N/A';
    return `$${formatNumber(num)}`;
  };

  const formatPercentage = (num?: number): string => {
    if (!num) return 'N/A';
    return `${(num * 100).toFixed(1)}%`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{game.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {game.developer} • {game.platform}
            </p>
          </div>
          <Badge variant="outline">{game.platform}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Genres and Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {game.genre.slice(0, 3).map(genre => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {game.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{game.rating_average?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>${game.price?.toFixed(2) || 'Free'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-blue-500" />
            <span>{formatNumber(game.download_count)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span>{formatCurrency(game.revenue_estimate)}</span>
          </div>
        </div>

        {/* Player Retention */}
        {(game.player_retention_d1 || game.player_retention_d7 || game.player_retention_d30) && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Player Retention
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">{formatPercentage(game.player_retention_d1)}</div>
                <div className="text-gray-500">Day 1</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatPercentage(game.player_retention_d7)}</div>
                <div className="text-gray-500">Day 7</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatPercentage(game.player_retention_d30)}</div>
                <div className="text-gray-500">Day 30</div>
              </div>
            </div>
          </div>
        )}

        {/* Release Date */}
        {game.release_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(game.release_date).toLocaleDateString()}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onTrack && (
            <Button size="sm" variant="outline" onClick={() => onTrack(game.game_id)}>
              Track
            </Button>
          )}
          {onAnalyze && (
            <Button size="sm" onClick={() => onAnalyze(game.game_id)}>
              Analyze
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedGameCard;
