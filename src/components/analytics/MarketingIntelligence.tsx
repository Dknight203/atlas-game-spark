
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Eye, MessageSquare, Share2 } from "lucide-react";
import type { AnalyticsData } from "@/types/analytics";

interface MarketingIntelligenceProps {
  analyticsData: AnalyticsData[];
}

const MarketingIntelligence = ({ analyticsData }: MarketingIntelligenceProps) => {
  // Sample marketing data
  const acquisitionChannels = [
    { name: 'Steam Store', value: 45, color: '#8884d8' },
    { name: 'Social Media', value: 25, color: '#82ca9d' },
    { name: 'Influencers', value: 15, color: '#ffc658' },
    { name: 'Direct', value: 10, color: '#ff7300' },
    { name: 'Other', value: 5, color: '#00ff00' }
  ];

  const campaignPerformance = [
    { campaign: 'Launch Week', impressions: 150000, clicks: 7500, conversions: 450, ctr: 5.0 },
    { campaign: 'Holiday Sale', impressions: 120000, clicks: 6000, conversions: 380, ctr: 5.0 },
    { campaign: 'Content Creator', impressions: 80000, clicks: 4800, conversions: 320, ctr: 6.0 },
    { campaign: 'Social Media', impressions: 200000, clicks: 8000, conversions: 280, ctr: 4.0 },
  ];

  const socialMetrics = [
    { platform: 'YouTube', mentions: 145, sentiment: 'Positive', growth: '+12%' },
    { platform: 'Twitter', mentions: 89, sentiment: 'Mixed', growth: '+8%' },
    { platform: 'Reddit', mentions: 67, sentiment: 'Positive', growth: '+15%' },
    { platform: 'TikTok', mentions: 234, sentiment: 'Very Positive', growth: '+25%' },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Very Positive': return 'bg-green-100 text-green-800';
      case 'Positive': return 'bg-green-100 text-green-800';
      case 'Mixed': return 'bg-yellow-100 text-yellow-800';
      case 'Negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Marketing KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">550K</div>
            <p className="text-xs text-muted-foreground">+18% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <p className="text-xs text-muted-foreground">Above industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Mentions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">535</div>
            <p className="text-xs text-muted-foreground">+22% growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viral Coefficient</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.3</div>
            <p className="text-xs text-muted-foreground">Organic growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Acquisition Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Acquisition Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={acquisitionChannels}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {acquisitionChannels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="campaign" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="font-medium">{metric.platform}</div>
                  <div className="text-sm text-gray-600">{metric.mentions} mentions</div>
                  <Badge className={getSentimentColor(metric.sentiment)}>
                    {metric.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600">{metric.growth}</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Top Performing Channel</h4>
              <p className="text-sm text-blue-700 mt-1">
                Steam Store discovery drives 45% of acquisitions. Optimize store page and keywords for better visibility.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Social Momentum</h4>
              <p className="text-sm text-green-700 mt-1">
                TikTok shows highest growth (+25%). Consider increasing content creator partnerships on this platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingIntelligence;
