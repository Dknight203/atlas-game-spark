
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CompetitorData } from "@/types/analytics";

interface CompetitorAnalysisProps {
  data: CompetitorData[];
}

const CompetitorAnalysis = ({ data }: CompetitorAnalysisProps) => {
  const getRankTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return <Minus className="w-4 h-4 text-gray-400" />;
    
    if (current < previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current > previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getPerformanceBadge = (downloads?: number) => {
    if (!downloads) return null;
    
    if (downloads > 50000) {
      return <Badge className="bg-green-100 text-green-800">High Performer</Badge>;
    } else if (downloads > 10000) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medium Performer</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Emerging</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competitive Landscape</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No competitor data available. Connect your analytics to start tracking competitors.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((competitor) => (
                  <TableRow key={competitor.id}>
                    <TableCell className="font-medium">{competitor.competitor_name}</TableCell>
                    <TableCell>{competitor.platform}</TableCell>
                    <TableCell>#{competitor.current_rank || 'N/A'}</TableCell>
                    <TableCell>
                      {getRankTrend(competitor.current_rank, competitor.previous_rank)}
                    </TableCell>
                    <TableCell>{competitor.downloads_estimate?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>${competitor.revenue_estimate?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      {competitor.rating_average ? (
                        <div className="flex items-center">
                          {competitor.rating_average}/5
                          <span className="text-sm text-gray-500 ml-1">
                            ({competitor.review_count} reviews)
                          </span>
                        </div>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {getPerformanceBadge(competitor.downloads_estimate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Market Position Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Market Position Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Market Opportunity</h4>
              <p className="text-sm text-blue-700 mt-1">
                Based on competitor analysis, there's strong potential in the indie game market with average revenues of $75K+
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Competitive Advantage</h4>
              <p className="text-sm text-green-700 mt-1">
                Your game's unique features and target audience positioning show promise for market differentiation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorAnalysis;
