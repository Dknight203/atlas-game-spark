
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectStats from "@/components/project/ProjectStats";
import ProjectTabs from "@/components/project/ProjectTabs";
import LoadingState from "@/components/project/LoadingState";
import ProjectNotFound from "@/components/project/ProjectNotFound";
import { useProject } from "@/hooks/useProject";

const ProjectDetail = () => {
  const { id } = useParams();
  const { project, isLoading } = useProject(id);
  const [activeTab, setActiveTab] = useState("signal-profile");
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

  const handleStatClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  // Debug logging for rendering
  console.log('🎨 Rendering tags...');
  console.log('🎨 Genre check:', project.genre && project.genre.trim(), 'Will render genre:', !!(project.genre && project.genre.trim()));
  console.log('🎨 Platform check:', project.platform && project.platform.trim(), 'Will render platform:', !!(project.platform && project.platform.trim()));
  console.log('🎨 Status check:', project.status && project.status.trim(), 'Will render status:', !!(project.status && project.status.trim()));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectHeader project={project} />
          <ProjectStats stats={stats} onStatClick={handleStatClick} />
          <ProjectTabs 
            projectId={id || ""} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onMatchesUpdate={updateMatchesCount}
            onCommunitiesUpdate={updateCommunitiesCount}
            onCreatorsUpdate={updateCreatorsCount}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
