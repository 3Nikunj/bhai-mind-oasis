
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthTrends } from '@/components/dashboard/HealthTrends';
import { AssessmentSummary } from '@/components/dashboard/AssessmentSummary';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate, isLoading]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-5 w-full mb-8" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your dashboard
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Health Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Track your mental and behavioral health progress over time with detailed insights and trends.
      </p>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="trends">Health Trends</TabsTrigger>
          <TabsTrigger value="summary">Assessment Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-6">
          <HealthTrends userId={user.id} />
        </TabsContent>
        
        <TabsContent value="summary" className="mt-6">
          <AssessmentSummary userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
