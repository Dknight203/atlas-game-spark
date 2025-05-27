
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProjectNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
            <p className="text-gray-600">The requested project could not be found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNotFound;
