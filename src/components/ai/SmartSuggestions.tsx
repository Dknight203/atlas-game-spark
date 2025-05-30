
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { Lightbulb, TrendingUp, Users, Target } from "lucide-react";

interface SmartSuggestionsProps {
  type: 'profile' | 'discovery' | 'marketing';
  data: any;
  onSuggestionApply: (suggestion: any) => void;
  className?: string;
}

const SmartSuggestions = ({ type, data, onSuggestionApply, className }: SmartSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<any>(null);
  const { getProfileSuggestions, getDiscoveryFilterSuggestions, getMarketingRecommendations, isLoading } = useAIRecommendations();

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        let result;
        switch (type) {
          case 'profile':
            result = await getProfileSuggestions(data);
            break;
          case 'discovery':
            result = await getDiscoveryFilterSuggestions(data);
            break;
          case 'marketing':
            result = await getMarketingRecommendations(data);
            break;
        }
        setSuggestions(result);
      } catch (error) {
        console.error('Error loading suggestions:', error);
      }
    };

    loadSuggestions();
  }, [type, data, getProfileSuggestions, getDiscoveryFilterSuggestions, getMarketingRecommendations]);

  const getIcon = () => {
    switch (type) {
      case 'profile': return <Lightbulb className="w-4 h-4" />;
      case 'discovery': return <TrendingUp className="w-4 h-4" />;
      case 'marketing': return <Target className="w-4 h-4" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'profile': return 'Profile Suggestions';
      case 'discovery': return 'Discovery Recommendations';
      case 'marketing': return 'Marketing Insights';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-atlas-purple"></div>
            Generating AI suggestions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions) return null;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          {getIcon()}
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'profile' && (
          <div className="space-y-3">
            {suggestions.themes?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Suggested Themes</h4>
                <div className="flex flex-wrap gap-1">
                  {suggestions.themes.slice(0, 5).map((theme: string) => (
                    <Badge 
                      key={theme} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-atlas-purple hover:text-white"
                      onClick={() => onSuggestionApply({ type: 'theme', value: theme })}
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {suggestions.mechanics?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Suggested Mechanics</h4>
                <div className="flex flex-wrap gap-1">
                  {suggestions.mechanics.slice(0, 5).map((mechanic: string) => (
                    <Badge 
                      key={mechanic} 
                      variant="outline"
                      className="cursor-pointer hover:bg-atlas-purple hover:text-white"
                      onClick={() => onSuggestionApply({ type: 'mechanic', value: mechanic })}
                    >
                      {mechanic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {type === 'discovery' && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Recommended Filters</h4>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.platforms?.slice(0, 4).map((platform: string) => (
                  <Button
                    key={platform}
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestionApply({ type: 'platform', value: platform })}
                    className="justify-start"
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {type === 'marketing' && (
          <div className="space-y-3">
            {suggestions.suggestedCreators?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Top Creator Matches
                </h4>
                {suggestions.suggestedCreators.slice(0, 2).map((creator: any, idx: number) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded text-xs">
                    <div className="font-medium">{creator.name}</div>
                    <div className="text-gray-500">{creator.platform} • {creator.audienceSize}</div>
                    <div className="text-gray-600 mt-1">{creator.reasoning}</div>
                  </div>
                ))}
              </div>
            )}

            {suggestions.marketingStrategies?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Strategy Recommendations</h4>
                {suggestions.marketingStrategies.slice(0, 2).map((strategy: any, idx: number) => (
                  <div key={idx} className="p-2 bg-blue-50 rounded text-xs">
                    <div className="font-medium">{strategy.strategy}</div>
                    <div className="text-gray-600 mt-1">{strategy.description}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">ROI: {strategy.expectedROI}</Badge>
                      <Badge variant="outline" className="text-xs">{strategy.difficulty}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
