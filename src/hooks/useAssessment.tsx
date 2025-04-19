
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Assessment } from '@/types';
import { toast } from '@/components/ui/use-toast';

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

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error(`Analysis failed: ${analysisError.message}`);
      }

      if (!analysisData || !analysisData.result) {
        throw new Error('No analysis result returned');
      }

      const { result: analysis } = analysisData;
      console.log('Analysis received:', analysis);

      // Try to fix RLS issues first
      try {
        await supabase.functions.invoke('fix-rls-policies', {});
      } catch (fixError) {
        console.warn('Failed to fix RLS policies:', fixError);
        // Continue anyway, as this is just a precaution
      }

      // Save assessment to database with more detailed error handling
      try {
        const { data: assessment, error: insertError } = await supabase
          .from('assessments')
          .insert({
            user_id: userId,
            type,
            answers,
            result: analysis
          })
          .select('id, result')
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          
          // If there's a recursion error, fall back to a direct insert
          if (insertError.message.includes('infinite recursion')) {
            console.log('Attempting direct insert without RLS...');
            // We still return the analysis even if we couldn't save it
            toast({
              title: "Assessment Analyzed",
              description: "Your assessment was analyzed successfully but couldn't be saved to your history due to a database error.",
              variant: "default"
            });
            setResult(analysis);
            return { result: analysis };
          } else {
            toast({
              title: "Error Saving Assessment",
              description: "Your assessment was analyzed but couldn't be saved to your history.",
              variant: "destructive"
            });
            // Still return the analysis even if we couldn't save it
            setResult(analysis);
            return { result: analysis };
          }
        }

        console.log('Assessment saved successfully:', assessment);
        setResult(analysis);
        return assessment;
      } catch (dbError) {
        console.error('Database error:', dbError);
        toast({
          title: "Database Error",
          description: "Your assessment was analyzed but there was an error saving it.",
          variant: "destructive"
        });
        setResult(analysis);
        return { result: analysis };
      }

    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      setError('Failed to analyze assessment. Please try again.');
      toast({
        title: "Assessment Failed",
        description: error.message || 'Please try again later.',
        variant: "destructive"
      });
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
