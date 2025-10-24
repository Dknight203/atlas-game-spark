import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkLimit } from '@/modules/limits/withLimit';
import { incrementUsage } from '@/modules/limits/counters';
import { useToast } from '@/hooks/use-toast';

interface GameMatch {
  id: string;
  title: string;
  score: number;
  genres: string[];
  platforms: string[];
  tags: string[];
}

export function useMatchEngine(orgId: string, gameId: string) {
  const [matches, setMatches] = useState<GameMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const findMatches = async () => {
    setIsLoading(true);
    try {
      // Check limit
      const limitCheck = await checkLimit(orgId, 'cross_matches');
      if (!limitCheck.allowed) {
        toast({
          title: 'Limit reached',
          description: limitCheck.message,
          variant: 'destructive'
        });
        return;
      }

      if (limitCheck.softCapWarning) {
        toast({
          title: 'Approaching limit',
          description: limitCheck.message
        });
      }

      // Fetch game data
      const { data: gameData } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (!gameData) {
        toast({
          title: 'Error',
          description: 'Game not found',
          variant: 'destructive'
        });
        return;
      }

      // Simple local matching using genres and tags
      const { data: allGames } = await supabase
        .from('games')
        .select('*')
        .neq('id', gameId)
        .limit(100);

      if (!allGames) return;

      const scored = allGames.map(game => {
        let score = 0;
        const gameGenres = gameData.genres as string[] || [];
        const gameTags = gameData.tags as string[] || [];
        const matchGenres = game.genres as string[] || [];
        const matchTags = game.tags as string[] || [];

        // Genre overlap
        const genreOverlap = gameGenres.filter(g => matchGenres.includes(g)).length;
        score += genreOverlap * 3;

        // Tag overlap
        const tagOverlap = gameTags.filter(t => matchTags.includes(t)).length;
        score += tagOverlap * 2;

        // Platform overlap
        const gamePlatforms = gameData.platforms as string[] || [];
        const matchPlatforms = game.platforms as string[] || [];
        const platformOverlap = gamePlatforms.filter(p => matchPlatforms.includes(p)).length;
        score += platformOverlap;

        return {
          id: game.id,
          title: game.title,
          score,
          genres: matchGenres,
          platforms: matchPlatforms,
          tags: matchTags
        };
      });

      const topMatches = scored
        .filter(m => m.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setMatches(topMatches);

      // Save to database
      const matchRecords = topMatches.map(m => ({
        game_id: gameId,
        matched_game: {
          id: m.id,
          title: m.title,
          genres: m.genres,
          platforms: m.platforms,
          tags: m.tags
        },
        score: m.score
      }));

      await supabase.from('matches').insert(matchRecords);

      // Increment usage
      await incrementUsage(orgId, 'cross_matches');

      toast({
        title: 'Success',
        description: `Found ${topMatches.length} matching games`
      });
    } catch (error) {
      console.error('Match engine error:', error);
      toast({
        title: 'Error',
        description: 'Failed to find matches',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    matches,
    isLoading,
    findMatches
  };
}
