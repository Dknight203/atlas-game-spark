import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const AccountProfile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFullName(data.full_name || "");
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-1/4"></div>
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-4 bg-muted rounded w-1/4"></div>
      <div className="h-10 bg-muted rounded"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Email cannot be changed. Contact support if you need to update your email address.
        </p>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};