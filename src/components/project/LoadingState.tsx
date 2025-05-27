
import Navbar from "@/components/Navbar";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-purple"></div>
            <p className="ml-4 text-gray-600">Loading project...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
