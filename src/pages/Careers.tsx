
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our team to build the next generation of game discovery tools using React, TypeScript, and modern web technologies."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Lead product strategy and development for our cross-game matchmaking platform."
    },
    {
      title: "Data Scientist",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Develop algorithms and models to improve our game-community matching engine."
    },
    {
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      description: "Build relationships with indie game developers and manage our community programs."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-atlas-purple">Join Our Team</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Help us revolutionize game discovery and connect indie developers with their perfect audiences.
              </p>
            </div>
            
            <div className="bg-atlas-light rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold mb-4 text-atlas-dark">Why Work at GameAtlas?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-atlas-purple">Remote-First Culture</h3>
                  <p className="text-gray-600">Work from anywhere with flexible hours and a focus on results.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-atlas-purple">Meaningful Impact</h3>
                  <p className="text-gray-600">Help indie developers succeed and find their audience.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-atlas-purple">Growth Opportunities</h3>
                  <p className="text-gray-600">Learn new technologies and advance your career with us.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-atlas-purple">Competitive Benefits</h3>
                  <p className="text-gray-600">Health insurance, equity, and professional development budget.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-8 text-atlas-dark">Open Positions</h2>
              <div className="space-y-6">
                {openPositions.map((position, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-atlas-purple mb-2">{position.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>{position.department}</span>
                          <span>•</span>
                          <span>{position.location}</span>
                          <span>•</span>
                          <span>{position.type}</span>
                        </div>
                      </div>
                      <Button className="bg-atlas-purple mt-4 md:mt-0">
                        Apply Now
                      </Button>
                    </div>
                    <p className="text-gray-600">{position.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Don't see a role that fits? We're always interested in hearing from talented people.
              </p>
              <Button variant="outline" className="border-atlas-purple text-atlas-purple">
                Send Us Your Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;
