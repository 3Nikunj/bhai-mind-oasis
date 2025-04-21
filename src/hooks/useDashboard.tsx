
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface Assessment {
  id: string;
  type: 'mental' | 'behavioral';
  result: string;
  created_at: string;
  answers: Record<string, number>;
}

export function useDashboard(userId: string) {
  const [errorShown, setErrorShown] = useState(false);

  const { data: assessments, isLoading, error } = useQuery({
    queryKey: ['assessments', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching assessments:', error);
          throw error;
        }

        return data as Assessment[];
      } catch (err) {
        console.error('Error in assessment fetch operation:', err);
        // Return empty array instead of throwing to prevent query from staying in loading state
        return [] as Assessment[];
      }
    },
    retry: 1, // Only retry once to prevent excessive requests on persistent errors
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show error toast only once
  useEffect(() => {
    if (error && !errorShown) {
      toast({
        title: "Error loading dashboard data",
        description: "We're having trouble loading your assessment data. Please try again later.",
        variant: "destructive",
      });
      setErrorShown(true);
    }
  }, [error, errorShown]);

  const mentalHealthAssessments = assessments?.filter(a => a.type === 'mental') || [];
  const behavioralAssessments = assessments?.filter(a => a.type === 'behavioral') || [];

  return {
    assessments: assessments || [],
    mentalHealthAssessments,
    behavioralAssessments,
    isLoading: isLoading && !error, // Don't show loading if there's an error
    error
  };
}
