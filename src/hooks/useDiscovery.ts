
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DiscoveryList, EnhancedGameData, DiscoveryFilters } from "@/types/discovery";

export const useDiscovery = (projectId: string) => {
  const [discoveryLists, setDiscoveryLists] = useState<DiscoveryList[]>([]);
  const [enhancedGameData, setEnhancedGameData] = useState<EnhancedGameData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);

        // Fetch discovery lists
        const { data: lists, error: listsError } = await supabase
          .from('discovery_lists')
          .select('*')
          .eq('project_id', projectId)
          .order('updated_at', { ascending: false });

        if (listsError) throw listsError;

        // Fetch enhanced game data
        const { data: gameData, error: gameDataError } = await supabase
          .from('enhanced_game_data')
          .select('*')
          .order('last_updated', { ascending: false })
          .limit(100);

        if (gameDataError) throw gameDataError;

        setDiscoveryLists((lists || []).map(item => ({
          ...item,
          filters: item.filters as Record<string, any>,
          metadata: item.metadata as Record<string, any>
        })) as DiscoveryList[]);

        setEnhancedGameData((gameData || []).map(item => ({
          ...item,
          metadata: item.metadata as Record<string, any>
        })) as EnhancedGameData[]);

      } catch (error) {
        console.error('Error fetching discovery data:', error);
        toast({
          title: "Error",
          description: "Failed to load discovery data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveryData();
  }, [projectId, toast]);

  const createDiscoveryList = async (name: string, description: string, filters: DiscoveryFilters) => {
    try {
      const { data, error } = await supabase
        .from('discovery_lists')
        .insert([{
          project_id: projectId,
          name,
          description,
          filters
        }])
        .select()
        .single();

      if (error) throw error;

      const newList = {
        ...data,
        filters: data.filters as Record<string, any>
      } as DiscoveryList;

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
      const { data, error } = await supabase
        .from('discovery_lists')
        .update(updates)
        .eq('id', listId)
        .select()
        .single();

      if (error) throw error;

      const updatedList = {
        ...data,
        filters: data.filters as Record<string, any>
      } as DiscoveryList;

      setDiscoveryLists(prev => 
        prev.map(list => list.id === listId ? updatedList : list)
      );

      toast({
        title: "Success",
        description: "Discovery list updated successfully",
      });

      return updatedList;
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
      const { error } = await supabase
        .from('discovery_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;

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
