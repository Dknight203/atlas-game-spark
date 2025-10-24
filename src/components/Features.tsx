
import { CheckCircle, Star, TrendingUp, Users, Target, BarChart, MessageSquare, Calendar } from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      title: "AI-Powered Discovery Engine",
      description: "Find communities and creators that actually convert using our advanced matching algorithms and real engagement data.",
      icon: <Target className="w-8 h-8 text-atlas-purple" />
    },
    {
      title: "Marketing Campaign Manager",
      description: "Plan, execute, and track marketing campaigns across multiple platforms with built-in templates and automation.",
      icon: <Calendar className="w-8 h-8 text-atlas-purple" />
    },
    {
      title: "Creator Relationship CRM",
      description: "Manage outreach, track responses, and build lasting relationships with content creators and community managers.",
      icon: <Users className="w-8 h-8 text-atlas-purple" />
    },
    {
      title: "ROI Analytics Dashboard",
      description: "Measure real marketing performance with detailed attribution, conversion tracking, and campaign optimization insights.",
      icon: <BarChart className="w-8 h-8 text-atlas-purple" />
    },
    {
      title: "Community Engagement Tools",
      description: "Smart posting templates, timing recommendations, and engagement tracking for Reddit, Discord, and other platforms.",
      icon: <MessageSquare className="w-8 h-8 text-atlas-purple" />
    },
    {
      title: "Competitor Intelligence",
      description: "Track what's working for similar games and identify untapped marketing opportunities in your genre.",
      icon: <TrendingUp className="w-8 h-8 text-atlas-purple" />
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Build Your Game Profile",
      description: "Our AI analyzes your game's genre, themes, and mechanics to create a comprehensive marketing profile."
    },
    {
      step: "02", 
      title: "Discover Opportunities",
      description: "Get matched with relevant communities, creators, and platforms where your target audience is already active."
    },
    {
      step: "03",
      title: "Launch Campaigns",
      description: "Use our templates and tools to create and manage marketing campaigns across multiple channels."
    },
    {
      step: "04",
      title: "Track & Optimize",
      description: "Monitor performance, measure ROI, and optimize your marketing strategy based on real data."
    }
  ];

  return (
    <section className="py-20 bg-atlas-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-atlas-purple/10 text-atlas-purple px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4" />
            <span className="font-medium">Complete Marketing Solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Grow Your Game</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From AI-powered discovery to campaign management and ROI tracking, GameAtlas provides the complete toolkit for game marketing success.
          </p>
        </div>
        
        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {coreFeatures.map((feature, index) => (
            <div key={index} className="feature-card group hover:shadow-xl transition-all duration-300">
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-atlas-dark">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-atlas-purple">How GameAtlas Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-atlas-purple text-white rounded-full font-bold mb-4">
                  {step.step}
                </div>
                <h4 className="font-bold mb-2 text-atlas-dark">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* AI with Guardrails Section */}
        <div className="mt-16 bg-gradient-to-r from-atlas-teal/10 to-blue-50 p-8 rounded-2xl border border-atlas-teal/20">
          <h3 className="text-2xl font-bold mb-6 text-center text-atlas-teal">AI-Powered with Human Control</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Data-Backed Recommendations</h4>
                <p className="text-sm text-gray-600">Every suggestion includes source data and confidence scores</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Real-Time Validation</h4>
                <p className="text-sm text-gray-600">Only active communities with recent engagement are suggested</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Full Creative Control</h4>
                <p className="text-sm text-gray-600">Edit, regenerate, or reject any AI suggestion</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Transparent Results</h4>
                <p className="text-sm text-gray-600">Clear explanations for every recommendation and match</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
