
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  genre: string;
  platform: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useProject = (id?: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching project:', error);
          toast({
            title: "Error",
            description: "Failed to load project details",
            variant: "destructive",
          });
          return;
        }

        if (!data) {
          toast({
            title: "Project not found",
            description: "The requested project could not be found",
            variant: "destructive",
          });
          return;
        }

        console.log('🔍 Project data fetched:', data);
        console.log('🔍 Genre value:', data.genre, 'Type:', typeof data.genre, 'Length:', data.genre?.length);
        console.log('🔍 Platform value:', data.platform, 'Type:', typeof data.platform, 'Length:', data.platform?.length);
        console.log('🔍 Status value:', data.status, 'Type:', typeof data.status, 'Length:', data.status?.length);
        
        // Check for special characters or whitespace
        if (data.genre) {
          console.log('🔍 Genre characters:', Array.from(data.genre).map(char => `"${char}" (${char.charCodeAt(0)})`));
          console.log('🔍 Genre trimmed:', `"${data.genre.trim()}"`, 'Trimmed length:', data.genre.trim().length);
        }
        
        if (data.platform) {
          console.log('🔍 Platform characters:', Array.from(data.platform).map(char => `"${char}" (${char.charCodeAt(0)})`));
          console.log('🔍 Platform trimmed:', `"${data.platform.trim()}"`, 'Trimmed length:', data.platform.trim().length);
        }

        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, toast]);

  return { project, isLoading };
};
