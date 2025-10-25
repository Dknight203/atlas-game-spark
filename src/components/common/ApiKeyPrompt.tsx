import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeyPromptProps {
  service: string;
  description: string;
  setupUrl: string;
  docsUrl?: string;
}

export function ApiKeyPrompt({ service, description, setupUrl, docsUrl }: ApiKeyPromptProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          {service} API Setup Required
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          To use this feature, configure your {service} API credentials in your Supabase project settings.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(setupUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Setup {service}
          </Button>
          {docsUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(docsUrl, '_blank')}
            >
              View Docs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
