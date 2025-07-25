
import type { EnhancedGameData, DiscoveryFilters } from "@/types/discovery";

// Platform synonyms and aliases for fuzzy matching
const platformAliases: Record<string, string[]> = {
  'pc': ['steam', 'windows', 'mac', 'linux', 'epic games'],
  'mobile': ['ios', 'android', 'iphone', 'ipad'],
  'console': ['xbox', 'playstation', 'nintendo switch', 'ps4', 'ps5', 'xbox one', 'xbox series'],
  'steam': ['pc', 'windows'],
  'nintendo switch': ['switch', 'nintendo'],
  'xbox': ['microsoft', 'xbox one', 'xbox series'],
  'playstation': ['ps4', 'ps5', 'sony'],
};

// Genre synonyms for better matching
const genreAliases: Record<string, string[]> = {
  'action': ['shooter', 'fps', 'fighting', 'beat em up'],
  'rpg': ['role playing', 'jrpg', 'crpg', 'mmorpg'],
  'strategy': ['rts', 'turn based', 'tactical', 'tower defense'],
  'puzzle': ['match 3', 'brain training', 'logic'],
  'simulation': ['life sim', 'city builder', 'farming'],
  'racing': ['driving', 'car', 'motorsport'],
};

// Enhanced filtering logic with fuzzy matching and synonyms
export const applyGameFilters = (
  games: EnhancedGameData[], 
  filters: DiscoveryFilters
): EnhancedGameData[] => {
  return games.filter(game => {
    // Platform filter - fuzzy matching with synonyms
    if (filters.platforms?.length) {
      const hasMatchingPlatform = filters.platforms.some(filterPlatform => {
        const gamePlatform = game.platform.toLowerCase();
        const filterPlatformLower = filterPlatform.toLowerCase();
        
        // Direct match
        if (gamePlatform.includes(filterPlatformLower) || filterPlatformLower.includes(gamePlatform)) return true;
        
        // Check platform aliases
        const aliases = platformAliases[filterPlatformLower] || [];
        return aliases.some(alias => 
          gamePlatform.includes(alias) || 
          alias.includes(gamePlatform)
        );
      });
      if (!hasMatchingPlatform) return false;
    }

    // Genre filter - fuzzy matching with synonyms
    if (filters.genres?.length) {
      const hasMatchingGenre = filters.genres.some(filterGenre => {
        const filterGenreLower = filterGenre.toLowerCase();
        
        return game.genre.some(gameGenre => {
          const gameGenreLower = gameGenre.toLowerCase();
          
          // Direct match
          if (gameGenreLower.includes(filterGenreLower) || filterGenreLower.includes(gameGenreLower)) return true;
          
          // Check genre aliases
          const aliases = genreAliases[filterGenreLower] || [];
          return aliases.some(alias => 
            gameGenreLower.includes(alias) || 
            alias.includes(gameGenreLower)
          );
        });
      });
      if (!hasMatchingGenre) return false;
    }

    // Tags filter - fuzzy matching
    if (filters.tags?.length) {
      const hasMatchingTag = filters.tags.some(filterTag => 
        game.tags.some(gameTag => 
          gameTag.toLowerCase().includes(filterTag.toLowerCase()) ||
          filterTag.toLowerCase().includes(gameTag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    // Price range filter
    if (filters.priceRange && game.price !== null && game.price !== undefined) {
      const [min, max] = filters.priceRange;
      if (game.price < min || game.price > max) return false;
    }

    // Rating range filter
    if (filters.ratingRange && game.rating_average !== null && game.rating_average !== undefined) {
      const [min, max] = filters.ratingRange;
      if (game.rating_average < min || game.rating_average > max) return false;
    }

    // Release year filter
    if (filters.releaseYearRange && game.release_date) {
      const releaseYear = new Date(game.release_date).getFullYear();
      const [min, max] = filters.releaseYearRange;
      if (releaseYear < min || releaseYear > max) return false;
    }

    // Download range filter
    if (filters.downloadRange && game.download_count !== null && game.download_count !== undefined) {
      const [min, max] = filters.downloadRange;
      if (game.download_count < min || game.download_count > max) return false;
    }

    // Revenue range filter
    if (filters.revenueRange && game.revenue_estimate !== null && game.revenue_estimate !== undefined) {
      const [min, max] = filters.revenueRange;
      if (game.revenue_estimate < min || game.revenue_estimate > max) return false;
    }

    return true;
  });
};
