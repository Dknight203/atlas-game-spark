
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Filter, Save } from "lucide-react";
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
  const [activeFilterType, setActiveFilterType] = useState<string>("");

  const availablePlatforms = ["Steam", "iOS", "Android", "Nintendo Switch", "Xbox", "PlayStation"];
  const availableGenres = ["Action", "Adventure", "RPG", "Strategy", "Puzzle", "Simulation", "Sports", "Racing", "Indie", "Casual"];

  const handleAddFilter = (type: string, value: string) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (type === 'platforms') {
        updated.platforms = [...(prev.platforms || []), value];
      } else if (type === 'genres') {
        updated.genres = [...(prev.genres || []), value];
      } else if (type === 'tags') {
        updated.tags = [...(prev.tags || []), value];
      }
      return updated;
    });
    setActiveFilterType("");
  };

  const handleRemoveFilter = (type: string, value: string) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (type === 'platforms') {
        updated.platforms = prev.platforms?.filter(p => p !== value);
      } else if (type === 'genres') {
        updated.genres = prev.genres?.filter(g => g !== value);
      } else if (type === 'tags') {
        updated.tags = prev.tags?.filter(t => t !== value);
      }
      return updated;
    });
  };

  const handleRangeFilter = (type: string, min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      [type]: [min, max]
    }));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, description, filters);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Create Discovery List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">List Name</Label>
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
              rows={3}
            />
          </div>
        </div>

        {/* Filter Builder */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          
          {/* Platform Filters */}
          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.platforms?.map(platform => (
                <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                  {platform}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveFilter('platforms', platform)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={(value) => handleAddFilter('platforms', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add platform..." />
              </SelectTrigger>
              <SelectContent>
                {availablePlatforms
                  .filter(p => !filters.platforms?.includes(p))
                  .map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genre Filters */}
          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.genres?.map(genre => (
                <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                  {genre}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveFilter('genres', genre)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={(value) => handleAddFilter('genres', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add genre..." />
              </SelectTrigger>
              <SelectContent>
                {availableGenres
                  .filter(g => !filters.genres?.includes(g))
                  .map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range ($)</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                className="w-24"
                value={filters.priceRange?.[0] || ''}
                onChange={(e) => {
                  const min = parseFloat(e.target.value) || 0;
                  const max = filters.priceRange?.[1] || 100;
                  handleRangeFilter('priceRange', min, max);
                }}
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max"
                className="w-24"
                value={filters.priceRange?.[1] || ''}
                onChange={(e) => {
                  const max = parseFloat(e.target.value) || 100;
                  const min = filters.priceRange?.[0] || 0;
                  handleRangeFilter('priceRange', min, max);
                }}
              />
            </div>
          </div>

          {/* Rating Range */}
          <div className="space-y-2">
            <Label>Rating Range</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                className="w-24"
                min="0"
                max="5"
                step="0.1"
                value={filters.ratingRange?.[0] || ''}
                onChange={(e) => {
                  const min = parseFloat(e.target.value) || 0;
                  const max = filters.ratingRange?.[1] || 5;
                  handleRangeFilter('ratingRange', min, max);
                }}
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max"
                className="w-24"
                min="0"
                max="5"
                step="0.1"
                value={filters.ratingRange?.[1] || ''}
                onChange={(e) => {
                  const max = parseFloat(e.target.value) || 5;
                  const min = filters.ratingRange?.[0] || 0;
                  handleRangeFilter('ratingRange', min, max);
                }}
              />
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
      </CardContent>
    </Card>
  );
};

export default DiscoveryListBuilder;
