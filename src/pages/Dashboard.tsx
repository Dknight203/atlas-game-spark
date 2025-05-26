
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Target, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [projects] = useState([
    {
      id: 1,
      name: "Space Explorer RPG",
      status: "Active",
      matches: 24,
      communities: 8,
      creators: 12,
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      name: "Pixel Adventure",
      status: "Draft",
      matches: 0,
      communities: 0,
      creators: 0,
      lastUpdated: "1 week ago"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your game projects and discover new opportunities.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Game Matches</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.matches, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Communities</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.communities, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Creators</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.creators, 0)}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>Updated {project.lastUpdated}</CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-atlas-purple">{project.matches}</div>
                      <div className="text-xs text-gray-500">Matches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-atlas-teal">{project.communities}</div>
                      <div className="text-xs text-gray-500">Communities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-atlas-orange">{project.creators}</div>
                      <div className="text-xs text-gray-500">Creators</div>
                    </div>
                  </div>
                  <Link to={`/project/${project.id}`}>
                    <Button variant="outline" className="w-full">
                      View Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
