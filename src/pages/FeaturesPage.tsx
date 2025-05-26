
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-atlas-purple">Platform Features</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover all the powerful tools GameAtlas provides to help your game find its perfect audience through data-driven matchmaking.
            </p>
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
