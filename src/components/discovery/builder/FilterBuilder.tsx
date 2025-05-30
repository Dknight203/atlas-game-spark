
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { DiscoveryFilters } from "@/types/discovery";

interface FilterBuilderProps {
  filters: DiscoveryFilters;
  onFiltersChange: (filters: Partial<DiscoveryFilters>) => void;
}

const availablePlatforms = ["Steam", "iOS", "Android", "Nintendo Switch", "Xbox", "PlayStation", "Epic Games", "Mobile"];
const availableGenres = ["Action", "Adventure", "RPG", "Strategy", "Puzzle", "Simulation", "Sports", "Racing", "Indie", "Casual", "FPS", "Shooter"];

const FilterBuilder = ({ filters, onFiltersChange }: FilterBuilderProps) => {
  const togglePlatform = (platform: string) => {
    const current = filters.platforms || [];
    const updated = current.includes(platform)
      ? current.filter(p => p !== platform)
      : [...current, platform];
    onFiltersChange({ platforms: updated });
  };

  const toggleGenre = (genre: string) => {
    const current = filters.genres || [];
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    onFiltersChange({ genres: updated });
  };

  return (
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
            onValueChange={(values) => onFiltersChange({ priceRange: [values[0], values[1]] })}
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
            onValueChange={(values) => onFiltersChange({ ratingRange: [values[0], values[1]] })}
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
  );
};

export default FilterBuilder;
