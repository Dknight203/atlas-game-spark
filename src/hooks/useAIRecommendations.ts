
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GameProfileSuggestions {
  themes: string[];
  mechanics: string[];
  tone: string[];
  targetAudience: string[];
  uniqueFeatures: string[];
}

interface DiscoveryFilterSuggestions {
  platforms: string[];
  genres: string[];
  tags: string[];
  priceRanges: Array<{ label: string; range: [number, number] }>;
  businessModels: string[];
}

interface MarketingRecommendations {
  suggestedCreators: Array<{
    name: string;
    platform: string;
    audienceSize: string;
    relevanceScore: number;
    reasoning: string;
  }>;
  communityTargets: Array<{
    name: string;
    platform: string;
    memberCount: string;
    engagementLevel: string;
    reasoning: string;
  }>;
  marketingStrategies: Array<{
    strategy: string;
    description: string;
    expectedROI: string;
    difficulty: "Easy" | "Medium" | "Hard";
  }>;
}

export const useAIRecommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getProfileSuggestions = useCallback(async (partialProfile: any): Promise<GameProfileSuggestions> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-profile-suggestions', {
        body: { partialProfile }
      });

      if (error) throw error;
      
      return data.suggestions || {
        themes: [],
        mechanics: [],
        tone: [],
        targetAudience: [],
        uniqueFeatures: []
      };
    } catch (error) {
      console.error('Error getting profile suggestions:', error);
      // Fallback to predefined suggestions
      return getFallbackProfileSuggestions(partialProfile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDiscoveryFilterSuggestions = useCallback(async (currentFilters: any): Promise<DiscoveryFilterSuggestions> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-discovery-suggestions', {
        body: { currentFilters }
      });

      if (error) throw error;
      
      return data.suggestions || getFallbackDiscoverySuggestions();
    } catch (error) {
      console.error('Error getting discovery suggestions:', error);
      return getFallbackDiscoverySuggestions();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMarketingRecommendations = useCallback(async (projectData: any): Promise<MarketingRecommendations> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-marketing-recommendations', {
        body: { projectData }
      });

      if (error) throw error;
      
      return data.recommendations || getFallbackMarketingRecommendations(projectData);
    } catch (error) {
      console.error('Error getting marketing recommendations:', error);
      return getFallbackMarketingRecommendations(projectData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFallbackProfileSuggestions = (partialProfile: any): GameProfileSuggestions => {
    const genre = partialProfile.genre?.toLowerCase() || '';
    
    const suggestions: GameProfileSuggestions = {
      themes: [],
      mechanics: [],
      tone: [],
      targetAudience: [],
      uniqueFeatures: []
    };

    // Genre-based suggestions
    if (genre.includes('rpg')) {
      suggestions.themes.push('Fantasy', 'Character Development', 'Epic Journey');
      suggestions.mechanics.push('Turn-based Combat', 'Skill Trees', 'Inventory Management');
      suggestions.tone.push('Epic', 'Immersive', 'Story-driven');
    } else if (genre.includes('puzzle')) {
      suggestions.themes.push('Problem Solving', 'Logic', 'Brain Training');
      suggestions.mechanics.push('Pattern Recognition', 'Progressive Difficulty', 'Hint System');
      suggestions.tone.push('Relaxing', 'Challenging', 'Satisfying');
    } else if (genre.includes('action')) {
      suggestions.themes.push('Fast-paced', 'Combat', 'Reflexes');
      suggestions.mechanics.push('Real-time Combat', 'Combo System', 'Power-ups');
      suggestions.tone.push('Intense', 'Adrenaline-pumping', 'Competitive');
    }

    return suggestions;
  };

  const getFallbackDiscoverySuggestions = (): DiscoveryFilterSuggestions => ({
    platforms: ['PC', 'Nintendo Switch', 'Mobile', 'PlayStation', 'Xbox'],
    genres: ['Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Simulation'],
    tags: ['Single-player', 'Multiplayer', 'Story Rich', 'Casual', 'Competitive'],
    priceRanges: [
      { label: 'Free', range: [0, 0] },
      { label: 'Budget ($1-$10)', range: [1, 10] },
      { label: 'Mid-range ($10-$30)', range: [10, 30] },
      { label: 'Premium ($30+)', range: [30, 100] }
    ],
    businessModels: ['Free-to-Play', 'Premium', 'Subscription', 'DLC']
  });

  const getFallbackMarketingRecommendations = (projectData: any): MarketingRecommendations => ({
    suggestedCreators: [
      {
        name: 'IndieGameReviewer',
        platform: 'YouTube',
        audienceSize: '50K-100K',
        relevanceScore: 85,
        reasoning: 'Focuses on indie games in your genre'
      }
    ],
    communityTargets: [
      {
        name: 'r/IndieGaming',
        platform: 'Reddit',
        memberCount: '500K+',
        engagementLevel: 'High',
        reasoning: 'Active community for indie game discoveries'
      }
    ],
    marketingStrategies: [
      {
        strategy: 'Community Engagement',
        description: 'Engage with gaming communities and forums',
        expectedROI: 'Medium',
        difficulty: 'Easy'
      }
    ]
  });

  return {
    getProfileSuggestions,
    getDiscoveryFilterSuggestions,
    getMarketingRecommendations,
    isLoading
  };
};
