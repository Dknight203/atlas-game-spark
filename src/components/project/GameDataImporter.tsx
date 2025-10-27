import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, CheckCircle2, Edit2, X } from "lucide-react";

interface ExtractedGameData {
  name: string;
  description: string;
  genre: string;
  platforms: string[];
  genres: string[];
  tags: string[];
  themes: string[];
  mechanics: string[];
  tone: string;
  targetAudience: string;
  uniqueFeatures: string;
}

interface GameDataImporterProps {
  projectId: string;
  onImportComplete: () => void;
}

const GameDataImporter = ({ projectId, onImportComplete }: GameDataImporterProps) => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedGameData | null>(null);
  const [editedData, setEditedData] = useState<ExtractedGameData | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a game store URL",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-game-data', {
        body: { url: url.trim() }
      });

      if (error) throw error;

      if (data.success) {
        setExtractedData(data.data);
        setEditedData(data.data);
        toast({
          title: "Data Extracted!",
          description: "Review and edit the information below before applying.",
        });
      } else {
        throw new Error(data.error || 'Failed to extract data');
      }
    } catch (error) {
      console.error('Extract error:', error);
      toast({
        title: "Extraction Failed",
        description: error.message || "Failed to extract game data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApply = async () => {
    if (!editedData) return;

    setIsApplying(true);
    try {
      // Update project basic info
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: editedData.name,
          description: editedData.description,
          genre: editedData.genre,
          platforms: editedData.platforms,
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Check if signal profile exists
      const { data: existingProfile } = await supabase
        .from('signal_profiles')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle();

      const signalData = {
        themes: editedData.themes,
        mechanics: editedData.mechanics,
        tone: editedData.tone,
        target_audience: editedData.targetAudience,
        unique_features: editedData.uniqueFeatures,
      };

      if (existingProfile) {
        // Update existing profile
        const { error: profileError } = await supabase
          .from('signal_profiles')
          .update(signalData)
          .eq('project_id', projectId);

        if (profileError) throw profileError;
      } else {
        // Create new profile
        const { error: profileError } = await supabase
          .from('signal_profiles')
          .insert({
            project_id: projectId,
            ...signalData,
          });

        if (profileError) throw profileError;
      }

      toast({
        title: "Success!",
        description: "Game data imported successfully.",
      });

      onImportComplete();
    } catch (error) {
      console.error('Apply error:', error);
      toast({
        title: "Failed to Apply",
        description: error.message || "Failed to save imported data.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancel = () => {
    setExtractedData(null);
    setEditedData(null);
    setUrl("");
  };

  if (extractedData && editedData) {
    return (
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Review Extracted Data
              </CardTitle>
              <CardDescription>
                Edit any fields below, then confirm to apply to your project
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Game Name</Label>
            <Input
              value={editedData.name}
              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={editedData.description}
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Genre</Label>
              <Input
                value={editedData.genre}
                onChange={(e) => setEditedData({ ...editedData, genre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tone/Mood</Label>
              <Input
                value={editedData.tone}
                onChange={(e) => setEditedData({ ...editedData, tone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedData.platforms.map((platform, i) => (
                <Badge key={i} variant="secondary">
                  {platform}
                  <button
                    onClick={() => setEditedData({
                      ...editedData,
                      platforms: editedData.platforms.filter((_, idx) => idx !== i)
                    })}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add platform (press Enter)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value) {
                    setEditedData({
                      ...editedData,
                      platforms: [...editedData.platforms, value]
                    });
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Themes</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedData.themes.map((theme, i) => (
                <Badge key={i} variant="outline">
                  {theme}
                  <button
                    onClick={() => setEditedData({
                      ...editedData,
                      themes: editedData.themes.filter((_, idx) => idx !== i)
                    })}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add theme (press Enter)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value) {
                    setEditedData({
                      ...editedData,
                      themes: [...editedData.themes, value]
                    });
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Mechanics</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedData.mechanics.map((mechanic, i) => (
                <Badge key={i} variant="outline">
                  {mechanic}
                  <button
                    onClick={() => setEditedData({
                      ...editedData,
                      mechanics: editedData.mechanics.filter((_, idx) => idx !== i)
                    })}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add mechanic (press Enter)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value) {
                    setEditedData({
                      ...editedData,
                      mechanics: [...editedData.mechanics, value]
                    });
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Textarea
              value={editedData.targetAudience}
              onChange={(e) => setEditedData({ ...editedData, targetAudience: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Unique Features</Label>
            <Textarea
              value={editedData.uniqueFeatures}
              onChange={(e) => setEditedData({ ...editedData, uniqueFeatures: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleApply} disabled={isApplying} className="flex-1">
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm & Apply
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isApplying}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Import from Game Store
        </CardTitle>
        <CardDescription>
          Paste a link to your game on Steam, Epic Games Store, GOG, or other store pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store-url">Game Store URL</Label>
          <Input
            id="store-url"
            placeholder="https://store.steampowered.com/app/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isExtracting}
          />
        </div>
        <Button onClick={handleExtract} disabled={isExtracting} className="w-full">
          {isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting Data...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Extract Game Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameDataImporter;
