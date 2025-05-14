import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const Demo = () => {
  const [activeTab, setActiveTab] = useState("signal-profile");
  const [gameData, setGameData] = useState({
    title: "",
    pitch: "",
    platforms: ["Steam"],
    genres: ["Roguelike"],
  });

  // Match engine states
  const [matchResults, setMatchResults] = useState([
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

  const form = useForm({
    defaultValues: {
      title: "Starlight Wanderer",
      pitch: "A narrative roguelike about exploring a procedurally generated galaxy...",
      platforms: ["Steam", "itch.io", "Xbox", "Switch", "PlayStation"],
      genres: ["Roguelike", "Adventure", "Narrative", "Sci-Fi", "Exploration"]
    }
  });

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-atlas-purple">GameAtlas Demo</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our platform's key features and see how GameAtlas can help your game find its audience.
            </p>
          </div>
          
          <Tabs defaultValue="signal-profile" className="max-w-5xl mx-auto" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-1 rounded-lg border">
              <TabsTrigger value="signal-profile" className="data-[state=active]:bg-atlas-purple data-[state=active]:text-white">
                Signal Profile
              </TabsTrigger>
              <TabsTrigger value="match-engine" className="data-[state=active]:bg-atlas-purple data-[state=active]:text-white">
                Match Engine
              </TabsTrigger>
              <TabsTrigger value="community-map" className="data-[state=active]:bg-atlas-purple data-[state=active]:text-white">
                Community Map
              </TabsTrigger>
              <TabsTrigger value="creator-match" className="data-[state=active]:bg-atlas-purple data-[state=active]:text-white">
                Creator Match
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <TabsContent value="signal-profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Signal Profile Builder</CardTitle>
                    <CardDescription>Create a structured profile of your game to find the perfect audience match</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Game Title</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-full p-2 border rounded-md" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pitch"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Short Pitch</FormLabel>
                                <FormControl>
                                  <textarea 
                                    {...field} 
                                    className="w-full p-2 border rounded-md" 
                                    rows={2}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                              <div className="flex flex-wrap gap-2">
                                {['Steam', 'itch.io', 'Xbox', 'Switch', 'PlayStation'].map(platform => (
                                  <div key={platform} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`platform-${platform}`} 
                                      checked={form.getValues("platforms").includes(platform)}
                                      onCheckedChange={() => {
                                        const current = form.getValues("platforms");
                                        form.setValue("platforms", handleSelectChange(platform, current));
                                      }}
                                    />
                                    <label htmlFor={`platform-${platform}`} className="text-sm">
                                      {platform}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Genre Tags</label>
                              <div className="flex flex-wrap gap-2">
                                {['Roguelike', 'Adventure', 'Narrative', 'Sci-Fi', 'Exploration'].map(tag => (
                                  <div key={tag} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`genre-${tag}`} 
                                      checked={form.getValues("genres").includes(tag)}
                                      onCheckedChange={() => {
                                        const current = form.getValues("genres");
                                        form.setValue("genres", handleSelectChange(tag, current));
                                      }}
                                    />
                                    <label htmlFor={`genre-${tag}`} className="text-sm">
                                      {tag}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-atlas-purple ml-auto">Save Profile</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="match-engine" className="mt-0">
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
              </TabsContent>
              
              <TabsContent value="community-map" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Opportunity Map</CardTitle>
                    <CardDescription>Find active communities where your target audience is already engaging</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {[
                        {type: 'Reddit', name: 'r/IndieGames', activity: 'High', age: '2 days old'},
                        {type: 'Discord', name: 'Indie Dev Hub', activity: 'Medium', age: '5 days old'},
                        {type: 'Reddit', name: 'r/roguelikes', activity: 'High', age: '1 day old'}
                      ].map((item, index) => (
                        <div key={index} className="py-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${item.activity === 'High' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{item.type} • {item.age}</div>
                          </div>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <span>View</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-atlas-purple ml-auto">View All Communities</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="creator-match" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Creator Match Engine</CardTitle>
                    <CardDescription>Connect with content creators who have covered similar games</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {name: 'SpaceGamePlays', platform: 'YouTube', subs: '24K', match: '91%'},
                        {name: 'IndieDiscovery', platform: 'Twitch', subs: '12K', match: '87%'},
                        {name: 'GalacticGamer', platform: 'YouTube', subs: '56K', match: '82%'}
                      ].map((creator, index) => (
                        <div key={index} className="flex items-center p-4 border rounded-lg justify-between">
                          <div>
                            <h3 className="font-medium">{creator.name}</h3>
                            <p className="text-sm text-gray-600">{creator.platform} • {creator.subs} subscribers</p>
                          </div>
                          <div className="bg-atlas-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                            {creator.match} match
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-atlas-purple ml-auto">View All Creators</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">This is a demo preview. Sign up for full access to all features.</p>
            <a href="/signup">
              <Button className="bg-atlas-purple">Start Your Free Trial</Button>
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Demo;
