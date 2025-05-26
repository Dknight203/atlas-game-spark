
import { useState } from "react";
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

const ProjectDetail = () => {
  const { id } = useParams();
  const [project] = useState({
    id: 1,
    name: "Space Explorer RPG",
    description: "A retro-style space exploration RPG with crafting and trading mechanics",
    genre: "RPG",
    platform: "PC",
    status: "Active",
    matches: 24,
    communities: 8,
    creators: 12,
    lastUpdated: "2 days ago"
  });

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
                <span className="text-sm bg-atlas-purple bg-opacity-10 text-atlas-purple px-3 py-1 rounded-full">
                  {project.genre}
                </span>
                <span className="text-sm bg-atlas-teal bg-opacity-10 text-atlas-teal px-3 py-1 rounded-full">
                  {project.platform}
                </span>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Game Matches</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-atlas-purple">{project.matches}</div>
                <p className="text-xs text-muted-foreground">Similar games found</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Communities</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-atlas-teal">{project.communities}</div>
                <p className="text-xs text-muted-foreground">Active communities</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Creators</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-atlas-orange">{project.creators}</div>
                <p className="text-xs text-muted-foreground">Potential creators</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="signal-profile" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="signal-profile">Signal Profile</TabsTrigger>
              <TabsTrigger value="matches">Game Matches</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="creators">Creators</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signal-profile">
              <SignalProfileBuilder projectId={id || "1"} />
            </TabsContent>
            
            <TabsContent value="matches">
              <MatchEngineResults projectId={id || "1"} />
            </TabsContent>
            
            <TabsContent value="communities">
              <CommunityFinderResults projectId={id || "1"} />
            </TabsContent>
            
            <TabsContent value="creators">
              <CreatorMatchResults projectId={id || "1"} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
