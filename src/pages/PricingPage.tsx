
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import { CheckCircle, Users, TrendingUp, Target } from "lucide-react";

const PricingPage = () => {
  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-atlas-purple" />,
      title: "Precision Targeting",
      description: "Find communities and creators that actually convert, not just vanity metrics"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-atlas-purple" />,
      title: "Proven ROI",
      description: "Track real marketing performance with detailed analytics and campaign attribution"
    },
    {
      icon: <Users className="w-6 h-6 text-atlas-purple" />,
      title: "Relationship Building",
      description: "Build lasting relationships with communities and creators using our CRM tools"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-atlas-purple">
              Marketing Intelligence That Actually Works
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Stop wasting time on random marketing tactics. GameAtlas uses AI-powered data analysis to connect your indie game with the right communities and creators for maximum impact.
            </p>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            {/* Social Proof */}
            <div className="bg-atlas-purple/5 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="font-semibold">4.8/5</span>
              </div>
              <p className="text-gray-700 italic">
                "GameAtlas helped us reach 10x more relevant players in our first month than we managed in 6 months of manual outreach."
              </p>
              <p className="text-sm text-gray-600 mt-2">— Indie Developer using Professional Plan</p>
            </div>
          </div>
          
          <Pricing />
          
          {/* Bottom CTA */}
          <div className="text-center mt-20 bg-gradient-to-r from-atlas-purple to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Game Marketing?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join hundreds of indie developers who've already discovered their perfect audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
