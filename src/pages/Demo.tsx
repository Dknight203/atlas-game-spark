
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Demo = () => {
  const [activeTab, setActiveTab] = useState("signal-profile");

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
                    <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Game Title</label>
                          <input type="text" placeholder="Starlight Wanderer" className="w-full p-2 border rounded-md" disabled />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Short Pitch</label>
                          <textarea placeholder="A narrative roguelike about exploring a procedurally generated galaxy..." className="w-full p-2 border rounded-md" rows={2} disabled></textarea>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                            <div className="flex flex-wrap gap-2">
                              {['Steam', 'itch.io', 'Xbox', 'Switch', 'PlayStation'].map(platform => (
                                <span key={platform} className="bg-atlas-purple bg-opacity-10 text-atlas-purple px-3 py-1 rounded-full text-sm">
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Genre Tags</label>
                            <div className="flex flex-wrap gap-2">
                              {['Roguelike', 'Adventure', 'Narrative', 'Sci-Fi', 'Exploration'].map(tag => (
                                <span key={tag} className="bg-atlas-teal bg-opacity-10 text-atlas-teal px-3 py-1 rounded-full text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-atlas-purple ml-auto" disabled>Save Profile</Button>
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
                    <div className="space-y-4">
                      {['Outer Wilds', 'No Man\'s Sky', 'FTL: Faster Than Light'].map((game, index) => (
                        <div key={index} className="flex items-start p-4 border rounded-lg gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1">
                            <h3 className="font-medium">{game}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {index === 0 ? '85% audience overlap' : index === 1 ? '76% audience overlap' : '72% audience overlap'}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {['Exploration', 'Sci-Fi', 'Adventure'].map((tag, i) => (
                                <span key={i} className="bg-atlas-teal bg-opacity-10 text-atlas-teal px-2 py-0.5 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-atlas-purple ml-auto" disabled>View Full Report</Button>
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
                          <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                            <span>View</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-atlas-purple ml-auto" disabled>View All Communities</Button>
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
                    <Button className="bg-atlas-purple ml-auto" disabled>View All Creators</Button>
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
