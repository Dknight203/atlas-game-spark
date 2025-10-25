
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Download, Star } from "lucide-react";
import type { AnalyticsData } from "@/types/analytics";

interface MarketPerformanceProps {
  data: AnalyticsData[];
}

const MarketPerformance = ({ data }: MarketPerformanceProps) => {
  const latestRevenue = data.find(d => d.metric_type === 'revenue')?.metric_value || 0;
  const latestDownloads = data.find(d => d.metric_type === 'downloads')?.metric_value || 0;
  const latestRating = data.find(d => d.metric_type === 'ratings')?.metric_value || 0;

  const revenueData = data
    .filter(d => d.metric_type === 'revenue')
    .map(d => ({
      date: d.metric_date,
      value: d.metric_value,
      source: d.source
    }))
    .slice(0, 10);

  const downloadData = data
    .filter(d => d.metric_type === 'downloads')
    .map(d => ({
      date: d.metric_date,
      value: d.metric_value,
      source: d.source
    }))
    .slice(0, 10);

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Analytics Data Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect your game to tracking platforms or start collecting metrics to see performance insights here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${latestRevenue.toLocaleString()}</div>
            <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% vs last month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestDownloads.toLocaleString()}</div>
            <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% vs last month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRating}/5</div>
            <Badge variant="outline" className="mt-2 bg-yellow-50 text-yellow-700">
              Excellent rating
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Downloads Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Download Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={downloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Downloads']} />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPerformance;
