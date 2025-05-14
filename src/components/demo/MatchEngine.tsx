
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight, Filter, Search } from "lucide-react";

type Game = {
  name: string;
  overlap: string;
  tags: string[];
  devSize: string;
  releaseDate: string;
  estSales: string;
};

const MatchEngine = () => {
  const [matchResults, setMatchResults] = useState<Game[]>([
    { 
      name: 'Outer Wilds', 
      overlap: '85%', 
      tags: ['Exploration', 'Sci-Fi', 'Adventure'],
      devSize: 'Small',
      releaseDate: '2019-05-28',
      estSales: '1.5M+' 
    },
    { 
      name: 'No Man\'s Sky', 
      overlap: '76%', 
      tags: ['Exploration', 'Sci-Fi', 'Adventure'],
      devSize: 'Medium',
      releaseDate: '2016-08-09',
      estSales: '10M+' 
    },
    { 
      name: 'FTL: Faster Than Light', 
      overlap: '72%', 
      tags: ['Roguelike', 'Space', 'Strategy'],
      devSize: 'Small',
      releaseDate: '2012-09-14',
      estSales: '3M+' 
    },
    { 
      name: 'Stardew Valley', 
      overlap: '65%', 
      tags: ['Simulation', 'Farming', 'Adventure'],
      devSize: 'Solo',
      releaseDate: '2016-02-26',
      estSales: '20M+' 
    },
    { 
      name: 'Hades', 
      overlap: '60%', 
      tags: ['Roguelike', 'Action', 'Mythology'],
      devSize: 'Small',
      releaseDate: '2020-09-17',
      estSales: '5M+' 
    }
  ]);
  
  const [filteredResults, setFilteredResults] = useState(matchResults);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevSizes, setSelectedDevSizes] = useState<string[]>([]);
  const [selectedSalesRange, setSelectedSalesRange] = useState<string>("");

  // Define developer size categories with descriptions
  const developerSizes = [
    { 
      name: "Solo", 
      description: "1 person development team" 
    },
    { 
      name: "Small", 
      description: "2-10 person development team" 
    },
    { 
      name: "Medium", 
      description: "11-50 person development team" 
    },
    { 
      name: "Large", 
      description: "51+ person development team" 
    }
  ];

  const handleGenerateMatches = () => {
    // In a real app, this would call an API to get matches
    // For the demo we'll just simulate by showing the existing results
    applyFilters();
  };

  const applyFilters = () => {
    let results = [...matchResults];
    
    // Apply search filter
    if (searchQuery) {
      results = results.filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply developer size filter
    if (selectedDevSizes.length > 0) {
      results = results.filter(game => selectedDevSizes.includes(game.devSize));
    }
    
    // Apply estimated sales filter
    if (selectedSalesRange) {
      switch (selectedSalesRange) {
        case "under1m":
          results = results.filter(game => game.estSales.includes("M+") && parseInt(game.estSales) < 1);
          break;
        case "1mTo5m":
          results = results.filter(game => game.estSales.includes("M+") && 
            parseInt(game.estSales) >= 1 && parseInt(game.estSales) <= 5);
          break;
        case "over5m":
          results = results.filter(game => game.estSales.includes("M+") && parseInt(game.estSales) > 5);
          break;
      }
    }
    
    setFilteredResults(results);
  };

  const handleSelectChange = (value: string, currentSelected: string[]) => {
    return currentSelected.includes(value)
      ? currentSelected.filter(item => item !== value)
      : [...currentSelected, value];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Game Match Engine</CardTitle>
        <CardDescription>Discover games with similar audiences based on community data and tag similarities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search games or tags..." 
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Developer Size</h4>
                    <div className="space-y-2">
                      <TooltipProvider>
                        {developerSizes.map(size => (
                          <div key={size.name} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`dev-${size.name}`}
                              checked={selectedDevSizes.includes(size.name)}
                              onCheckedChange={() => {
                                setSelectedDevSizes(
                                  handleSelectChange(size.name, selectedDevSizes)
                                );
                              }}
                            />
                            <label htmlFor={`dev-${size.name}`} className="text-sm flex items-center">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help border-b border-dotted border-gray-400">
                                    {size.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">{size.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </label>
                          </div>
                        ))}
                      </TooltipProvider>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Estimated Sales</h4>
                    <RadioGroup 
                      value={selectedSalesRange}
                      onValueChange={setSelectedSalesRange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="under1m" id="under1m" />
                        <label htmlFor="under1m" className="text-sm">Under 1M</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1mTo5m" id="1mTo5m" />
                        <label htmlFor="1mTo5m" className="text-sm">1M - 5M</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="over5m" id="over5m" />
                        <label htmlFor="over5m" className="text-sm">Over 5M</label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-atlas-purple" 
                  onClick={() => {
                    applyFilters();
                    setFilterOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              className="bg-atlas-purple"
              onClick={handleGenerateMatches}
            >
              Find Matches
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((game, index) => (
              <div key={index} className="flex items-start p-4 border rounded-lg gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-medium">{game.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 mt-1">
                      {game.overlap} audience overlap
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded cursor-help">
                          {game.devSize}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          {developerSizes.find(size => size.name === game.devSize)?.description || game.devSize}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                      {game.estSales}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {game.tags.map((tag, i) => (
                      <span key={i} className="bg-atlas-teal bg-opacity-10 text-atlas-teal px-2 py-0.5 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1 flex-shrink-0">
                  <span>Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-gray-500">No matching games found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-atlas-purple ml-auto">View Full Report</Button>
      </CardFooter>
    </Card>
  );
};

export default MatchEngine;
