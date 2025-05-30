
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  genre: string;
  platform: string;
  platforms: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export const useProject = (providedId?: string) => {
  const { id: urlId } = useParams();
  const projectId = providedId || urlId;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      console.log('Fetching project with ID:', projectId);

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
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

        console.log('Project data fetched successfully:', data);
        
        // Convert the data to match our Project interface
        const projectData: Project = {
          ...data,
          platforms: Array.isArray(data.platforms) ? data.platforms : []
        };
        
        setProject(projectData);
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
  }, [projectId, toast]);

  return { project, isLoading };
};
