
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizationSelector from "@/components/team/OrganizationSelector";
import TeamManagement from "@/components/team/TeamManagement";
import ProjectTemplates from "@/components/team/ProjectTemplates";
import { Building2, Users, FileTemplate } from "lucide-react";

const TeamDashboard = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Team Collaboration</h1>
            <p className="text-muted-foreground">
              Manage organizations, team members, and shared project templates
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Organizations Sidebar */}
            <div className="lg:col-span-1">
              <OrganizationSelector 
                onSelect={setSelectedOrgId}
                selectedOrgId={selectedOrgId}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {selectedOrgId ? (
                <Tabs defaultValue="members" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="members" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex items-center gap-2">
                      <FileTemplate className="w-4 h-4" />
                      Templates
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="members">
                    <TeamManagement organizationId={selectedOrgId} />
                  </TabsContent>

                  <TabsContent value="templates">
                    <ProjectTemplates organizationId={selectedOrgId} />
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select an Organization</h3>
                    <p className="text-muted-foreground max-w-md">
                      Choose an organization from the sidebar to manage team members and project templates
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
