
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Discovery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Discovery</h1>
            <p className="text-lg text-gray-600">
              Discovery is project-specific. Create or select a project to start discovering communities and creators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
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
