
import type { EnhancedGameData, DiscoveryFilters } from "@/types/discovery";

// Improved filtering logic with fuzzy matching
export const applyGameFilters = (
  games: EnhancedGameData[], 
  filters: DiscoveryFilters
): EnhancedGameData[] => {
  console.log('Applying filters:', filters);
  
  return games.filter(game => {
    // Platform filter - fuzzy matching
    if (filters.platforms?.length) {
      const hasMatchingPlatform = filters.platforms.some(filterPlatform => {
        const gamePlatform = game.platform.toLowerCase();
        const filterPlatformLower = filterPlatform.toLowerCase();
        
        // Direct match
        if (gamePlatform.includes(filterPlatformLower)) return true;
        
        // Handle platform aliases
        if (filterPlatformLower === 'mobile' && (gamePlatform.includes('ios') || gamePlatform.includes('android'))) return true;
        if (filterPlatformLower === 'console' && (gamePlatform.includes('xbox') || gamePlatform.includes('playstation') || gamePlatform.includes('switch'))) return true;
        if (filterPlatformLower === 'pc' && gamePlatform.includes('steam')) return true;
        
        return false;
      });
      if (!hasMatchingPlatform) return false;
    }

    // Genre filter - fuzzy matching
    if (filters.genres?.length) {
      const hasMatchingGenre = filters.genres.some(filterGenre => 
        game.genre.some(gameGenre => 
          gameGenre.toLowerCase().includes(filterGenre.toLowerCase()) ||
          filterGenre.toLowerCase().includes(gameGenre.toLowerCase())
        )
      );
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
