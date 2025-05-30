
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProjectFormFields from "./ProjectFormFields";

interface ProjectFormProps {
  prefillData?: {
    name?: string;
    genre?: string;
    platform?: string;
  };
}

const ProjectForm = ({ prefillData = {} }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: prefillData.name || "",
    description: "",
    genre: prefillData.genre || "",
    secondary_genre: "",
    platforms: prefillData.platform ? [prefillData.platform] : [] as string[],
    status: "development"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Update form data when prefillData changes
  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        name: prefillData.name || prev.name,
        genre: prefillData.genre || prev.genre,
        platforms: prefillData.platform ? [prefillData.platform] : prev.platforms
      }));
    }
  }, [prefillData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a project",
        variant: "destructive",
      });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            description: formData.description,
            genre: formData.genre,
            platform: formData.platforms[0], // Keep the first platform for backwards compatibility
            platforms: formData.platforms, // Store all platforms in the new column
            status: formData.status
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Project creation error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Project Created",
          description: `${formData.name} has been created successfully!`,
        });
        navigate(`/project/${data.id}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handlePlatformsChange = (platforms: string[]) => {
    setFormData({
      ...formData,
      platforms
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>
          Tell us about your game to help us find the right matches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProjectFormFields 
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onPlatformsChange={handlePlatformsChange}
          />
          
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-atlas-purple hover:bg-opacity-90"
              disabled={isLoading || !formData.name || formData.platforms.length === 0}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
