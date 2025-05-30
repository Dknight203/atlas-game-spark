
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Users, TrendingUp, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useOnboarding } from "@/hooks/useOnboarding";

const Dashboard = () => {
  const { user } = useAuth();
  const { showOnboarding, completeOnboarding, skipOnboarding, resetOnboarding } = useOnboarding();

  const quickActions = [
    {
      title: "Create New Project",
      description: "Start a new game marketing project",
      icon: <Plus className="w-5 h-5" />,
      href: "/project/new",
      color: "bg-atlas-purple hover:bg-atlas-purple/90"
    },
    {
      title: "Discover Communities",
      description: "Find gaming communities for your project",
      icon: <Users className="w-5 h-5" />,
      href: "/discovery",
      color: "bg-atlas-teal hover:bg-atlas-teal/90"
    },
    {
      title: "View Analytics",
      description: "Track your marketing performance",
      icon: <TrendingUp className="w-5 h-5" />,
      href: "/analytics",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

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

          {/* Getting Started Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-atlas-purple" />
                Getting Started with GameAtlas
              </CardTitle>
              <CardDescription>
                Complete these steps to maximize your marketing success
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
                  <h4 className="font-semibold mb-1">Discover Communities</h4>
                  <p className="text-sm text-gray-600">Find your target audience</p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-semibold mb-1">Launch Campaign</h4>
                  <p className="text-sm text-gray-600">Start reaching your audience</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first project to start discovering communities and creators for your game.
              </p>
              <Link to="/project/new">
                <Button className="bg-atlas-purple hover:bg-opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
