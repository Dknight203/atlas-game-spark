
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Analytics = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
            <p className="text-lg text-gray-600">
              Analytics are project-specific. Create or select a project to view detailed performance metrics.
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
                  Set up a new game project to start tracking analytics and performance metrics.
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
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Select Existing Project
                </CardTitle>
                <CardDescription>
                  Go to your dashboard to select an existing project and view its analytics.
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

          <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-2">Analytics Features</h3>
            <div className="text-green-800 space-y-2">
              <p>• Track marketing performance and reach for each project</p>
              <p>• Monitor community engagement and creator collaboration metrics</p>
              <p>• Analyze competitor performance and market trends</p>
              <p>• Get insights on user behavior and retention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
