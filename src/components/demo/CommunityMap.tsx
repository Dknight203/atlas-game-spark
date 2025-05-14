
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

type Community = {
  type: string;
  name: string;
  activity: string;
  age: string;
};

const CommunityMap = () => {
  const communities: Community[] = [
    { type: 'Reddit', name: 'r/IndieGames', activity: 'High', age: '2 days old' },
    { type: 'Discord', name: 'Indie Dev Hub', activity: 'Medium', age: '5 days old' },
    { type: 'Reddit', name: 'r/roguelikes', activity: 'High', age: '1 day old' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Opportunity Map</CardTitle>
        <CardDescription>Find active communities where your target audience is already engaging</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {communities.map((item, index) => (
            <div key={index} className="py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${item.activity === 'High' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{item.type} • {item.age}</div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>View</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-atlas-purple ml-auto">View All Communities</Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityMap;
