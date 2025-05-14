
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Creator = {
  name: string;
  platform: string;
  subs: string;
  match: string;
};

const CreatorMatch = () => {
  const creators: Creator[] = [
    { name: 'SpaceGamePlays', platform: 'YouTube', subs: '24K', match: '91%' },
    { name: 'IndieDiscovery', platform: 'Twitch', subs: '12K', match: '87%' },
    { name: 'GalacticGamer', platform: 'YouTube', subs: '56K', match: '82%' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Match Engine</CardTitle>
        <CardDescription>Connect with content creators who have covered similar games</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {creators.map((creator, index) => (
            <div key={index} className="flex items-center p-4 border rounded-lg justify-between">
              <div>
                <h3 className="font-medium">{creator.name}</h3>
                <p className="text-sm text-gray-600">{creator.platform} • {creator.subs} subscribers</p>
              </div>
              <div className="bg-atlas-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                {creator.match} match
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-atlas-purple ml-auto">View All Creators</Button>
      </CardFooter>
    </Card>
  );
};

export default CreatorMatch;
