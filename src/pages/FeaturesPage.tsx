
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";
import { Star, Zap, TrendingUp, Users, Target } from "lucide-react";

const FeaturesPage = () => {
  const featureCategories = [
    {
      title: "Discovery & Intelligence",
      icon: <Target className="w-6 h-6 text-atlas-purple" />,
      features: [
        "AI-powered community discovery",
        "Creator matching algorithms", 
        "Competitor intelligence tracking",
        "Market opportunity analysis",
        "Cross-game signal matching"
      ]
    },
    {
      title: "Campaign Management",
      icon: <Zap className="w-6 h-6 text-atlas-purple" />,
      features: [
        "Marketing campaign planner",
        "Multi-platform posting tools",
        "Content template library",
        "Automated follow-up sequences",
        "Campaign performance tracking"
      ]
    },
    {
      title: "Relationship Tools",
      icon: <Users className="w-6 h-6 text-atlas-purple" />,
      features: [
        "Creator relationship CRM",
        "Outreach email templates",
        "Response tracking system",
        "Collaboration opportunity matching",
        "Team collaboration features"
      ]
    },
    {
      title: "Analytics & ROI",
      icon: <TrendingUp className="w-6 h-6 text-atlas-purple" />,
      features: [
        "Real-time campaign analytics",
        "ROI measurement tools",
        "Conversion attribution tracking",
        "Weekly performance reports",
        "Custom dashboard creation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-atlas-purple/10 text-atlas-purple px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4" />
              <span className="font-medium">Complete Platform Features</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-atlas-purple">
              Everything You Need for Game Marketing Success
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover all the powerful tools GameAtlas provides to help your game find its perfect audience 
              through data-driven intelligence, campaign management, and relationship building.
            </p>
          </div>

          {/* Feature Categories */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {featureCategories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-atlas-purple/10 rounded-lg">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-atlas-dark">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-atlas-teal rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-atlas-purple/5 to-purple-50 rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-atlas-purple">Why Choose GameAtlas?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Unlike generic marketing tools, GameAtlas is built specifically for the unique challenges of indie game marketing.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-2xl mb-3">🎯</div>
                <h4 className="font-bold mb-2">Game-Specific Intelligence</h4>
                <p className="text-sm text-gray-600">Our algorithms understand game mechanics, genres, and player psychology</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-2xl mb-3">⚡</div>
                <h4 className="font-bold mb-2">Built for Indie Scale</h4>
                <p className="text-sm text-gray-600">Designed for small teams with limited time and budget constraints</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-2xl mb-3">📈</div>
                <h4 className="font-bold mb-2">Proven Results</h4>
                <p className="text-sm text-gray-600">300% average increase in marketing reach with 40% lower acquisition costs</p>
              </div>
            </div>
          </div>
        </div>
        
        <Features />
        <Testimonial />
      </div>
      
      <Footer />
    </div>
  );
};

export default FeaturesPage;
