
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import WelcomeStep from "./WelcomeStep";
import ProjectSetupStep from "./ProjectSetupStep";
import FeaturesOverviewStep from "./FeaturesOverviewStep";
import CompletionStep from "./CompletionStep";

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard = ({ onComplete, onSkip }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    name: "",
    genre: "",
    platform: ""
  });
  const [isVerifyingOrg, setIsVerifyingOrg] = useState(true);
  const [hasOrganization, setHasOrganization] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verify organization exists on mount
  useEffect(() => {
    verifyOrganization();
  }, [user]);

  const verifyOrganization = async () => {
    if (!user) {
      setIsVerifyingOrg(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!data) {
        // No organization, create one
        const { data: newOrg } = await supabase.rpc('ensure_user_has_organization', {
          _user_id: user.id
        });
        
        if (newOrg) {
          setHasOrganization(true);
          toast({
            title: "Workspace Ready",
            description: "Your organization has been set up successfully"
          });
        }
      } else {
        setHasOrganization(true);
      }
    } catch (error) {
      console.error('Error verifying organization:', error);
      toast({
        title: "Setup Warning",
        description: "There was an issue setting up your workspace. Please contact support if this persists.",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingOrg(false);
    }
  };

  const steps = [
    { title: "Welcome", component: WelcomeStep },
    { title: "Project Setup", component: ProjectSetupStep },
    { title: "Features Overview", component: FeaturesOverviewStep },
    { title: "Complete", component: CompletionStep }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProjectDataChange = (data: Partial<typeof projectData>) => {
    setProjectData({ ...projectData, ...data });
  };

  const handleCreateProject = () => {
    navigate("/project/new", { state: { prefillData: projectData } });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return (
          <ProjectSetupStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            projectData={projectData}
            onProjectDataChange={handleProjectDataChange}
          />
        );
      case 2:
        return (
          <FeaturesOverviewStep
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <CompletionStep
            onCreateProject={handleCreateProject}
            onPrevious={handlePrevious}
            projectData={projectData}
          />
        );
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  if (isVerifyingOrg) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Setting up your workspace...</h3>
            <p className="text-sm text-muted-foreground text-center">
              This will only take a moment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-atlas-purple to-purple-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Welcome to GameAtlas</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkip}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm opacity-90">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{steps[currentStep].title}</span>
              </div>
              <Progress value={progress} className="bg-white/20" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {renderCurrentStep()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
