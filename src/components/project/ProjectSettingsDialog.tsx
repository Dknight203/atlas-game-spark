
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PlatformSelectors from "./PlatformSelectors";

interface Project {
  id: string;
  name: string;
  description: string;
  genre: string;
  platform: string;
  platforms?: string[];
  status: string;
}

interface ProjectSettingsDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdate: (updatedProject: Project) => void;
}

const ProjectSettingsDialog = ({ project, open, onOpenChange, onProjectUpdate }: ProjectSettingsDialogProps) => {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    genre: project.genre,
    platforms: project.platforms || (project.platform ? [project.platform] : []),
    status: project.status
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const statuses = ["Planning", "Development", "Testing", "Released", "On Hold"];

  const handleSave = async () => {
    if (formData.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          description: formData.description,
          genre: formData.genre,
          platform: formData.platforms[0], // Keep the first platform for backwards compatibility
          platforms: formData.platforms, // Store all platforms in the new column
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) {
        throw error;
      }

      // Update the parent component with new data
      onProjectUpdate({
        ...project,
        name: formData.name,
        description: formData.description,
        genre: formData.genre,
        platform: formData.platforms[0],
        platforms: formData.platforms,
        status: formData.status
      });

      toast({
        title: "Settings Saved",
        description: "Project settings have been updated successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlatformsChange = (platforms: string[]) => {
    setFormData({ ...formData, platforms });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Update your project information and settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project"
              rows={3}
            />
          </div>

          <div>
            <Label>Genre</Label>
            <Input
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              placeholder="Enter game genre"
            />
          </div>

          <PlatformSelectors
            selectedPlatforms={formData.platforms}
            onPlatformChange={handlePlatformsChange}
          />

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {statuses.map((status) => (
                  <SelectItem key={status} value={status.toLowerCase()}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !formData.name || formData.platforms.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSettingsDialog;
