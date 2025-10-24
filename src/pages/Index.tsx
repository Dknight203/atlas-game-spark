
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Marketing Intelligence Value Proposition */}
      <section className="py-20 bg-gradient-to-r from-atlas-purple/5 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-atlas-purple">
              Complete Marketing Intelligence Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From discovery to campaign management, GameAtlas provides everything developers need to build sustainable marketing success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Discovery</h3>
              <p className="text-gray-600">Find the right communities and creators using advanced matching algorithms</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Campaign Management</h3>
              <p className="text-gray-600">Track, manage, and optimize your marketing campaigns from one dashboard</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">ROI Analytics</h3>
              <p className="text-gray-600">Measure real marketing performance with detailed attribution and reporting</p>
            </div>
          </div>
        </div>
      </section>
      
      <Pricing />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
