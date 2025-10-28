import { useState } from "react";
import { Link2, FileEdit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GameDataImporter from "./GameDataImporter";
import ProjectForm from "./ProjectForm";

interface ProjectCreationChoiceProps {
  prefillData?: {
    name?: string;
    genre?: string;
    platform?: string;
  };
}

const ProjectCreationChoice = ({ prefillData = {} }: ProjectCreationChoiceProps) => {
  const [creationMethod, setCreationMethod] = useState<'import' | 'manual' | null>(null);

  if (creationMethod === 'import') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setCreationMethod(null)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          ← Back to selection
        </button>
        <GameDataImporter 
          isCreationMode={true}
          onImportComplete={() => {}}
        />
      </div>
    );
  }

  if (creationMethod === 'manual') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setCreationMethod(null)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          ← Back to selection
        </button>
        <ProjectForm prefillData={prefillData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">How would you like to create your project?</h2>
        <p className="text-muted-foreground">Choose the method that works best for you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Import from Store URL - Recommended */}
        <Card 
          className="cursor-pointer hover:border-primary transition-all hover:shadow-md relative"
          onClick={() => setCreationMethod('import')}
        >
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-atlas-purple">
            Recommended
          </Badge>
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Link2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Import from Store URL</CardTitle>
            <CardDescription className="text-left mt-4">
              Paste a link from Steam, Epic Games, or GOG and we'll automatically extract:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Game name & description</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Genre, platforms, tags</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Themes, mechanics, tone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Target audience & unique features</span>
              </li>
            </ul>
            <p className="text-sm font-medium text-primary mt-4">
              Skip ahead to Match Engine →
            </p>
          </CardContent>
        </Card>

        {/* Manual Creation */}
        <Card 
          className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
          onClick={() => setCreationMethod('manual')}
        >
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileEdit className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>Create Manually</CardTitle>
            <CardDescription className="text-left mt-4">
              Fill out the project details yourself if you prefer:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>Enter project name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>Write description</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>Select genre & platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>Build profile step-by-step</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Standard workflow: Profile → Discovery → Matches
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectCreationChoice;
