
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAssessment } from '@/hooks/useAssessment';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface MentalHealthAssessmentProps {
  user: User;
  onComplete: (result: string) => void;
}

export function MentalHealthAssessment({ user, onComplete }: MentalHealthAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const { isSubmitting, submitAssessment } = useAssessment({
    userId: user.id,
    type: 'mental'
  });

  const questions = [
    { id: 'q1', text: 'Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?' },
    { id: 'q2', text: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?' },
    { id: 'q3', text: 'Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?' },
    { id: 'q4', text: 'Over the past 2 weeks, how often have you felt tired or had little energy?' },
    { id: 'q5', text: 'Over the past 2 weeks, how often have you had poor appetite or overeating?' },
    { id: 'q6', text: 'Over the past 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?' },
    { id: 'q7', text: 'Over the past 2 weeks, how often have you had trouble concentrating on things, such as reading or watching TV?' },
    { id: 'q8', text: 'Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?' },
    { id: 'q9', text: 'Over the past 2 weeks, how often have you been unable to stop or control worrying?' },
    { id: 'q10', text: 'Over the past 2 weeks, how often have you had thoughts that you would be better off dead or of hurting yourself in some way?' },
    { id: 'q11', text: 'How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?' },
    { id: 'q12', text: 'Do you have anyone you can talk to about your problems or concerns?' },
    { id: 'q13', text: 'Have you previously been diagnosed with a mental health condition?' },
    { id: 'q14', text: 'Have you noticed any triggers that worsen your mental health?' },
    { id: 'q15', text: 'How often do you engage in activities that you enjoy or find fulfilling?' },
  ];

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting assessment with answers:", answers);
      
      const assessment = await submitAssessment(answers);
      console.log("Assessment submission result:", assessment);
      
      if (assessment && assessment.result) {
        toast({
          title: "Assessment Completed",
          description: "Your assessment has been analyzed successfully.",
        });
        onComplete(assessment.result);
      } else if (assessment && assessment.result === "") {
        toast({
          title: "Assessment Completed",
          description: "Analysis was completed but no detailed recommendations were provided.",
        });
        onComplete("Your assessment has been received. We recommend discussing these results with a healthcare professional.");
      } else {
        toast({
          title: "Submission Error",
          description: "There was a problem with your assessment. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getOptions = (questionId: string) => {
    if (questionId === 'q11') {
      return [
        { value: 0, label: 'Not difficult at all' },
        { value: 1, label: 'Somewhat difficult' },
        { value: 2, label: 'Very difficult' },
        { value: 3, label: 'Extremely difficult' }
      ];
    }
    
    if (questionId === 'q12' || questionId === 'q13') {
      return [
        { value: 0, label: 'Yes' },
        { value: 1, label: 'No' }
      ];
    }
    
    if (questionId === 'q15') {
      return [
        { value: 0, label: 'Daily' },
        { value: 1, label: 'Several times a week' },
        { value: 2, label: 'Once a week' },
        { value: 3, label: 'Rarely' }
      ];
    }
    
    return [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ];
  };

  const currentQuestion = questions[currentStep - 1];
  const options = getOptions(currentQuestion.id);
  const progress = (currentStep / questions.length) * 100;
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mental Health Assessment</CardTitle>
        <CardDescription>
          This assessment will help us understand your mental health needs better. Your responses are private and secure.
        </CardDescription>
        <div className="w-full bg-muted rounded-full h-2.5 mt-4">
          <div 
            className="bg-bhai-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Question {currentStep} of {questions.length}</h3>
          <p className="text-base">{currentQuestion.text}</p>
        </div>
        
        <RadioGroup
          value={answers[currentQuestion.id]?.toString() || ""}
          onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
          className="space-y-3"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option.value.toString()} 
                id={`${currentQuestion.id}-${option.value}`} 
              />
              <Label htmlFor={`${currentQuestion.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSubmitting}
        >
          Previous
        </Button>
        
        {currentStep < questions.length ? (
          <Button 
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined || isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={answers[currentQuestion.id] === undefined || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : 'Submit'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
