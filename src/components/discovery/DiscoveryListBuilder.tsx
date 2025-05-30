
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BasicInfoForm from "./builder/BasicInfoForm";
import ActiveFiltersDisplay from "./builder/ActiveFiltersDisplay";
import FilterBuilder from "./builder/FilterBuilder";
import type { DiscoveryFilters } from "@/types/discovery";

interface DiscoveryListBuilderProps {
  projectId: string;
  onSave: (name: string, description: string, filters: DiscoveryFilters) => void;
  onCancel: () => void;
  initialFilters?: DiscoveryFilters;
}

const DiscoveryListBuilder = ({ 
  projectId, 
  onSave, 
  onCancel, 
  initialFilters = {} 
}: DiscoveryListBuilderProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [filters, setFilters] = useState<DiscoveryFilters>(initialFilters);

  const updateFilters = (newFilters: Partial<DiscoveryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const removePlatform = (platform: string) => {
    const updated = (filters.platforms || []).filter(p => p !== platform);
    updateFilters({ platforms: updated });
  };

  const removeGenre = (genre: string) => {
    const updated = (filters.genres || []).filter(g => g !== genre);
    updateFilters({ genres: updated });
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, description, filters);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Create Discovery List
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <BasicInfoForm
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
          />

          <ActiveFiltersDisplay
            filters={filters}
            onRemovePlatform={removePlatform}
            onRemoveGenre={removeGenre}
          />

          <FilterBuilder
            filters={filters}
            onFiltersChange={updateFilters}
          />

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={!name.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save List
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscoveryListBuilder;
