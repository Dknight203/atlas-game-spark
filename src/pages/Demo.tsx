
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignalProfile from "@/components/demo/SignalProfile";
import MatchEngine from "@/components/demo/MatchEngine";
import CommunityMap from "@/components/demo/CommunityMap";
import CreatorMatch from "@/components/demo/CreatorMatch";

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
                <SignalProfile />
              </TabsContent>
              
              <TabsContent value="match-engine" className="mt-0">
                <MatchEngine />
              </TabsContent>
              
              <TabsContent value="community-map" className="mt-0">
                <CommunityMap />
              </TabsContent>
              
              <TabsContent value="creator-match" className="mt-0">
                <CreatorMatch />
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
