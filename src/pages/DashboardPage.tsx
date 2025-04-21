
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboard } from '@/hooks/useDashboard';
import { HealthTrends } from '@/components/dashboard/HealthTrends';
import { AssessmentSummary } from '@/components/dashboard/AssessmentSummary';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
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
