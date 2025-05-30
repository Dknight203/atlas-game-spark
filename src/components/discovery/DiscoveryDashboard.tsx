
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Download } from "lucide-react";
import { useDiscovery } from "@/hooks/useDiscovery";
import DiscoveryListBuilder from "./DiscoveryListBuilder";
import EnhancedGameCard from "./EnhancedGameCard";
import type { DiscoveryFilters } from "@/types/discovery";

interface DiscoveryDashboardProps {
  projectId: string;
}

const DiscoveryDashboard = ({ projectId }: DiscoveryDashboardProps) => {
  const [showListBuilder, setShowListBuilder] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DiscoveryFilters>({});
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  const {
    discoveryLists,
    enhancedGameData,
    isLoading,
    createDiscoveryList,
    deleteDiscoveryList,
    applyFilters
  } = useDiscovery(projectId);

  const filteredGames = applyFilters(activeFilters);

  const handleCreateList = async (name: string, description: string, filters: DiscoveryFilters) => {
    try {
      await createDiscoveryList(name, description, filters);
      setShowListBuilder(false);
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  const handleApplyListFilters = (listId: string) => {
    const list = discoveryLists.find(l => l.id === listId);
    if (list) {
      setActiveFilters(list.filters as DiscoveryFilters);
      setSelectedListId(listId);
    }
  };

  const handleTrackGame = (gameId: string) => {
    // TODO: Implement game tracking functionality
    console.log('Track game:', gameId);
  };

  const handleAnalyzeGame = (gameId: string) => {
    // TODO: Implement game analysis functionality
    console.log('Analyze game:', gameId);
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Export data');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
        <p className="ml-4 text-gray-600">Loading discovery engine...</p>
      </div>
    );
  }

  if (showListBuilder) {
    return (
      <DiscoveryListBuilder
        projectId={projectId}
        onSave={handleCreateList}
        onCancel={() => setShowListBuilder(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Enhanced Game Discovery</CardTitle>
              <p className="text-gray-600 mt-1">
                Advanced game discovery with ML-powered recommendations and real-time data
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setShowListBuilder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create List
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="discover" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="discover">Discover Games</TabsTrigger>
              <TabsTrigger value="lists">My Lists ({discoveryLists.length})</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discover" className="space-y-6">
              {/* Filter Summary */}
              {Object.keys(activeFilters).length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Active Filters: {Object.keys(activeFilters).length}
                        </span>
                        {selectedListId && (
                          <span className="text-sm text-gray-600">
                            from "{discoveryLists.find(l => l.id === selectedListId)?.name}"
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setActiveFilters({});
                          setSelectedListId(null);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map(game => (
                  <EnhancedGameCard
                    key={game.id}
                    game={game}
                    onTrack={handleTrackGame}
                    onAnalyze={handleAnalyzeGame}
                  />
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {Object.keys(activeFilters).length > 0 
                      ? "No games match your current filters" 
                      : "No games available"}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="lists" className="space-y-4">
              {discoveryLists.length === 0 ? (
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No discovery lists created yet</p>
                  <Button onClick={() => setShowListBuilder(true)}>
                    Create Your First List
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {discoveryLists.map(list => (
                    <Card key={list.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{list.name}</CardTitle>
                        {list.description && (
                          <p className="text-sm text-gray-600">{list.description}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">
                            {Object.keys(list.filters).length} filters
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApplyListFilters(list.id)}
                            >
                              Apply
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteDiscoveryList(list.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Trending games analysis coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoveryDashboard;
