
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings } from "lucide-react";
import ProjectSettingsDialog from "./ProjectSettingsDialog";

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

interface ProjectHeaderProps {
  project: Project;
  onProjectUpdate?: (updatedProject: Project) => void;
}

const ProjectHeader = ({ project, onProjectUpdate }: ProjectHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);

  const handleProjectUpdate = (updatedProject: Project) => {
    setCurrentProject(updatedProject);
    onProjectUpdate?.(updatedProject);
  };

  return (
    <>
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Project Info */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentProject.name}</h1>
          <p className="text-gray-600 max-w-2xl">{currentProject.description}</p>
          <div className="flex gap-4 mt-4">
            {currentProject.genre && currentProject.genre.trim() && (
              <Badge variant="secondary" className="bg-atlas-purple bg-opacity-10 text-atlas-purple border-atlas-purple/20">
                {currentProject.genre}
              </Badge>
            )}
            {currentProject.platform && currentProject.platform.trim() && (
              <Badge variant="secondary" className="bg-atlas-teal bg-opacity-10 text-atlas-teal border-atlas-teal/20">
                {currentProject.platform}
              </Badge>
            )}
            {currentProject.status && currentProject.status.trim() && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                {currentProject.status}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={() => setSettingsOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <ProjectSettingsDialog
        project={currentProject}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onProjectUpdate={handleProjectUpdate}
      />
    </>
  );
};

export default ProjectHeader;
