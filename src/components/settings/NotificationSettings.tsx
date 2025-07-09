import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Monitor, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";

interface NotificationPreference {
  id: string;
  project_id?: string;
  notification_type: string;
  is_enabled: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  threshold_value?: number;
}

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [newNotificationType, setNewNotificationType] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { projects } = useProjects();

  const notificationTypes = [
    { value: "downloads", label: "Download Milestones" },
    { value: "revenue", label: "Revenue Targets" },
    { value: "rating", label: "Rating Changes" },
    { value: "reviews", label: "New Reviews" },
    { value: "competitor", label: "Competitor Updates" },
    { value: "market_trend", label: "Market Trends" },
  ];

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*');

      if (error) throw error;
      setPreferences(data || []);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = async (id: string, updates: Partial<NotificationPreference>) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPreferences(prev => 
        prev.map(pref => pref.id === id ? { ...pref, ...updates } : pref)
      );

      toast({
        title: "Updated",
        description: "Notification preference updated successfully",
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preference",
        variant: "destructive",
      });
    }
  };

  const createPreference = async () => {
    if (!newNotificationType) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          notification_type: newNotificationType,
          project_id: selectedProject || null,
          threshold_value: newThreshold ? parseFloat(newThreshold) : null,
          is_enabled: true,
          email_enabled: false,
          in_app_enabled: true,
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(prev => [...prev, data]);
      setNewNotificationType("");
      setNewThreshold("");
      setSelectedProject("");

      toast({
        title: "Created",
        description: "Notification preference created successfully",
      });
    } catch (error) {
      console.error('Error creating preference:', error);
      toast({
        title: "Error",
        description: "Failed to create notification preference",
        variant: "destructive",
      });
    }
  };

  const deletePreference = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPreferences(prev => prev.filter(pref => pref.id !== id));

      toast({
        title: "Deleted",
        description: "Notification preference deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting preference:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification preference",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Global Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications in the application
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Create New Notification */}
      <Card>
        <CardHeader>
          <CardTitle>Add Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select value={newNotificationType} onValueChange={setNewNotificationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Project (Optional)</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Threshold Value (Optional)</Label>
            <Input
              type="number"
              placeholder="e.g., 1000 for downloads, 4.5 for rating"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
            />
          </div>

          <Button onClick={createPreference} disabled={!newNotificationType}>
            Add Notification
          </Button>
        </CardContent>
      </Card>

      {/* Existing Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Active Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {preferences.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No notification preferences configured yet.
            </p>
          ) : (
            <div className="space-y-4">
              {preferences.map((pref) => (
                <div key={pref.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {notificationTypes.find(t => t.value === pref.notification_type)?.label || pref.notification_type}
                      </Badge>
                      {pref.threshold_value && (
                        <Badge variant="secondary">
                          Threshold: {pref.threshold_value}
                        </Badge>
                      )}
                      {pref.project_id && (
                        <Badge variant="secondary">
                          Project: {projects.find(p => p.id === pref.project_id)?.name || 'Unknown'}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePreference(pref.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={pref.is_enabled}
                        onCheckedChange={(checked) => 
                          updatePreference(pref.id, { is_enabled: checked })
                        }
                      />
                      <Label>Enabled</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <Switch
                        checked={pref.email_enabled}
                        onCheckedChange={(checked) => 
                          updatePreference(pref.id, { email_enabled: checked })
                        }
                      />
                      <Label>Email</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4" />
                      <Switch
                        checked={pref.in_app_enabled}
                        onCheckedChange={(checked) => 
                          updatePreference(pref.id, { in_app_enabled: checked })
                        }
                      />
                      <Label>In-App</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
