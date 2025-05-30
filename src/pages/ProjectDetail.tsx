
import { useState } from "react";
import { useParams } from "react-router-dom";
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
import { useProject } from "@/hooks/useProject";

const ProjectDetail = () => {
  const { id } = useParams();
  const { project, isLoading } = useProject(id);
  const [activeSection, setActiveSection] = useState("game-intelligence");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stats, setStats] = useState({
    matches: 0,
    communities: 0,
    creators: 0
  });

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
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const renderContent = () => {
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
