
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-gradient text-white pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <div className="mb-4">
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                🚀 Complete Marketing Intelligence Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Turn Game Marketing Into <br />
              <span className="text-atlas-teal">Predictable Growth</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg opacity-90">
              Stop guessing at marketing. GameAtlas uses AI-powered intelligence to connect your indie game with the right communities and creators, then helps you manage campaigns that actually convert.
            </p>
            
            {/* Key Benefits */}
            <div className="mb-8 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-atlas-teal rounded-full"></div>
                <span className="text-white/90">Find high-converting communities & creators</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-atlas-teal rounded-full"></div>
                <span className="text-white/90">Manage campaigns with built-in CRM tools</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-atlas-teal rounded-full"></div>
                <span className="text-white/90">Track ROI with detailed analytics</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-atlas-purple hover:bg-gray-100 w-full sm:w-auto font-semibold">
                  Start 14-Day Free Trial
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="ghost" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-atlas-purple w-full sm:w-auto">
                  Explore Features
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-sm text-white/80">
              ✨ No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-xl p-2 transform rotate-1">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                alt="GameAtlas Marketing Intelligence Dashboard" 
                className="rounded shadow-inner w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
