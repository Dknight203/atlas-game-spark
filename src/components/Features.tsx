
import { CheckCircle } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Signal Profile Builder",
      description: "Create structured signal profiles that identify your game's unique attributes and fan potential.",
      icon: "🔍"
    },
    {
      title: "Cross-Game Match Engine",
      description: "Find similar games with active communities through tag overlap, community data, and smart filtering.",
      icon: "🎮"
    },
    {
      title: "Community Opportunity Map",
      description: "Discover active Reddit threads, Discord servers, and YouTube creators where your future fans already hang out.",
      icon: "🗺️"
    },
    {
      title: "Trailer & Post Generator",
      description: "Create platform-specific posts with customizable tone and built-in tracking.",
      icon: "📝"
    },
    {
      title: "Creator Match Engine",
      description: "Connect with relevant content creators who are actively covering similar games.",
      icon: "🎥"
    },
    {
      title: "Visibility Tracker",
      description: "Monitor your game's performance across platforms with detailed analytics and reporting.",
      icon: "📊"
    }
  ];

  return (
    <section className="py-20 bg-atlas-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How GameAtlas Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform uses Cross-Game Signal Matchmaking to help you find the right audience for your game.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-lg shadow border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-center">AI with Guardrails</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <p>All recommendations include source links and data-backed reasoning</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <p>Only active communities with recent engagement are suggested</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <p>Full control to regenerate, edit, or reject any suggestion</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <p>Transparency in every match with confidence labels</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
