
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { DiscoveryFilters as DiscoveryFiltersType } from "@/types/discovery";

interface DiscoveryFiltersProps {
  filters: DiscoveryFiltersType;
  onFiltersChange: (filters: DiscoveryFiltersType) => void;
  resultCount: number;
  totalCount: number;
}

const DiscoveryFilters = ({ filters, onFiltersChange, resultCount, totalCount }: DiscoveryFiltersProps) => {
  const [platformsOpen, setPlatformsOpen] = useState(true);
  const [genresOpen, setGenresOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const availablePlatforms = ["Steam", "iOS", "Android", "Nintendo Switch", "Xbox", "PlayStation", "Epic Games", "Mobile"];
  const availableGenres = ["Action", "Adventure", "RPG", "Strategy", "Puzzle", "Simulation", "Sports", "Racing", "Indie", "Casual", "FPS", "Shooter"];

  const updateFilters = (newFilters: Partial<DiscoveryFiltersType>) => {
    onFiltersChange({ ...filters, ...newFilters });
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

  const handlePriceChange = (values: number[]) => {
    updateFilters({ priceRange: [values[0], values[1]] });
  };

  const handleRatingChange = (values: number[]) => {
    updateFilters({ ratingRange: [values[0], values[1]] });
  };

  const handleYearChange = (values: number[]) => {
    updateFilters({ releaseYearRange: [values[0], values[1]] });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = () => {
    return !!(filters.platforms?.length || filters.genres?.length || filters.priceRange || filters.ratingRange || filters.releaseYearRange);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </div>
          {hasActiveFilters() && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs h-7 px-2"
            >
              Clear all
            </Button>
          )}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {resultCount} of {totalCount} games
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {filters.platforms?.map(platform => (
                <Badge key={platform} variant="secondary" className="text-xs flex items-center gap-1">
                  {platform}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removePlatform(platform)}
                  />
                </Badge>
              ))}
              {filters.genres?.map(genre => (
                <Badge key={genre} variant="secondary" className="text-xs flex items-center gap-1">
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

        {/* Platforms */}
        <Collapsible open={platformsOpen} onOpenChange={setPlatformsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="font-medium">Platforms</Label>
              {platformsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Genres */}
        <Collapsible open={genresOpen} onOpenChange={setGenresOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="font-medium">Genres</Label>
              {genresOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="font-medium">Price Range</Label>
              {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            <div className="px-2">
              <Slider
                value={filters.priceRange || [0, 100]}
                onValueChange={handlePriceChange}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>${filters.priceRange?.[0] || 0}</span>
                <span>${filters.priceRange?.[1] || 100}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Rating Range */}
        <Collapsible open={ratingOpen} onOpenChange={setRatingOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="font-medium">Rating Range</Label>
              {ratingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            <div className="px-2">
              <Slider
                value={filters.ratingRange || [0, 5]}
                onValueChange={handleRatingChange}
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
          </CollapsibleContent>
        </Collapsible>

        {/* Release Year */}
        <Collapsible open={yearOpen} onOpenChange={setYearOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="font-medium">Release Year</Label>
              {yearOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            <div className="px-2">
              <Slider
                value={filters.releaseYearRange || [2010, 2024]}
                onValueChange={handleYearChange}
                max={2024}
                min={2000}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{filters.releaseYearRange?.[0] || 2010}</span>
                <span>{filters.releaseYearRange?.[1] || 2024}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default DiscoveryFilters;
