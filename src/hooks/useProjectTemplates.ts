
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectTemplate {
  id: string;
  organization_id: string | null;
  name: string;
  description: string | null;
  template_data: any;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useProjectTemplates = () => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTemplates = async (organizationId?: string) => {
    if (!user) return;

    try {
      let query = supabase.from('project_templates').select('*');
      
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load project templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (
    name: string, 
    description: string, 
    templateData: any, 
    organizationId?: string,
    isPublic: boolean = false
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('project_templates')
        .insert({
          name,
          description,
          template_data: templateData,
          organization_id: organizationId || null,
          is_public: isPublic,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Template Created",
        description: `${name} template has been created successfully`,
      });

      await fetchTemplates(organizationId);
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create project template",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTemplate = async (
    templateId: string,
    updates: Partial<Pick<ProjectTemplate, 'name' | 'description' | 'template_data' | 'is_public'>>
  ) => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Template Updated",
        description: "Template has been updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Template Deleted",
        description: "Template has been deleted successfully",
      });

      setTemplates(prev => prev.filter(t => t.id !== templateId));
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  return {
    templates,
    isLoading,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
