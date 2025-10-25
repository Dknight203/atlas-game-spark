
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Target, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SignalProfileBuilder from "@/components/app/SignalProfileBuilder";
import DiscoveryDashboard from "@/components/discovery/DiscoveryDashboard";
import MarketAnalysisDashboard from "./MarketAnalysisDashboard";

interface GameIntelligenceProps {
  projectId: string;
}

const GameIntelligence = ({ projectId }: GameIntelligenceProps) => {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState("profile");
  const [profileComplete, setProfileComplete] = useState(false);
  const [discoveryComplete, setDiscoveryComplete] = useState(false);
  const [showProfileHint, setShowProfileHint] = useState(false);

  // Load workflow progress from database
  useEffect(() => {
    loadWorkflowProgress();
  }, [projectId]);

  const loadWorkflowProgress = async () => {
    const { data: project } = await supabase
      .from('projects')
      .select('workflow_progress')
      .eq('id', projectId)
      .single();

    if (project?.workflow_progress) {
      const progress = project.workflow_progress as any;
      setProfileComplete(progress.profileComplete || false);
      setDiscoveryComplete(progress.discoveryComplete || false);
    }
  };

  // Check if we should show the profile completion hint
  useEffect(() => {
    if (location.state?.showProfileHint) {
      setShowProfileHint(true);
    }
  }, [location.state]);

  const steps = [
    {
      id: "profile",
      title: "Signal Profile",
      description: "Define your game's characteristics",
      icon: Target,
      status: profileComplete ? "complete" : "active",
    },
    {
      id: "discovery",
      title: "Game Discovery", 
      description: "Find similar games and opportunities",
      icon: Search,
      status: profileComplete ? "active" : "pending",
    },
    {
      id: "analysis",
      title: "Market Analysis",
      description: "Analyze trends and competition",
      icon: TrendingUp,
      status: discoveryComplete ? "active" : "pending",
    }
  ];

  const getStepNumber = (stepId: string) => {
    return steps.findIndex(step => step.id === stepId) + 1;
  };

  const handleStepClick = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && step.status !== "pending") {
      setActiveStep(stepId);
    }
  };

  const handleNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (nextStep.status !== "pending") {
        setActiveStep(nextStep.id);
      }
    }
  };

  const handleProfileComplete = async () => {
    setProfileComplete(true);
    setShowProfileHint(false);
    
    // Update database
    await supabase
      .from('projects')
      .update({
        workflow_progress: {
          profileComplete: true,
          discoveryComplete,
          analysisViewed: false
        }
      })
      .eq('id', projectId);
  };

  const handleDiscoveryComplete = async () => {
    setDiscoveryComplete(true);
    
    // Update database
    await supabase
      .from('projects')
      .update({
        workflow_progress: {
          profileComplete,
          discoveryComplete: true,
          analysisViewed: false
        }
      })
      .eq('id', projectId);
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Hint */}
      {showProfileHint && (
        <Alert className="border-atlas-purple bg-purple-50">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Complete your signal profile</strong> to unlock personalized game discovery and matching. 
            We've pre-populated what we can from your project details.
          </AlertDescription>
        </Alert>
      )}

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Game Intelligence Workflow
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Follow these steps to build comprehensive game intelligence
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={step.status === "pending"}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    activeStep === step.id
                      ? "border-primary bg-primary/5"
                      : step.status === "complete"
                      ? "border-green-200 bg-green-50 hover:bg-green-100"
                      : step.status === "pending"
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.status === "complete"
                      ? "bg-green-500 text-white"
                      : activeStep === step.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{getStepNumber(step.id)}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Step {getStepNumber(activeStep)} of {steps.length}
            </div>
            <Button onClick={handleNextStep} disabled={!profileComplete}>
              Continue to Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="space-y-6">
        {activeStep === "profile" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Build Your Signal Profile</h2>
              <p className="text-muted-foreground">
                Enhance your project details with themes, mechanics, and targeting criteria for better matching.
              </p>
            </div>
            <SignalProfileBuilder 
              projectId={projectId} 
              onComplete={handleProfileComplete}
            />
          </div>
        )}

        {activeStep === "discovery" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Game Discovery & Analysis</h2>
              <p className="text-muted-foreground">
                Discover similar games, analyze market opportunities, and build targeted lists.
              </p>
            </div>
            <DiscoveryDashboard 
              projectId={projectId}
              onComplete={handleDiscoveryComplete}
            />
          </div>
        )}

        {activeStep === "analysis" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Market Analysis</h2>
              <p className="text-muted-foreground">
                Comprehensive market insights, competitor analysis, and strategic recommendations.
              </p>
            </div>
            <MarketAnalysisDashboard projectId={projectId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameIntelligence;
