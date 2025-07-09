import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountProfile } from "@/components/settings/AccountProfile";
import { Security } from "@/components/settings/Security";
import { APIManagement } from "@/components/settings/APIManagement";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account & Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API Management</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account & Profile</CardTitle>
                  <CardDescription>
                    Update your account information and profile details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountProfile />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your password and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Security />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Management</CardTitle>
                  <CardDescription>
                    Generate and manage your API keys for external integrations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <APIManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;