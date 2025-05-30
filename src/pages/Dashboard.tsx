
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Users, TrendingUp, Target, Calendar, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useProjects } from "@/hooks/useProjects";

const Dashboard = () => {
  const { user } = useAuth();
  const { showOnboarding, completeOnboarding, skipOnboarding, resetOnboarding } = useOnboarding();
  const { projects, isLoading } = useProjects();

  const quickActions = [
    {
      title: "Create New Project",
      description: "Start a new game marketing project",
      icon: <Plus className="w-5 h-5" />,
      href: "/project/new",
      color: "bg-atlas-purple hover:bg-atlas-purple/90"
    },
    {
      title: "Project Discovery",
      description: "Find communities & creators for your projects",
      icon: <Users className="w-5 h-5" />,
      href: "/discovery",
      color: "bg-atlas-teal hover:bg-atlas-teal/90"
    },
    {
      title: "Project Analytics",
      description: "View performance metrics for your projects",
      icon: <TrendingUp className="w-5 h-5" />,
      href: "/analytics",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {showOnboarding && (
        <OnboardingWizard
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600">Ready to grow your game's audience?</p>
            </div>
            <Button
              onClick={resetOnboarding}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Take Tour
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-4">
                    <div className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center mb-3`}>
                      {action.icon}
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* Projects Section */}
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400 animate-pulse" />
                </div>
                <p className="text-gray-600">Loading your projects...</p>
              </CardContent>
            </Card>
          ) : projects.length > 0 ? (
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
                              <span className="font-medium">Genre:</span>
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
            // Empty state - only show when user actually has no projects
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Your Marketing Journey</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first project to unlock discovery features, find communities, connect with creators, and track your marketing success.
                </p>
                <div className="space-y-4">
                  <Link to="/project/new">
                    <Button className="bg-atlas-purple hover:bg-opacity-90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
                  <div className="text-sm text-gray-500">
                    💡 <strong>Tip:</strong> Each project gets its own discovery tools, analytics, and community recommendations.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Getting Started Section - Only show if user has no projects */}
          {!isLoading && projects.length === 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-atlas-purple" />
                  Getting Started with GameAtlas
                </CardTitle>
                <CardDescription>
                  Follow these steps to maximize your marketing success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                      ✓
                    </div>
                    <h4 className="font-semibold mb-1">Account Created</h4>
                    <p className="text-sm text-gray-600">Welcome to GameAtlas!</p>
                  </div>
                  
                  <Link to="/project/new">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                        1
                      </div>
                      <h4 className="font-semibold mb-1">Create Project</h4>
                      <p className="text-sm text-gray-600">Set up your first game project</p>
                    </div>
                  </Link>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                      2
                    </div>
                    <h4 className="font-semibold mb-1">Build Profile</h4>
                    <p className="text-sm text-gray-600">Set up your project's signal profile</p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                      3
                    </div>
                    <h4 className="font-semibold mb-1">Discover & Connect</h4>
                    <p className="text-sm text-gray-600">Find communities and creators</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
