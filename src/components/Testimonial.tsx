
import { Check } from "lucide-react";

const features = [
  {
    title: "Signal Profile Builder",
    description: "Create a structured profile of your game's mechanics, themes, and tone to match with similar communities."
  },
  {
    title: "Cross-Game Match Engine",
    description: "Discover games with overlapping audiences based on actual community data and tag similarities."
  },
  {
    title: "Community Opportunity Map",
    description: "Find active Reddit threads, Discord servers, and other communities where your target audience is engaging."
  },
  {
    title: "Creator Match Engine",
    description: "Connect with content creators who have recently covered similar games and have active engagement."
  }
];

const Testimonial = () => {
  return (
    <section className="py-20 bg-atlas-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How GameAtlas Works</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our platform uses data-driven approaches to help you find and connect with your ideal audience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-atlas-purple bg-opacity-10 border border-atlas-purple border-opacity-20 rounded-2xl p-8 text-center transition-all hover:bg-opacity-20"
            >
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-atlas-teal bg-opacity-20 flex items-center justify-center">
                <Check className="w-6 h-6 text-atlas-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
