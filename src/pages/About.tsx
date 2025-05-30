
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Users, TrendingUp, Target, CheckCircle } from "lucide-react";

const About = () => {
  const stats = [
    { number: "300%", label: "Average increase in marketing reach" },
    { number: "40%", label: "Reduction in customer acquisition costs" },
    { number: "10,000+", label: "Communities and creators in our database" },
    { number: "500+", label: "Indie developers using GameAtlas" }
  ];

  const teamValues = [
    {
      icon: <Target className="w-6 h-6 text-atlas-purple" />,
      title: "Data-Driven Decisions",
      description: "We believe in marketing based on real data, not guesswork or vanity metrics."
    },
    {
      icon: <Users className="w-6 h-6 text-atlas-purple" />,
      title: "Developer-First Design",
      description: "Built by developers, for developers. We understand the unique challenges of indie game marketing."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-atlas-purple" />,
      title: "Sustainable Growth",
      description: "We focus on building long-term marketing strategies, not short-term hacks."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-atlas-purple">
              The Marketing Intelligence Platform Built for Indie Games
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              We're on a mission to help indie developers build sustainable marketing success through 
              AI-powered intelligence, campaign management, and relationship building tools.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-atlas-light rounded-xl">
                <div className="text-3xl md:text-4xl font-bold text-atlas-purple mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Our Story */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-atlas-dark">Our Story</h2>
              <div className="prose lg:prose-xl">
                <p className="text-lg text-gray-700 mb-6">
                  GameAtlas was born from frustration. As indie developers ourselves, we spent countless hours 
                  manually searching for communities, reaching out to creators, and trying to measure the impact 
                  of our marketing efforts. Most tools were built for big studios with massive budgets, not for 
                  indie developers who needed efficient, data-driven solutions.
                </p>
                
                <p className="text-lg text-gray-700 mb-6">
                  We realized that great games were getting lost in the noise, not because they weren't good enough, 
                  but because their creators didn't have access to the right marketing intelligence and tools. 
                  That's when we decided to build the platform we wished we had.
                </p>
              </div>
            </div>
            
            {/* Our Mission */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-atlas-dark">Our Mission</h2>
              <div className="bg-gradient-to-r from-atlas-purple/5 to-purple-50 p-8 rounded-xl mb-8">
                <p className="text-lg text-gray-700 mb-4">
                  <strong className="text-atlas-purple">We believe every great indie game deserves to find its audience.</strong>
                </p>
                <p className="text-lg text-gray-700">
                  Our mission is to democratize game marketing by providing indie developers with the same level 
                  of marketing intelligence and tools that big studios use, but designed specifically for the 
                  unique challenges and constraints of independent game development.
                </p>
              </div>
            </div>
            
            {/* What Makes Us Different */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-atlas-dark">What Makes GameAtlas Different</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {teamValues.map((value, index) => (
                  <div key={index} className="text-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="mb-4 flex justify-center">{value.icon}</div>
                    <h3 className="font-bold mb-2 text-atlas-dark">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Technology */}
            <div className="bg-atlas-teal bg-opacity-10 border border-atlas-teal p-8 rounded-xl mb-12">
              <h3 className="text-2xl font-bold mb-4 text-atlas-teal">Our Technology: Cross-Game Signal Matchmaking</h3>
              <p className="text-lg mb-4 text-gray-700">
                At the heart of GameAtlas is our proprietary Cross-Game Signal Matchmaking technology, which:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-atlas-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Analyzes your game's mechanics, themes, tone, and metadata</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-atlas-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Identifies fan overlap with similar games across platforms</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-atlas-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Finds active communities and creators where fans gather</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-atlas-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Provides smart campaign tools and ROI tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-atlas-purple to-purple-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Game Marketing?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join hundreds of indie developers who've discovered their perfect audience with GameAtlas
              </p>
              <a 
                href="/signup" 
                className="inline-flex items-center space-x-2 bg-white text-atlas-purple px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                <span>Start Your Free Trial</span>
                <ArrowRight size={18} />
              </a>
              <div className="mt-4 text-sm opacity-80">
                14-day free trial • No credit card required • Cancel anytime
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
