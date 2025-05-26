
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-atlas-purple">Pricing Plans</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your game development needs. All plans include our core features with different usage limits.
            </p>
          </div>
          
          <Pricing />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
