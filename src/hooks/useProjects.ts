
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      console.log('Fetching projects for user:', user.id);

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          toast({
            title: "Error",
            description: "Failed to load projects",
            variant: "destructive",
          });
          return;
        }

        console.log('Projects data fetched successfully:', data);
        
        // Convert the data to match our Project interface with proper type handling
        const projectsData: Project[] = (data || []).map(project => ({
          ...project,
          platforms: Array.isArray(project.platforms) 
            ? (project.platforms as string[]).filter((platform): platform is string => typeof platform === 'string')
            : []
        }));
        
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, toast]);

  return { projects, isLoading };
};
