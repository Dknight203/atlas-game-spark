import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

interface APIKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
}

export const APIManagement = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    // For now, store API keys in localStorage since we don't have a backend table
    // In a real implementation, this would fetch from a secure backend
    const stored = localStorage.getItem(`api_keys_${user?.id}`);
    if (stored) {
      setApiKeys(JSON.parse(stored));
    }
  };

  const saveAPIKeys = (keys: APIKey[]) => {
    localStorage.setItem(`api_keys_${user?.id}`, JSON.stringify(keys));
    setApiKeys(keys);
  };

  const generateAPIKey = () => {
    // Generate a secure API key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ga_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newKey: APIKey = {
        id: crypto.randomUUID(),
        name: newKeyName.trim(),
        key: generateAPIKey(),
        created_at: new Date().toISOString(),
      };

      const updatedKeys = [...apiKeys, newKey];
      saveAPIKeys(updatedKeys);
      setNewKeyName("");

      toast({
        title: "Success",
        description: "API key created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = (keyId: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== keyId);
    saveAPIKeys(updatedKeys);
    toast({
      title: "Success",
      description: "API key deleted successfully",
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskKey = (key: string) => {
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Create New API Key</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="keyName">API Key Name</Label>
            <Input
              id="keyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Production App, Analytics Dashboard"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreateKey} disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Key"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your API Keys</h3>
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No API keys created yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first API key to start integrating with GameAtlas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{apiKey.name}</CardTitle>
                      <CardDescription>
                        Created {new Date(apiKey.created_at).toLocaleDateString()}
                        {apiKey.last_used && ` • Last used ${new Date(apiKey.last_used).toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Input
                      value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteKey(apiKey.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Use your API keys to authenticate requests to the GameAtlas API. Include your key in the Authorization header:
          </p>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            Authorization: Bearer your_api_key_here
          </div>
          <Button variant="outline" className="mt-3" disabled>
            View Full Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};