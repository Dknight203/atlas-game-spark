
import { useState } from "react";
import { useProjectTemplates } from "@/hooks/useProjectTemplates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { File, Plus, MoreHorizontal, Edit, Trash2, Copy, Globe, Lock } from "lucide-react";

interface ProjectTemplatesProps {
  organizationId?: string;
  onUseTemplate?: (templateData: any) => void;
}

const ProjectTemplates = ({ organizationId, onUseTemplate }: ProjectTemplatesProps) => {
  const { templates, createTemplate, updateTemplate, deleteTemplate, isLoading } = useProjectTemplates();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    isPublic: false,
  });

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) return;

    // Sample template data - in a real app, this would be more sophisticated
    const templateData = {
      genre: "action",
      platform: "pc",
      status: "development",
      signal_profile: {
        target_audience: "Core gamers",
        themes: ["combat", "adventure"],
        mechanics: ["third-person", "open-world"],
        tone: "serious",
        unique_features: "Dynamic weather system",
      }
    };

    const success = await createTemplate(
      newTemplate.name,
      newTemplate.description,
      templateData,
      organizationId,
      newTemplate.isPublic
    );

    if (success) {
      setShowCreateDialog(false);
      setNewTemplate({ name: "", description: "", isPublic: false });
    }
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate({
      ...template,
      isPublic: template.is_public,
    });
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    const success = await updateTemplate(editingTemplate.id, {
      name: editingTemplate.name,
      description: editingTemplate.description,
      is_public: editingTemplate.isPublic,
    });

    if (success) {
      setEditingTemplate(null);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(templateId);
    }
  };

  const handleUseTemplate = (template: any) => {
    onUseTemplate?.(template.template_data);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Templates</h3>
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <File className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  {template.is_public ? (
                    <Globe className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-500" />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {template.description && (
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              )}
              <div className="flex justify-between items-center">
                <Badge variant={template.is_public ? "default" : "secondary"}>
                  {template.is_public ? "Public" : "Private"}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card className="border-dashed col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <File className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-4">No templates yet</p>
              <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this template"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="template-public"
                checked={newTemplate.isPublic}
                onCheckedChange={(checked) => setNewTemplate(prev => ({ ...prev, isPublic: checked }))}
              />
              <Label htmlFor="template-public">Make template public</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate} disabled={!newTemplate.name.trim()}>
                Create Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-template-name">Template Name</Label>
                <Input
                  id="edit-template-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-template-description">Description</Label>
                <Textarea
                  id="edit-template-description"
                  value={editingTemplate.description || ""}
                  onChange={(e) => setEditingTemplate(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-template-public"
                  checked={editingTemplate.isPublic}
                  onCheckedChange={(checked) => setEditingTemplate(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="edit-template-public">Make template public</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTemplate}>
                  Update Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTemplates;
