
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockEnhancedGameData } from "@/data/mockGameData";
import { applyGameFilters } from "@/utils/gameFilters";
import { DiscoveryListService } from "@/services/discoveryListService";
import type { DiscoveryList, EnhancedGameData, DiscoveryFilters } from "@/types/discovery";

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
      const newList = DiscoveryListService.createDiscoveryList(projectId, name, description, filters);
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
            ? DiscoveryListService.updateDiscoveryList(list, updates)
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

  const applyFilters = useCallback((filters: DiscoveryFilters): EnhancedGameData[] => {
    return applyGameFilters(enhancedGameData, filters);
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
