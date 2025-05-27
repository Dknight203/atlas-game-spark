
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Key } from "lucide-react";

const YouTubeApiKeySetup = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          YouTube API Setup Required
        </CardTitle>
        <CardDescription>
          To search for real YouTube creators, you need to configure a YouTube Data API v3 key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Follow these steps to get your API key:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Go to the Google Cloud Console</li>
          <li>Create a new project or select an existing one</li>
          <li>Enable the YouTube Data API v3</li>
          <li>Create credentials (API key)</li>
          <li>Copy the API key and enter it below</li>
        </ol>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://console.cloud.google.com/apis/library/youtube.googleapis.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            YouTube Data API
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Create API Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeApiKeySetup;
