
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, X } from "lucide-react";
import { useDiscovery } from "@/hooks/useDiscovery";
import DiscoveryListBuilder from "./DiscoveryListBuilder";
import EnhancedGameCard from "./EnhancedGameCard";
import DiscoveryFilters from "./DiscoveryFilters";
import SmartSuggestions from "@/components/ai/SmartSuggestions";
import type { DiscoveryFilters as DiscoveryFiltersType } from "@/types/discovery";

interface DiscoveryDashboardProps {
  projectId: string;
  onComplete?: () => void;
}

const DiscoveryDashboard = ({ projectId, onComplete }: DiscoveryDashboardProps) => {
  const { discoveryLists, enhancedGameData, applyFilters, createDiscoveryList } = useDiscovery(projectId);
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<DiscoveryFiltersType>({});
  const [filteredGames, setFilteredGames] = useState(enhancedGameData);

  // Update filtered games when data or filters change
  useEffect(() => {
    const filtered = applyFilters(currentFilters);
    setFilteredGames(filtered);
  }, [enhancedGameData, currentFilters, applyFilters]);

  const handleFilterChange = (filters: DiscoveryFiltersType) => {
    setCurrentFilters(filters);
  };

  const clearFilters = () => {
    setCurrentFilters({});
  };

  const handleSuggestionApply = (suggestion: any) => {
    const newFilters = { ...currentFilters };
    
    switch (suggestion.type) {
      case 'platform':
        newFilters.platforms = [...(newFilters.platforms || []), suggestion.value];
        break;
      case 'genre':
        newFilters.genres = [...(newFilters.genres || []), suggestion.value];
        break;
      case 'tag':
        newFilters.tags = [...(newFilters.tags || []), suggestion.value];
        break;
    }
    
    setCurrentFilters(newFilters);
  };

  const handleListSave = async (name: string, description: string, filters: DiscoveryFiltersType) => {
    try {
      const newList = await createDiscoveryList(name, description, filters);
      setShowBuilder(false);
      setCurrentFilters(filters);
      
      // Trigger completion callback
      onComplete?.();
    } catch (error) {
      console.error('Error creating discovery list:', error);
    }
  };

  const handleApplyListFilters = (filters: DiscoveryFiltersType) => {
    setCurrentFilters(filters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.platforms?.length) count++;
    if (currentFilters.genres?.length) count++;
    if (currentFilters.tags?.length) count++;
    if (currentFilters.priceRange) count++;
    if (currentFilters.ratingRange) count++;
    if (currentFilters.releaseYearRange) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Game Discovery Engine
          </CardTitle>
          <CardDescription>
            Discover and analyze games similar to yours using advanced filtering and AI recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={() => setShowBuilder(true)}
              className="bg-atlas-purple hover:bg-opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Discovery List
            </Button>
            <Button 
              variant="outline"
              onClick={clearFilters}
              disabled={getActiveFilterCount() === 0}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <DiscoveryFilters
                filters={currentFilters}
                onFiltersChange={handleFilterChange}
                resultCount={filteredGames.length}
                totalCount={enhancedGameData.length}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Discovery Lists */}
              {discoveryLists.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Your Discovery Lists</h3>
                  <div className="grid gap-3">
                    {discoveryLists.map((list) => (
                      <Card key={list.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{list.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{list.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Created {new Date(list.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApplyListFilters(list.filters)}
                            >
                              Apply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Discovered Games ({filteredGames.length})
                </h3>
                {filteredGames.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {enhancedGameData.length === 0 
                          ? "No games available. Try refreshing or check back later."
                          : "No games match your current filters. Try adjusting your criteria."
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredGames.map((game) => (
                      <EnhancedGameCard key={game.id} game={game} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Suggestions Sidebar */}
            <div className="lg:col-span-1">
              <SmartSuggestions
                type="discovery"
                data={currentFilters}
                onSuggestionApply={handleSuggestionApply}
                className="sticky top-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discovery List Builder Modal */}
      {showBuilder && (
        <DiscoveryListBuilder
          projectId={projectId}
          onSave={handleListSave}
          onCancel={() => setShowBuilder(false)}
        />
      )}
    </div>
  );
};

export default DiscoveryDashboard;
