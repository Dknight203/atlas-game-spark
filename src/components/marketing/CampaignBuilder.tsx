import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CampaignBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  onCampaignCreated: () => void;
}

export function CampaignBuilder({ open, onOpenChange, organizationId, onCampaignCreated }: CampaignBuilderProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("creator");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a campaign name",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          org_id: organizationId,
          name: name.trim(),
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from('activity_log').insert({
        org_id: organizationId,
        type: 'campaign_created',
        meta: { campaign_name: name, type }
      });

      toast({
        title: "Campaign Created",
        description: `${name} has been created successfully`
      });

      onCampaignCreated();
      onOpenChange(false);
      setName("");
      setDescription("");
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Marketing Campaign</DialogTitle>
          <DialogDescription>
            Set up a new outreach campaign for your indie game
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              placeholder="e.g., Launch Week Outreach"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Campaign Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creator">Creator Partnership</SelectItem>
                <SelectItem value="community">Community Engagement</SelectItem>
                <SelectItem value="mixed">Mixed Outreach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Campaign goals and strategy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
