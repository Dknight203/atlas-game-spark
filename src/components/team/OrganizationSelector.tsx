
import { useState } from "react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Building2, Users } from "lucide-react";

interface OrganizationSelectorProps {
  onSelect?: (orgId: string) => void;
  selectedOrgId?: string;
}

const OrganizationSelector = ({ onSelect, selectedOrgId }: OrganizationSelectorProps) => {
  const { organizations, createOrganization, isLoading } = useOrganizations();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) return;

    setIsCreating(true);
    const org = await createOrganization(newOrgName, newOrgDescription);
    
    if (org) {
      setShowCreateDialog(false);
      setNewOrgName("");
      setNewOrgDescription("");
      onSelect?.(org.id);
    }
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Organizations</h3>
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </div>

      <div className="grid gap-4">
        {organizations.map((org) => (
          <Card 
            key={org.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedOrgId === org.id ? 'border-primary shadow-md' : ''
            }`}
            onClick={() => onSelect?.(org.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-base">{org.name}</CardTitle>
              </div>
            </CardHeader>
            {org.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{org.description}</p>
              </CardContent>
            )}
          </Card>
        ))}

        {organizations.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Building2 className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-4">No organizations yet</p>
              <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Organization
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <Label htmlFor="org-description">Description (Optional)</Label>
              <Textarea
                id="org-description"
                value={newOrgDescription}
                onChange={(e) => setNewOrgDescription(e.target.value)}
                placeholder="Describe your organization"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateOrganization}
                disabled={!newOrgName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationSelector;
