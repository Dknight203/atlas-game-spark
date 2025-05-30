
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Creator, CreatorSearchResponse, CreatorSearchParams } from "@/types/creator";

interface UseCreatorSearchResult {
  creators: Creator[];
  isLoading: boolean;
  error: string | null;
  needsApiKey: boolean;
}

export const useCreatorSearch = (projectId: string): UseCreatorSearchResult => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreators = async () => {
      if (!projectId) return;
      
      try {
        console.log('Fetching creators for project:', projectId);
        setIsLoading(true);
        setError(null);
        
        // Fetch project details
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .maybeSingle();

        if (!projectData) {
          setError('Project not found');
          return;
        }
        
        const genre = projectData.genre?.toLowerCase() || '';
        const platform = projectData.platform?.toLowerCase() || '';
        
        // Build search queries based on project data
        const searchQueries = [
          `${genre} game review`,
          `indie ${genre} games`,
          `${platform} gaming review`,
          'indie game review',
          'small indie games',
          `${genre} gameplay`
        ];

        const searchParams: CreatorSearchParams = {
          searchQueries,
          genre,
          platform
        };

        console.log('Calling creator search with params:', searchParams);
        
        const { data, error } = await supabase.functions.invoke('search-youtube-creators', {
          body: searchParams
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }

        const response = data as CreatorSearchResponse;

        if (response?.error) {
          if (response.error.includes('API key not configured')) {
            setNeedsApiKey(true);
            setError('Some platforms require API keys. You can still see creators from other platforms.');
            const validCreators = Array.isArray(response.creators) ? response.creators : [];
            setCreators(validCreators);
            return;
          }
          throw new Error(response.error);
        }

        const validCreators = Array.isArray(response?.creators) ? response.creators : [];
        console.log('Received creators:', validCreators.length);
        setCreators(validCreators);
        
      } catch (error) {
        console.error('Error fetching creators:', error);
        setError('Failed to load creators. Please try again.');
        setCreators([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [projectId, toast]);

  return {
    creators,
    isLoading,
    error,
    needsApiKey
  };
};
