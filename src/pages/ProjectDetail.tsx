
import { useState, useEffect } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import GameIntelligence from "@/components/project/GameIntelligence";
import MarketingOpportunities from "@/components/project/MarketingOpportunities";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import ProjectSettingsDialog from "@/components/project/ProjectSettingsDialog";
import LoadingState from "@/components/project/LoadingState";
import ProjectNotFound from "@/components/project/ProjectNotFound";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, ArrowRight } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { project, isLoading } = useProject(id);
  const [activeSection, setActiveSection] = useState("game-intelligence");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    matches: 0,
    communities: 0,
    creators: 0
  });

  // Check URL params for initial tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'analytics') {
      setActiveSection('analytics');
    }
  }, [searchParams]);

  // Show welcome message for newly created projects
  useEffect(() => {
    if (location.state?.justCreated) {
      setShowWelcome(true);
      toast({
        title: "Project Created!",
        description: "Start by building your signal profile to get personalized recommendations.",
      });
    }
  }, [location.state, toast]);

  // Callback functions to update stats from child components
  const updateMatchesCount = (count: number) => {
    setStats(prev => ({ ...prev, matches: count }));
  };

  const updateCommunitiesCount = (count: number) => {
    setStats(prev => ({ ...prev, communities: count }));
  };

  const updateCreatorsCount = (count: number) => {
    setStats(prev => ({ ...prev, creators: count }));
  };

  const handleProjectUpdate = (updatedProject: any) => {
    console.log('Project updated:', updatedProject);
  };

  const handleSectionChange = (section: string) => {
    if (section === "settings") {
      setSettingsOpen(true);
    } else {
      setActiveSection(section);
      setShowWelcome(false); // Hide welcome when user navigates
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const renderContent = () => {
    if (showWelcome) {
      return (
        <div className="space-y-6">
          <Card className="border-atlas-purple/20 bg-gradient-to-r from-atlas-purple/5 to-atlas-teal/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-atlas-purple" />
                Welcome to Your Project!
              </CardTitle>
              <CardDescription>
                Your project "{project.name}" is ready. Follow these steps to maximize your marketing success.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                      1
                    </div>
                    <h4 className="font-semibold mb-2">Build Signal Profile</h4>
                    <p className="text-sm text-gray-600 mb-3">Define your game's themes and mechanics for AI-powered recommendations</p>
                    <Button 
                      size="sm" 
                      onClick={() => setActiveSection("game-intelligence")}
                      className="w-full"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                      2
                    </div>
                    <h4 className="font-semibold mb-2">Discover Communities</h4>
                    <p className="text-sm text-gray-600 mb-3">Find gaming communities that match your target audience</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled
                      className="w-full"
                    >
                      Complete Step 1 First
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                      3
                    </div>
                    <h4 className="font-semibold mb-2">Connect with Creators</h4>
                    <p className="text-sm text-gray-600 mb-3">Find content creators who align with your game</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled
                      className="w-full"
                    >
                      Complete Step 1 First
                    </Button>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowWelcome(false)}
                  >
                    Skip Setup Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    switch (activeSection) {
      case "game-intelligence":
        return <GameIntelligence projectId={id || ""} />;
      case "marketing-opportunities":
        return (
          <MarketingOpportunities 
            projectId={id || ""} 
            onCommunitiesUpdate={updateCommunitiesCount}
            onCreatorsUpdate={updateCreatorsCount}
          />
        );
      case "analytics":
        return <AnalyticsDashboard projectId={id || ""} />;
      default:
        return <GameIntelligence projectId={id || ""} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <ProjectSidebar
              projectName={project.name}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              stats={stats}
            />
            
            <SidebarInset className="flex-1">
              <div className="container mx-auto px-6 py-6">
                <ProjectHeader project={project} onProjectUpdate={handleProjectUpdate} />
                
                <main className="mt-6">
                  {renderContent()}
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>

        <ProjectSettingsDialog
          project={project}
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onProjectUpdate={handleProjectUpdate}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
