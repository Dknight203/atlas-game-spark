
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { DiscoveryFilters } from "@/types/discovery";

interface ActiveFiltersDisplayProps {
  filters: DiscoveryFilters;
  onRemovePlatform: (platform: string) => void;
  onRemoveGenre: (genre: string) => void;
}

const ActiveFiltersDisplay = ({ 
  filters, 
  onRemovePlatform, 
  onRemoveGenre 
}: ActiveFiltersDisplayProps) => {
  const hasActiveFilters = filters.platforms?.length || filters.genres?.length;

  if (!hasActiveFilters) return null;

  return (
    <div className="space-y-2">
      <Label>Selected Filters</Label>
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
        {filters.platforms?.map(platform => (
          <Badge key={platform} variant="secondary" className="flex items-center gap-1">
            {platform}
            <X 
              className="w-3 h-3 cursor-pointer hover:text-red-500" 
              onClick={() => onRemovePlatform(platform)}
            />
          </Badge>
        ))}
        {filters.genres?.map(genre => (
          <Badge key={genre} variant="secondary" className="flex items-center gap-1">
            {genre}
            <X 
              className="w-3 h-3 cursor-pointer hover:text-red-500" 
              onClick={() => onRemoveGenre(genre)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ActiveFiltersDisplay;
