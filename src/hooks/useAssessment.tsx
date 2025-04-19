
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Assessment } from '@/types';

interface UseAssessmentProps {
  userId: string;
  type: 'mental' | 'behavioral';
}

export function useAssessment({ userId, type }: UseAssessmentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitAssessment = async (answers: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Call edge function to analyze assessment
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-assessment', {
        body: { type, answers }
      });

      if (analysisError) throw analysisError;

      const { result: analysis } = analysisData;

      // Save assessment to database
      const { data: assessment, error: insertError } = await supabase
        .from('assessments')
        .insert({
          user_id: userId,
          type,
          answers,
          result: analysis
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setResult(analysis);
      return assessment;

    } catch (error) {
      console.error('Error submitting assessment:', error);
      setError('Failed to analyze assessment. Please try again.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    result,
    error,
    submitAssessment
  };
}
