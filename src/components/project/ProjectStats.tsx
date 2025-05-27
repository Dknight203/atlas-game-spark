
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, TrendingUp } from "lucide-react";

interface ProjectStatsProps {
  stats: {
    matches: number;
    communities: number;
    creators: number;
  };
  onStatClick: (tab: string) => void;
}

const ProjectStats = ({ stats, onStatClick }: ProjectStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatClick("matches")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Game Matches</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-atlas-purple">{stats.matches}</div>
          <p className="text-xs text-muted-foreground">Similar games found</p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatClick("communities")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Communities</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-atlas-teal">{stats.communities}</div>
          <p className="text-xs text-muted-foreground">Active communities</p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatClick("creators")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Creators</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-atlas-orange">{stats.creators}</div>
          <p className="text-xs text-muted-foreground">Potential creators</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStats;
