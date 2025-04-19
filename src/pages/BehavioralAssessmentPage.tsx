
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BehavioralHealthAssessment } from '@/components/assessment/BehavioralHealthAssessment';
import { AssessmentResult } from '@/components/results/AssessmentResult';
import { useAuth } from '@/hooks/useAuth';

export default function BehavioralAssessmentPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleAssessmentComplete = (result: string) => {
    setResult(result);
    setAssessmentCompleted(true);
  };

  const handleCloseResult = () => {
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Behavioral Health Assessment</h1>
      <p className="text-muted-foreground mb-8">
        This assessment will help us understand how your daily behaviors and lifestyle may impact your mental wellbeing.
      </p>

      {assessmentCompleted ? (
        <AssessmentResult result={result} onClose={handleCloseResult} />
      ) : (
        <BehavioralHealthAssessment user={user} onComplete={handleAssessmentComplete} />
      )}
    </div>
  );
}
