
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ProjectNew = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    genre: "",
    platform: "",
    status: "development"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate project creation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Project Created",
        description: `${formData.name} has been created successfully!`,
      });
      navigate("/dashboard");
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
            <p className="text-gray-600">Set up your game project to start finding your audience.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Tell us about your game to help us find the right matches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Game Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your game name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your game..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre">Primary Genre</Label>
                    <Input
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      placeholder="e.g., RPG, Platformer, Puzzle"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="platform">Target Platform</Label>
                    <Input
                      id="platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      placeholder="e.g., PC, Mobile, Console"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-atlas-purple hover:bg-opacity-90"
                    disabled={isLoading || !formData.name}
                  >
                    {isLoading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectNew;
