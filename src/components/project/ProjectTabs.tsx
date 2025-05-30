
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignalProfileBuilder from "@/components/app/SignalProfileBuilder";
import MatchEngineResults from "@/components/app/MatchEngineResults";
import CommunityFinderResults from "@/components/app/CommunityFinderResults";
import CreatorMatchResults from "@/components/app/CreatorMatchResults";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import DiscoveryDashboard from "@/components/discovery/DiscoveryDashboard";

interface ProjectTabsProps {
  projectId: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMatchesUpdate: (count: number) => void;
  onCommunitiesUpdate: (count: number) => void;
  onCreatorsUpdate: (count: number) => void;
}

const ProjectTabs = ({ 
  projectId, 
  activeTab, 
  onTabChange, 
  onMatchesUpdate, 
  onCommunitiesUpdate, 
  onCreatorsUpdate 
}: ProjectTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid grid-cols-6 w-full">
        <TabsTrigger value="signal-profile">Signal Profile</TabsTrigger>
        <TabsTrigger value="discovery">Discovery</TabsTrigger>
        <TabsTrigger value="matches">Game Matches</TabsTrigger>
        <TabsTrigger value="communities">Communities</TabsTrigger>
        <TabsTrigger value="creators">Creators</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signal-profile">
        <SignalProfileBuilder projectId={projectId} />
      </TabsContent>
      
      <TabsContent value="discovery">
        <DiscoveryDashboard projectId={projectId} />
      </TabsContent>
      
      <TabsContent value="matches">
        <MatchEngineResults projectId={projectId} onMatchesUpdate={onMatchesUpdate} />
      </TabsContent>
      
      <TabsContent value="communities">
        <CommunityFinderResults projectId={projectId} onCommunitiesUpdate={onCommunitiesUpdate} />
      </TabsContent>
      
      <TabsContent value="creators">
        <CreatorMatchResults projectId={projectId} onCreatorsUpdate={onCreatorsUpdate} />
      </TabsContent>
      
      <TabsContent value="analytics">
        <AnalyticsDashboard projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
