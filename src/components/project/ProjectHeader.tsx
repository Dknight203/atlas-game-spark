
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings } from "lucide-react";

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
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
          <p className="text-gray-600 max-w-2xl">{project.description}</p>
          <div className="flex gap-4 mt-4">
            {project.genre && project.genre.trim() && (
              <Badge variant="secondary" className="bg-atlas-purple bg-opacity-10 text-atlas-purple border-atlas-purple/20">
                {project.genre}
              </Badge>
            )}
            {project.platform && project.platform.trim() && (
              <Badge variant="secondary" className="bg-atlas-teal bg-opacity-10 text-atlas-teal border-atlas-teal/20">
                {project.platform}
              </Badge>
            )}
            {project.status && project.status.trim() && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                {project.status}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </>
  );
};

export default ProjectHeader;
