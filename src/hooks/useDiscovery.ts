
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { DiscoveryList, EnhancedGameData, DiscoveryFilters } from "@/types/discovery";

// Enhanced mock data with much more diversity and realistic games
const mockEnhancedGameData: EnhancedGameData[] = [
  {
    id: "1",
    game_id: "steam_1234",
    name: "Indie Adventure Quest",
    platform: "Steam",
    genre: ["Adventure", "Indie"],
    tags: ["Adventure", "Story Rich", "Single-player"],
    release_date: "2023-06-15",
    developer: "Small Studio Games",
    publisher: "Indie Publisher",
    price: 19.99,
    rating_average: 4.3,
    review_count: 2450,
    download_count: 15000,
    revenue_estimate: 75000.00,
    player_retention_d1: 0.68,
    player_retention_d7: 0.35,
    player_retention_d30: 0.18,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    game_id: "ios_5678",
    name: "Mobile Puzzle Master",
    platform: "iOS",
    genre: ["Puzzle", "Casual"],
    tags: ["Puzzle", "Family Friendly", "Touch Controls"],
    release_date: "2023-08-20",
    developer: "Touch Games Inc",
    publisher: "Mobile First",
    price: 4.99,
    rating_average: 4.1,
    review_count: 8900,
    download_count: 125000,
    revenue_estimate: 180000.00,
    player_retention_d1: 0.72,
    player_retention_d7: 0.42,
    player_retention_d30: 0.25,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    game_id: "switch_9012",
    name: "Cozy Farm Life",
    platform: "Nintendo Switch",
    genre: ["Simulation", "Life"],
    tags: ["Farming", "Relaxing", "Multiplayer"],
    release_date: "2023-04-10",
    developer: "Cozy Studios",
    publisher: "Nintendo",
    price: 29.99,
    rating_average: 4.5,
    review_count: 5200,
    download_count: 45000,
    revenue_estimate: 320000.00,
    player_retention_d1: 0.75,
    player_retention_d7: 0.48,
    player_retention_d30: 0.32,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    game_id: "steam_2468",
    name: "Tactical Shooter Arena",
    platform: "Steam",
    genre: ["FPS", "Action", "Shooter"],
    tags: ["Multiplayer", "Competitive", "Team-based"],
    release_date: "2022-11-12",
    developer: "Shooter Studios",
    publisher: "Action Games Inc",
    price: 29.99,
    rating_average: 4.2,
    review_count: 12300,
    download_count: 89000,
    revenue_estimate: 890000.00,
    player_retention_d1: 0.82,
    player_retention_d7: 0.65,
    player_retention_d30: 0.41,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    game_id: "xbox_3691",
    name: "Space Combat Elite",
    platform: "Xbox",
    genre: ["Action", "Shooter", "Sci-Fi"],
    tags: ["Space Combat", "Single-player", "Story Rich"],
    release_date: "2023-02-14",
    developer: "Galaxy Games",
    publisher: "Microsoft Studios",
    price: 59.99,
    rating_average: 4.6,
    review_count: 8700,
    download_count: 67000,
    revenue_estimate: 1200000.00,
    player_retention_d1: 0.78,
    player_retention_d7: 0.58,
    player_retention_d30: 0.35,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    game_id: "android_1472",
    name: "Battle Royale Mobile",
    platform: "Android",
    genre: ["Action", "Shooter", "Battle Royale"],
    tags: ["Battle Royale", "Multiplayer", "Free-to-Play"],
    release_date: "2022-09-05",
    developer: "Mobile Action Ltd",
    publisher: "Free Games Corp",
    price: 0,
    rating_average: 3.9,
    review_count: 45000,
    download_count: 2500000,
    revenue_estimate: 5000000.00,
    player_retention_d1: 0.65,
    player_retention_d7: 0.32,
    player_retention_d30: 0.15,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    game_id: "ps_5829",
    name: "Cyberpunk Runner",
    platform: "PlayStation",
    genre: ["Action", "RPG", "Cyberpunk"],
    tags: ["Cyberpunk", "Open World", "Character Customization"],
    release_date: "2023-01-22",
    developer: "Future Games",
    publisher: "Sony Interactive",
    price: 49.99,
    rating_average: 4.4,
    review_count: 9800,
    download_count: 78000,
    revenue_estimate: 980000.00,
    player_retention_d1: 0.73,
    player_retention_d7: 0.52,
    player_retention_d30: 0.28,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    game_id: "steam_7531",
    name: "Roguelike Dungeon Crawler",
    platform: "Steam",
    genre: ["Roguelike", "Action", "Indie"],
    tags: ["Roguelike", "Dungeon Crawler", "Pixel Art"],
    release_date: "2023-07-08",
    developer: "Pixel Dungeon Studio",
    publisher: "Indie Games Publishing",
    price: 14.99,
    rating_average: 4.7,
    review_count: 3400,
    download_count: 28000,
    revenue_estimate: 125000.00,
    player_retention_d1: 0.71,
    player_retention_d7: 0.44,
    player_retention_d30: 0.22,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    game_id: "switch_8642",
    name: "Racing Championship",
    platform: "Nintendo Switch",
    genre: ["Racing", "Sports"],
    tags: ["Racing", "Arcade", "Split-screen"],
    release_date: "2022-12-03",
    developer: "Speed Games",
    publisher: "Nintendo",
    price: 39.99,
    rating_average: 4.0,
    review_count: 6700,
    download_count: 52000,
    revenue_estimate: 450000.00,
    player_retention_d1: 0.69,
    player_retention_d7: 0.38,
    player_retention_d30: 0.19,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    game_id: "epic_9753",
    name: "Survival Island",
    platform: "Epic Games",
    genre: ["Survival", "Adventure", "Crafting"],
    tags: ["Survival", "Crafting", "Open World"],
    release_date: "2023-05-18",
    developer: "Survival Studios",
    publisher: "Epic Games",
    price: 24.99,
    rating_average: 4.3,
    review_count: 4200,
    download_count: 35000,
    revenue_estimate: 210000.00,
    player_retention_d1: 0.76,
    player_retention_d7: 0.49,
    player_retention_d30: 0.26,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    game_id: "mobile_1864",
    name: "Strategy Empire",
    platform: "Mobile",
    genre: ["Strategy", "Management"],
    tags: ["Strategy", "City Building", "Resource Management"],
    release_date: "2023-03-12",
    developer: "Strategy Mobile Inc",
    publisher: "Mobile Strategy",
    price: 2.99,
    rating_average: 4.2,
    review_count: 15600,
    download_count: 180000,
    revenue_estimate: 420000.00,
    player_retention_d1: 0.68,
    player_retention_d7: 0.41,
    player_retention_d30: 0.23,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: "12",
    game_id: "steam_2975",
    name: "Zombie Survival FPS",
    platform: "Steam",
    genre: ["FPS", "Survival", "Horror"],
    tags: ["Zombies", "Survival Horror", "Co-op"],
    release_date: "2022-10-31",
    developer: "Horror Games Studio",
    publisher: "Scary Games Ltd",
    price: 19.99,
    rating_average: 4.1,
    review_count: 7800,
    download_count: 65000,
    revenue_estimate: 340000.00,
    player_retention_d1: 0.74,
    player_retention_d7: 0.46,
    player_retention_d30: 0.24,
    metadata: {},
    created_at: new Date().toISOString(),
  }
];

export const useDiscovery = (projectId: string) => {
  const [discoveryLists, setDiscoveryLists] = useState<DiscoveryList[]>([]);
  const [enhancedGameData] = useState<EnhancedGameData[]>(mockEnhancedGameData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(false);
  }, [projectId]);

  const createDiscoveryList = async (name: string, description: string, filters: DiscoveryFilters) => {
    try {
      const newList: DiscoveryList = {
        id: Math.random().toString(36).substring(7),
        project_id: projectId,
        name,
        description: description || "",
        filters,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setDiscoveryLists(prev => [newList, ...prev]);
      
      toast({
        title: "Success",
        description: "Discovery list created successfully",
      });

      return newList;
    } catch (error) {
      console.error('Error creating discovery list:', error);
      toast({
        title: "Error",
        description: "Failed to create discovery list",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDiscoveryList = async (listId: string, updates: Partial<DiscoveryList>) => {
    try {
      setDiscoveryLists(prev => 
        prev.map(list => 
          list.id === listId 
            ? { ...list, ...updates, updated_at: new Date().toISOString() }
            : list
        )
      );

      toast({
        title: "Success",
        description: "Discovery list updated successfully",
      });
    } catch (error) {
      console.error('Error updating discovery list:', error);
      toast({
        title: "Error",
        description: "Failed to update discovery list",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDiscoveryList = async (listId: string) => {
    try {
      setDiscoveryLists(prev => prev.filter(list => list.id !== listId));
      
      toast({
        title: "Success",
        description: "Discovery list deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting discovery list:', error);
      toast({
        title: "Error",
        description: "Failed to delete discovery list",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Improved filtering logic with fuzzy matching
  const applyFilters = useCallback((filters: DiscoveryFilters): EnhancedGameData[] => {
    console.log('Applying filters:', filters);
    
    return enhancedGameData.filter(game => {
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
  }, [enhancedGameData]);

  return {
    discoveryLists,
    enhancedGameData,
    isLoading,
    createDiscoveryList,
    updateDiscoveryList,
    deleteDiscoveryList,
    applyFilters
  };
};
