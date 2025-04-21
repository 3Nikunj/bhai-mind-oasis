
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Assessment {
  id: string;
  type: 'mental' | 'behavioral';
  result: string;
  created_at: string;
  answers: Record<string, number>;
}

export function useDashboard(userId: string) {
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments', userId],
    queryFn: async () => {
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
    }
  });

  const mentalHealthAssessments = assessments?.filter(a => a.type === 'mental') || [];
  const behavioralAssessments = assessments?.filter(a => a.type === 'behavioral') || [];

  return {
    assessments,
    mentalHealthAssessments,
    behavioralAssessments,
    isLoading
  };
}
