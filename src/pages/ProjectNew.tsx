
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProjectCreationChoice from "@/components/project/ProjectCreationChoice";
import { Badge } from "@/components/ui/badge";

const ProjectNew = () => {
  const location = useLocation();
  const prefillData = location.state?.prefillData || {};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
                {prefillData && Object.keys(prefillData).length > 0 && (
                  <Badge variant="secondary" className="bg-atlas-purple/10 text-atlas-purple">
                    From Onboarding
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">Set up your game project to start finding your audience.</p>
            </div>

            <ProjectCreationChoice prefillData={prefillData} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectNew;
