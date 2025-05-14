
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-atlas-purple">About GameAtlas</h1>
            
            <div className="prose lg:prose-xl">
              <p className="text-lg text-gray-700 mb-6">
                GameAtlas is a SaaS platform designed to help indie developers and game publishers unlock 
                organic discoverability for their games across the web—without relying on social spam, 
                ad spend, or influencer begging.
              </p>
              
              <h2 className="text-3xl font-bold mt-12 mb-6 text-atlas-dark">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                We believe great games deserve to find their audience. Our mission is to create tools that 
                help indie developers cut through the noise and connect directly with communities that will 
                love their work.
              </p>
              
              <h2 className="text-3xl font-bold mt-12 mb-6 text-atlas-dark">How We're Different</h2>
              <p className="text-lg text-gray-700 mb-6">
                GameAtlas is not another content tool or social media scheduler. We're building launch 
                infrastructure that uses data-driven match-making to help you find real communities where 
                your potential players already exist.
              </p>
              
              <div className="bg-atlas-teal bg-opacity-10 border border-atlas-teal p-8 rounded-lg my-12">
                <h3 className="text-2xl font-bold mb-4 text-atlas-teal">Our Technology</h3>
                <p className="text-lg mb-4">
                  Our Cross-Game Signal Matchmaking technology:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Analyzes your game's mechanics, themes, tone, and metadata</li>
                  <li>Identifies fan overlap with similar games</li>
                  <li>Finds and surfaces live communities, creators, and platforms where those fans are already active</li>
                  <li>Provides contextual recommendations and smart launch copy</li>
                  <li>Tracks and reports visibility metrics across 30 days</li>
                </ul>
              </div>
              
              <div className="mt-12 flex justify-center">
                <a 
                  href="/signup" 
                  className="inline-flex items-center space-x-2 bg-atlas-purple text-white px-8 py-4 rounded-md font-medium hover:bg-opacity-90 transition-colors"
                >
                  <span>Join Our Beta Program</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
