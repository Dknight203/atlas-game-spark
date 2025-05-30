
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
    platform: prefillData.platform || "",
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
        platform: prefillData.platform || prev.platform
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
            platform: formData.platform,
            status: formData.status
          }
        ])
        .select()
        .single();

      if (error) {
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
              disabled={isLoading || !formData.name}
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
