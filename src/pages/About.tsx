
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Users, TrendingUp, Target, CheckCircle } from "lucide-react";

const About = () => {
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
              The Marketing Intelligence Platform Built for Game Developers
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              We're on a mission to help game developers build sustainable marketing success through 
              AI-powered intelligence, campaign management, and relationship building tools.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Our Mission */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-atlas-dark">Our Mission</h2>
              <div className="bg-gradient-to-r from-atlas-purple/5 to-purple-50 p-8 rounded-xl mb-8">
                <p className="text-lg text-gray-700 mb-4">
                  <strong className="text-atlas-purple">We believe every great game deserves to find its audience.</strong>
                </p>
                <p className="text-lg text-gray-700">
                  Our mission is to democratize game marketing by providing developers with the same level 
                  of marketing intelligence and tools that big studios use, but designed specifically for the 
                  unique challenges and constraints of game development teams of all sizes.
                </p>
              </div>
            </div>

            {/* The Problem We're Solving */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-atlas-dark">The Problem We're Solving</h2>
              <div className="prose lg:prose-xl">
                <p className="text-lg text-gray-700 mb-6">
                  Game developers face a unique challenge: creating amazing games is only half the battle. 
                  The other half is getting those games discovered by the right players. Traditional marketing 
                  approaches are often too expensive, time-consuming, or designed for larger studios with dedicated marketing teams.
                </p>
                
                <p className="text-lg text-gray-700 mb-6">
                  Many developers spend countless hours manually searching for communities, reaching out to creators, 
                  and trying to measure the impact of their marketing efforts. Most existing tools weren't built with 
                  developers in mind - they're either too complex, too expensive, or missing the game-specific 
                  intelligence needed to succeed.
                </p>

                <p className="text-lg text-gray-700 mb-6">
                  That's why we built GameAtlas: to bridge the gap between great games and the players who will love them.
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
                Join developers who are discovering their perfect audience with GameAtlas
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
