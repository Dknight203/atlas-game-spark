
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Plus, Target, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";

const Discovery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, isLoading } = useProjects();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleCreateProject = () => {
    navigate("/project/new");
  };

  const handleViewProjects = () => {
    navigate("/dashboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Discovery</h1>
            <p className="text-lg text-gray-600">
              {projects.length > 0 
                ? "Select a project to discover communities and creators, or create a new project to get started."
                : "Discovery is project-specific. Create or select a project to start discovering communities and creators."
              }
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
                <Link to="/project/new">
                  <Button className="bg-atlas-purple hover:bg-atlas-purple/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project.id} to={`/project/${project.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        {project.description && (
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                          {project.genre && (
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>{project.genre}</span>
                            </div>
                          )}
                          {project.platform && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Platform:</span>
                              <span>{project.platform}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">
                              Updated {new Date(project.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-atlas-purple" />
                    Create Your First Project
                  </CardTitle>
                  <CardDescription>
                    Set up a new game project to unlock discovery features for communities and creators.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleCreateProject}
                    className="w-full bg-atlas-purple hover:bg-opacity-90"
                  >
                    Create New Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-atlas-teal" />
                    Select Existing Project
                  </CardTitle>
                  <CardDescription>
                    Go to your dashboard to select an existing project and access its discovery features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleViewProjects}
                    variant="outline"
                    className="w-full"
                  >
                    View My Projects
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">How Discovery Works</h3>
            <div className="text-blue-800 space-y-2">
              <p>• Discovery features are tailored to each specific game project</p>
              <p>• Find communities and creators that match your game's genre, platform, and style</p>
              <p>• Get AI-powered recommendations based on your project's signal profile</p>
              <p>• Track performance and analytics for each project separately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discovery;
