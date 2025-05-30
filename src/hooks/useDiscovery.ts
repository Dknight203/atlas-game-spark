
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { DiscoveryList, EnhancedGameData, DiscoveryFilters } from "@/types/discovery";

// Mock data for enhanced games until database is set up
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
  }
];

export const useDiscovery = (projectId: string) => {
  const [discoveryLists, setDiscoveryLists] = useState<DiscoveryList[]>([]);
  const [enhancedGameData] = useState<EnhancedGameData[]>(mockEnhancedGameData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // For now, we'll use local state for discovery lists
    // Once database tables are set up, this will fetch from Supabase
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

  const applyFilters = (filters: DiscoveryFilters): EnhancedGameData[] => {
    return enhancedGameData.filter(game => {
      // Platform filter
      if (filters.platforms?.length && !filters.platforms.includes(game.platform)) {
        return false;
      }

      // Genre filter
      if (filters.genres?.length) {
        const hasMatchingGenre = filters.genres.some(genre => 
          game.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
        );
        if (!hasMatchingGenre) return false;
      }

      // Tags filter
      if (filters.tags?.length) {
        const hasMatchingTag = filters.tags.some(tag => 
          game.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
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
