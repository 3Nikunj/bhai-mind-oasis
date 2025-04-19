
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Assessment } from '@/types';
import { analyzeAssessment } from '@/lib/api';
import { saveAssessment } from '@/lib/utils/storage';

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
      
      // Call API to analyze assessment
      const analysisResult = await analyzeAssessment(type, answers);
      
      // Create assessment record
      const assessment: Assessment = {
        id: uuidv4(),
        userId,
        type,
        answers,
        result: analysisResult,
        createdAt: Date.now()
      };
      
      // Save assessment
      saveAssessment(assessment);
      
      // Update state
      setResult(analysisResult);
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
