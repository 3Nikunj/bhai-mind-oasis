
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { format } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthTrendsProps {
  userId: string;
}

export function HealthTrends({ userId }: HealthTrendsProps) {
  const { mentalHealthAssessments, behavioralAssessments, isLoading, error } = useDashboard(userId);

  const mentalHealthData = useMemo(() => {
    if (mentalHealthAssessments.length === 0) {
      // Provide sample data for empty state
      return [
        { date: 'No data', value: 0 }
      ];
    }
    
    return mentalHealthAssessments.map(assessment => ({
      date: format(new Date(assessment.created_at), 'MMM d'),
      value: Object.values(assessment.answers).reduce((sum, val) => sum + val, 0) / Object.keys(assessment.answers).length
    }));
  }, [mentalHealthAssessments]);

  const behavioralHealthData = useMemo(() => {
    if (behavioralAssessments.length === 0) {
      // Provide sample data for empty state
      return [
        { date: 'No data', value: 0 }
      ];
    }
    
    return behavioralAssessments.map(assessment => ({
      date: format(new Date(assessment.created_at), 'MMM d'),
      value: Object.values(assessment.answers).reduce((sum, val) => sum + val, 0) / Object.keys(assessment.answers).length
    }));
  }, [behavioralAssessments]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load health trend data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const noMentalData = mentalHealthAssessments.length === 0;
  const noBehavioralData = behavioralAssessments.length === 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Trends</CardTitle>
          <CardDescription>Track your mental health assessment scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {noMentalData ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p>No mental health assessment data available.</p>
                <p className="text-sm mt-2">Complete an assessment to see your trends here.</p>
              </div>
            ) : (
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
            )}
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
            {noBehavioralData ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p>No behavioral health assessment data available.</p>
                <p className="text-sm mt-2">Complete an assessment to see your trends here.</p>
              </div>
            ) : (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
