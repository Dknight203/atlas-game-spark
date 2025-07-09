import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizationSelector from "@/components/team/OrganizationSelector";
import TeamManagement from "@/components/team/TeamManagement";

const OrganizationSettings = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationSelector 
            onSelect={setSelectedOrgId}
            selectedOrgId={selectedOrgId}
          />
        </CardContent>
      </Card>

      {selectedOrgId && (
        <Card>
          <CardHeader>
            <CardTitle>Organization Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="team" className="space-y-4">
              <TabsList>
                <TabsTrigger value="team">Team Members</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="team">
                <TeamManagement organizationId={selectedOrgId} />
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Organization Settings</h3>
                  <p className="text-muted-foreground">
                    Organization settings and billing management will be available here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationSettings;