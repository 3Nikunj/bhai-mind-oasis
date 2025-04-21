
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface HealthTrendsProps {
  userId: string;
}

export function HealthTrends({ userId }: HealthTrendsProps) {
  const { mentalHealthAssessments, behavioralAssessments, isLoading } = useDashboard(userId);

  const mentalHealthData = useMemo(() => {
    return mentalHealthAssessments.map(assessment => ({
      date: format(new Date(assessment.created_at), 'MMM d'),
      value: Object.values(assessment.answers).reduce((sum, val) => sum + val, 0) / Object.keys(assessment.answers).length
    }));
  }, [mentalHealthAssessments]);

  const behavioralHealthData = useMemo(() => {
    return behavioralAssessments.map(assessment => ({
      date: format(new Date(assessment.created_at), 'MMM d'),
      value: Object.values(assessment.answers).reduce((sum, val) => sum + val, 0) / Object.keys(assessment.answers).length
    }));
  }, [behavioralAssessments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Trends</CardTitle>
          <CardDescription>Track your mental health assessment scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mentalHealthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 3]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavioral Health Trends</CardTitle>
          <CardDescription>Track your behavioral assessment scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={behavioralHealthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 3]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
