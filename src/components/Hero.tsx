
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-gradient text-white pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Unlock Organic <br />
              Game Discovery
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg">
              Help indie developers and game publishers find their audience without social spam, ad spend, or influencer begging.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-atlas-purple hover:bg-gray-100 w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="ghost" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-atlas-purple w-full sm:w-auto">
                  See Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-xl p-2 transform rotate-1">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                alt="GameAtlas Dashboard Preview" 
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
