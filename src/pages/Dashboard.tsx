
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Target, Users, TrendingUp, ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Project {
  id: string;
  name: string;
  status: string | null;
  description: string | null;
  genre: string | null;
  platform: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          toast({
            title: "Error",
            description: "Failed to load projects",
            variant: "destructive",
          });
        } else {
          setProjects(data || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, toast]);

  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string | null) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';
  };

  const getNextSteps = () => {
    if (projects.length === 0) {
      return [
        { title: "Create your first project", description: "Start by setting up your game project", action: "Create Project", link: "/project/new" },
        { title: "Explore the demo", description: "See how GameAtlas works", action: "View Demo", link: "/demo" }
      ];
    }
    
    return [
      { title: "Build signal profile", description: "Define your game's characteristics", action: "Get Started", link: `/project/${projects[0].id}` },
      { title: "Discover similar games", description: "Find games in your market", action: "Explore", link: `/project/${projects[0].id}` }
    ];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
              <p className="text-gray-600">Let's find your game's audience and grow your community.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Get started with these recommended next steps</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getNextSteps().map((step, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-medium">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <Link to={step.link}>
                          <Button size="sm">
                            {step.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Projects</span>
                    <span className="font-bold text-atlas-purple">{projects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="font-bold text-green-600">
                      {projects.filter(p => p.status?.toLowerCase() === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">In Development</span>
                    <span className="font-bold text-blue-600">
                      {projects.filter(p => p.status?.toLowerCase() === 'development').length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
              <Link to="/project/new">
                <Button className="bg-atlas-purple hover:bg-opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
                <p className="ml-4 text-gray-600">Loading your projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-sm">Create your first game project to get started with GameAtlas.</p>
                  </div>
                  <Link to="/project/new">
                    <Button className="bg-atlas-purple hover:bg-opacity-90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-atlas-purple transition-colors">
                            {project.name}
                          </CardTitle>
                          <CardDescription>
                            Updated {formatLastUpdated(project.updated_at)}
                          </CardDescription>
                          {project.description && (
                            <CardDescription className="mt-2 text-gray-600">
                              {project.description.length > 80 
                                ? `${project.description.substring(0, 80)}...` 
                                : project.description}
                            </CardDescription>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                          {formatStatus(project.status)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.genre && (
                          <span className="px-2 py-1 bg-atlas-purple/10 text-atlas-purple text-xs rounded-full">
                            {project.genre}
                          </span>
                        )}
                        {project.platform && (
                          <span className="px-2 py-1 bg-atlas-teal/10 text-atlas-teal text-xs rounded-full">
                            {project.platform}
                          </span>
                        )}
                      </div>
                      <Link to={`/project/${project.id}`}>
                        <Button variant="outline" className="w-full group-hover:bg-atlas-purple group-hover:text-white transition-colors">
                          Open Project
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
