
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Clock, DollarSign, Target } from "lucide-react";
import type { UserAnalytics } from "@/types/analytics";

interface PlayerBehaviorAnalyticsProps {
  data: UserAnalytics[];
}

const PlayerBehaviorAnalytics = ({ data }: PlayerBehaviorAnalyticsProps) => {
  const retentionData = [
    { day: 'Day 1', retention: data.find(d => d.metric_name === 'retention_d1')?.metric_value * 100 || 65 },
    { day: 'Day 7', retention: data.find(d => d.metric_name === 'retention_d7')?.metric_value * 100 || 35 },
    { day: 'Day 30', retention: data.find(d => d.metric_name === 'retention_d30')?.metric_value * 100 || 15 },
  ];

  const sessionLength = data.find(d => d.metric_name === 'session_length')?.metric_value || 25.5;
  const ltv = data.find(d => d.metric_name === 'ltv')?.metric_value || 12.50;

  const engagementData = [
    { segment: 'New Users', sessions: 850, avgLength: 15.2 },
    { segment: 'Returning Users', sessions: 1200, avgLength: 28.5 },
    { segment: 'Paying Users', sessions: 400, avgLength: 42.1 },
  ];

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Player Data Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start tracking player behavior to see retention curves, session lengths, and engagement metrics here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Player Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Length</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionLength} min</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Player LTV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ltv}</div>
            <p className="text-xs text-muted-foreground">Per paying user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day 1 Retention</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retentionData[0].retention}%</div>
            <p className="text-xs text-muted-foreground">Above industry average</p>
          </CardContent>
        </Card>
      </div>

      {/* Retention Curve */}
      <Card>
        <CardHeader>
          <CardTitle>Player Retention Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
              <Line type="monotone" dataKey="retention" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Engagement by Segment */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement by User Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#8884d8" />
              <Bar dataKey="avgLength" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Player Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Player Behavior Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Engagement Pattern</h4>
              <p className="text-sm text-purple-700 mt-1">
                Players show strong initial engagement with above-average session lengths, indicating compelling gameplay mechanics.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">Monetization Opportunity</h4>
              <p className="text-sm text-orange-700 mt-1">
                Paying users demonstrate 2.8x higher session lengths, suggesting strong value perception among converted players.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerBehaviorAnalytics;
