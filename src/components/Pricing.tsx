
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingTier = ({ 
  name, 
  price, 
  description, 
  features, 
  bestFor, 
  gamesSupported, 
  keyValue,
  popular = false,
  buttonText = "Get Started"
}) => {
  return (
    <div className={`rounded-lg border ${popular ? 'border-atlas-purple ring-2 ring-atlas-purple' : 'border-gray-200'} bg-white shadow-lg overflow-hidden`}>
      {popular && (
        <div className="bg-atlas-purple text-white py-1.5 px-4 text-sm font-medium text-center">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold">{name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold">${price}</span>
          {price > 0 && !price.toString().includes('/') && (
            <span className="ml-1 text-gray-500">/one-time</span>
          )}
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
        
        <div className="mt-6">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500">Best For:</span>
            <span className="ml-2 text-sm">{bestFor}</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-sm font-medium text-gray-500">Games:</span>
            <span className="ml-2 text-sm">{gamesSupported}</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-sm font-medium text-gray-500">Key Value:</span>
            <span className="ml-2 text-sm">{keyValue}</span>
          </div>
        </div>
        
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
          <Link to="/signup" className="w-full block">
            <Button className={`w-full ${popular ? 'bg-atlas-purple hover:bg-opacity-90' : 'bg-gray-800 hover:bg-gray-700'}`}>
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      price: "0",
      description: "Try the platform with limited features",
      bestFor: "First-time users",
      gamesSupported: "1",
      keyValue: "Try the engine risk-free",
      popular: false,
      features: [
        "Signal Profile Builder",
        "1 Cross-Game Match",
        "1 Community Opportunity", 
        "1 AI Copy Variation",
      ],
      buttonText: "Get Started Free"
    },
    {
      name: "Launch Pack",
      price: "79",
      description: "Everything you need to launch a single game",
      bestFor: "Solo devs launching soon",
      gamesSupported: "1",
      keyValue: "Full visibility report + placements",
      popular: true,
      features: [
        "Signal Profile Builder",
        "5-10 Cross-Game Matches",
        "3+ Community Placements", 
        "3+ AI Copy Variations per Post",
        "Trailer Formatter",
        "3-5 Creator Matches",
        "30-day Visibility Tracker",
        "Weekly Email Reports"
      ]
    },
    {
      name: "Studio Toolkit",
      price: "25/mo",
      description: "Or $149 one-time payment",
      bestFor: "Indie teams with multiple titles",
      gamesSupported: "3",
      keyValue: "Multi-game tracking + creator CRM",
      popular: false,
      features: [
        "All Launch Pack Features",
        "Support for 3 Games",
        "Full Access to Match Engine",
        "Weekly Community Scans",
        "Team Copy Presets",
        "10+ Creator Matches with Filters",
        "Creator CRM",
        "PDF Export",
        "Email Support"
      ]
    },
    {
      name: "Publisher Tier",
      price: "499/mo",
      description: "Enterprise-level features for larger teams",
      bestFor: "Publishers & agencies",
      gamesSupported: "20+",
      keyValue: "Visibility ops across portfolio",
      popular: false,
      features: [
        "All Studio Toolkit Features",
        "Support for 20-100 Games",
        "Portfolio Dashboard",
        "Real-time Creator Triggers",
        "Branded & Exportable Reports",
        "Dedicated CSM",
        "10 Managed Creator Outreach/Quarter"
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs, from solo developers to large publishers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
