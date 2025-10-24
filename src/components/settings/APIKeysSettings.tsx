import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';

export function APIKeysSettings() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const apiKeys = [
    {
      key: 'IGDB_CLIENT_ID',
      label: 'IGDB Client ID',
      description: 'Twitch client ID for game metadata',
      docsUrl: 'https://api-docs.igdb.com/#getting-started'
    },
    {
      key: 'IGDB_CLIENT_SECRET',
      label: 'IGDB Client Secret',
      description: 'Twitch client secret for game metadata',
      docsUrl: 'https://api-docs.igdb.com/#getting-started'
    },
    {
      key: 'RAWG_API_KEY',
      label: 'RAWG API Key',
      description: 'Alternative game metadata source',
      docsUrl: 'https://rawg.io/apidocs'
    },
    {
      key: 'YOUTUBE_API_KEY',
      label: 'YouTube API Key',
      description: 'For creator discovery and channel stats',
      docsUrl: 'https://developers.google.com/youtube/v3/getting-started'
    }
  ];

  const toggleShow = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast({
      title: 'Configuration saved',
      description: 'API keys are stored in environment variables'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Configure external API keys for enhanced features. Keys are optional but unlock additional data sources.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeys.map(({ key, label, description, docsUrl }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={key}>{label}</Label>
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id={key}
                  type={showKeys[key] ? 'text' : 'password'}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  defaultValue={import.meta.env[`VITE_${key}`] || ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleShow(key)}
                >
                  {showKeys[key] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>

        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium mb-2">Note</p>
          <p className="text-muted-foreground">
            API keys must be configured in your environment variables (.env file) and require a deployment to take effect.
            See docs/DEPLOY.md for instructions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
