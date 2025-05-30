
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X, Filter, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const availablePlatforms = ["Steam", "iOS", "Android", "Nintendo Switch", "Xbox", "PlayStation", "Epic Games", "Mobile"];
  const availableGenres = ["Action", "Adventure", "RPG", "Strategy", "Puzzle", "Simulation", "Sports", "Racing", "Indie", "Casual", "FPS", "Shooter"];

  const updateFilters = (newFilters: Partial<DiscoveryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const togglePlatform = (platform: string) => {
    const current = filters.platforms || [];
    const updated = current.includes(platform)
      ? current.filter(p => p !== platform)
      : [...current, platform];
    updateFilters({ platforms: updated });
  };

  const toggleGenre = (genre: string) => {
    const current = filters.genres || [];
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    updateFilters({ genres: updated });
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">List Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Indie Puzzle Games"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the criteria for this list..."
                rows={2}
              />
            </div>
          </div>

          {/* Active Filters Preview */}
          {(filters.platforms?.length || filters.genres?.length) && (
            <div className="space-y-2">
              <Label>Selected Filters</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                {filters.platforms?.map(platform => (
                  <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                    {platform}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removePlatform(platform)}
                    />
                  </Badge>
                ))}
                {filters.genres?.map(genre => (
                  <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                    {genre}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeGenre(genre)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Filter Builder */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            
            {/* Platform Filters */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {availablePlatforms.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={filters.platforms?.includes(platform) || false}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <Label htmlFor={`platform-${platform}`} className="text-sm cursor-pointer">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Filters */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Genres</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableGenres.map(genre => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={filters.genres?.includes(genre) || false}
                      onCheckedChange={() => toggleGenre(genre)}
                    />
                    <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Price Range ($)</Label>
              <div className="px-3">
                <Slider
                  value={filters.priceRange || [0, 100]}
                  onValueChange={(values) => updateFilters({ priceRange: [values[0], values[1]] })}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>${filters.priceRange?.[0] || 0}</span>
                  <span>${filters.priceRange?.[1] || 100}</span>
                </div>
              </div>
            </div>

            {/* Rating Range */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Rating Range</Label>
              <div className="px-3">
                <Slider
                  value={filters.ratingRange || [0, 5]}
                  onValueChange={(values) => updateFilters({ ratingRange: [values[0], values[1]] })}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{filters.ratingRange?.[0]?.toFixed(1) || '0.0'}</span>
                  <span>{filters.ratingRange?.[1]?.toFixed(1) || '5.0'}</span>
                </div>
              </div>
            </div>
          </div>

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
