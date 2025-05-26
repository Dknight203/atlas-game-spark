
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Play, Users, Target, TrendingUp } from "lucide-react";
import SignalProfileBuilder from "@/components/app/SignalProfileBuilder";
import MatchEngineResults from "@/components/app/MatchEngineResults";
import CommunityFinderResults from "@/components/app/CommunityFinderResults";
import CreatorMatchResults from "@/components/app/CreatorMatchResults";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  genre: string;
  platform: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("signal-profile");
  const [stats, setStats] = useState({
    matches: 0,
    communities: 0,
    creators: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching project:', error);
          toast({
            title: "Error",
            description: "Failed to load project details",
            variant: "destructive",
          });
          return;
        }

        if (!data) {
          toast({
            title: "Project not found",
            description: "The requested project could not be found",
            variant: "destructive",
          });
          return;
        }

        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, toast]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
              <p className="ml-4 text-gray-600">Loading project...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
              <p className="text-gray-600">The requested project could not be found.</p>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 max-w-2xl">{project.description}</p>
              <div className="flex gap-4 mt-4">
                {project.genre && (
                  <span className="text-sm bg-atlas-purple bg-opacity-10 text-atlas-purple px-3 py-1 rounded-full">
                    {project.genre}
                  </span>
                )}
                {project.platform && (
                  <span className="text-sm bg-atlas-teal bg-opacity-10 text-atlas-teal px-3 py-1 rounded-full">
                    {project.platform}
                  </span>
                )}
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {project.status}
                </span>
              </div>
            </div>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("matches")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Game Matches</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-atlas-purple">{stats.matches}</div>
                <p className="text-xs text-muted-foreground">Similar games found</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("communities")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Communities</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-atlas-teal">{stats.communities}</div>
                <p className="text-xs text-muted-foreground">Active communities</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("creators")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Creators</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-atlas-orange">{stats.creators}</div>
                <p className="text-xs text-muted-foreground">Potential creators</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="signal-profile">Signal Profile</TabsTrigger>
              <TabsTrigger value="matches">Game Matches</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="creators">Creators</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signal-profile">
              <SignalProfileBuilder projectId={id || ""} />
            </TabsContent>
            
            <TabsContent value="matches">
              <MatchEngineResults projectId={id || ""} onMatchesUpdate={updateMatchesCount} />
            </TabsContent>
            
            <TabsContent value="communities">
              <CommunityFinderResults projectId={id || ""} onCommunitiesUpdate={updateCommunitiesCount} />
            </TabsContent>
            
            <TabsContent value="creators">
              <CreatorMatchResults projectId={id || ""} onCreatorsUpdate={updateCreatorsCount} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
