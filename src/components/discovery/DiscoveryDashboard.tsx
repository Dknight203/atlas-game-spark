
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { useDiscovery } from "@/hooks/useDiscovery";
import DiscoveryListBuilder from "./DiscoveryListBuilder";
import EnhancedGameCard from "./EnhancedGameCard";
import SmartSuggestions from "@/components/ai/SmartSuggestions";
import type { DiscoveryFilters } from "@/types/discovery";

interface DiscoveryDashboardProps {
  projectId: string;
}

const DiscoveryDashboard = ({ projectId }: DiscoveryDashboardProps) => {
  const { discoveryLists, enhancedGameData, applyFilters, createDiscoveryList } = useDiscovery(projectId);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<DiscoveryFilters>({});
  const [filteredGames, setFilteredGames] = useState(enhancedGameData);

  const handleFilterApply = (filters: DiscoveryFilters) => {
    setCurrentFilters(filters);
    const filtered = applyFilters(filters);
    setFilteredGames(filtered);
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
    
    handleFilterApply(newFilters);
  };

  const handleListSave = async (name: string, description: string, filters: DiscoveryFilters) => {
    try {
      const newList = await createDiscoveryList(name, description, filters);
      setShowBuilder(false);
      handleFilterApply(filters);
    } catch (error) {
      console.error('Error creating discovery list:', error);
    }
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
              onClick={() => handleFilterApply({})}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Discovery Lists */}
              {discoveryLists.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Your Discovery Lists</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {discoveryLists.map((list) => (
                      <Card key={list.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{list.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {list.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Created {new Date(list.created_at).toLocaleDateString()}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleFilterApply(list.filters)}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Filtered Games Results */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Discovered Games ({filteredGames.length})
                </h3>
                {filteredGames.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No games found matching your current filters. Try adjusting your criteria or use AI suggestions.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
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
