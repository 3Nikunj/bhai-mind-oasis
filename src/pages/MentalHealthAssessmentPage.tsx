
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MentalHealthAssessment } from '@/components/assessment/MentalHealthAssessment';
import { AssessmentResult } from '@/components/results/AssessmentResult';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export default function MentalHealthAssessmentPage() {
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
    if (!result) {
      toast({
        title: "Error",
        description: "No assessment result was returned. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Assessment completed with result:", result.substring(0, 100) + "...");
    setResult(result);
    setAssessmentCompleted(true);
    
    toast({
      title: "Assessment Completed",
      description: "Your mental health assessment has been analyzed successfully.",
    });
  };

  const handleCloseResult = () => {
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Mental Health Assessment</h1>
      <p className="text-muted-foreground mb-8">
        This assessment will help us understand your mental health needs better. Your responses are kept private and confidential.
      </p>

      {assessmentCompleted ? (
        <AssessmentResult result={result} onClose={handleCloseResult} />
      ) : (
        <MentalHealthAssessment user={user} onComplete={handleAssessmentComplete} />
      )}
    </div>
  );
}
