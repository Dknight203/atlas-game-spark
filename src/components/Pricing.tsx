
import { CheckCircle, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const PricingTier = ({ 
  name, 
  price, 
  period,
  description, 
  features, 
  bestFor, 
  projectLimit,
  teamMembers,
  keyValue,
  popular = false,
  enterprise = false,
  buttonText = "Start Free Trial",
  icon
}) => {
  return (
    <div className={`rounded-xl border ${popular ? 'border-atlas-purple ring-2 ring-atlas-purple shadow-lg scale-105' : enterprise ? 'border-gray-300 bg-gradient-to-b from-gray-50 to-white' : 'border-gray-200'} bg-white shadow-md overflow-hidden relative`}>
      {popular && (
        <div className="bg-gradient-to-r from-atlas-purple to-purple-600 text-white py-2 px-4 text-sm font-medium text-center relative">
          <Star className="inline w-4 h-4 mr-1" />
          Most Popular Choice
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-sm text-gray-600">{bestFor}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-gray-900">${price}</span>
            {period && <span className="text-gray-500">/{period}</span>}
          </div>
          {price > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {period === 'mo' ? 'Billed monthly • Cancel anytime' : 'Custom pricing'}
            </p>
          )}
        </div>
        
        <p className="text-gray-700 mb-6">{description}</p>
        
        {/* Key Metrics */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Projects:</span>
            <span className="font-semibold">{projectLimit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Team Members:</span>
            <span className="font-semibold">{teamMembers}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Key Value:</span>
            <span className="font-semibold text-atlas-purple">{keyValue}</span>
          </div>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link to="/signup" className="block">
          <Button className={`w-full ${
            popular 
              ? 'bg-atlas-purple hover:bg-atlas-purple/90 shadow-lg' 
              : enterprise
              ? 'bg-gray-800 hover:bg-gray-900'
              : 'bg-gray-700 hover:bg-gray-800'
          }`}>
            {enterprise ? <Crown className="w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            {buttonText}
          </Button>
        </Link>
        
        {price > 0 && !enterprise && (
          <p className="text-center text-xs text-gray-500 mt-3">
            14-day free trial • No credit card required
          </p>
        )}
      </div>
    </div>
  );
};

const Pricing = () => {
  const tiers = [
    {
      name: "Starter",
      price: "29",
      period: "mo",
      description: "Perfect for solo developers launching their first game",
      bestFor: "Solo Developers",
      projectLimit: "1 Game",
      teamMembers: "1 User",
      keyValue: "Essential Discovery",
      icon: "🚀",
      popular: false,
      features: [
        "Game Signal Profile Builder",
        "5 Cross Game Matches per month",
        "10 Community Opportunities",
        "15 Creator Matches",
        "Basic AI Copy Variations (3 per post)",
        "Community Guidelines and Best Practices",
        "Email Support",
        "Marketing Activity Tracker"
      ]
    },
    {
      name: "Professional",
      price: "99",
      period: "mo",
      description: "Complete marketing intelligence for indie teams",
      bestFor: "Indie Teams and Studios",
      projectLimit: "3 Games",
      teamMembers: "5 Users",
      keyValue: "Full Marketing Suite",
      icon: "⭐",
      popular: true,
      features: [
        "Everything in Starter",
        "Unlimited Cross Game Matches",
        "50 plus Community Opportunities per game",
        "100 plus Creator Matches with filters",
        "Advanced AI Copy Variations (10 per post)",
        "Marketing Campaign Manager",
        "Creator CRM and Outreach Templates",
        "Performance Analytics and ROI Tracking",
        "Weekly Marketing Reports",
        "Priority Support"
      ]
    },
    {
      name: "Studio",
      price: "299",
      period: "mo",
      description: "Advanced tools for growing game studios",
      bestFor: "Game Studios",
      projectLimit: "10 Games",
      teamMembers: "15 Users",
      keyValue: "Multi Game Portfolio",
      icon: "🏢",
      popular: false,
      features: [
        "Everything in Professional",
        "Portfolio wide Marketing Dashboard",
        "Advanced Team Collaboration Tools",
        "Custom Marketing Workflows",
        "Automated Campaign Triggers",
        "Competitor Intelligence Tracking",
        "White label Report Exports",
        "API Access for Custom Integrations",
        "Dedicated Customer Success Manager",
        "Phone Support"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: null,
      description: "Tailored solutions for publishers and large studios",
      bestFor: "Publishers and Agencies",
      projectLimit: "Unlimited",
      teamMembers: "Unlimited",
      keyValue: "Custom Solutions",
      icon: "👑",
      popular: false,
      enterprise: true,
      features: [
        "Everything in Studio",
        "Unlimited games and team members",
        "Custom feature development",
        "Advanced security and compliance",
        "On premise deployment options",
        "Custom integrations and API limits",
        "Twenty four seven priority support",
        "Dedicated infrastructure",
        "Custom training and onboarding",
        "SLA guarantees"
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            💰 Pricing Plans
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Marketing Intelligence Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From solo developers to enterprise publishers, we have the right plan to accelerate your game's marketing success.
          </p>
        </div>
        
        {/* Value Proposition Banner */}
        <div className="bg-gradient-to-r from-atlas-purple/10 to-purple-100 rounded-xl p-6 mb-12 text-center">
          <h3 className="text-xl font-semibold mb-2">🎯 Why GameAtlas Works</h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our AI-powered platform has helped indie developers increase their marketing reach by 300% and reduce customer acquisition costs by 40% through data-driven community and creator matching.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="border-l-4 border-atlas-purple pl-4">
              <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600">Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate your billing.</p>
            </div>
            <div className="border-l-4 border-atlas-purple pl-4">
              <h4 className="font-semibold mb-2">What happens to my data if I cancel?</h4>
              <p className="text-gray-600">Your data remains accessible for 30 days after cancellation. You can export all your marketing data and campaign history.</p>
            </div>
            <div className="border-l-4 border-atlas-purple pl-4">
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">We offer a 14-day free trial, so you can test everything risk-free. We also provide pro-rated refunds within the first 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
