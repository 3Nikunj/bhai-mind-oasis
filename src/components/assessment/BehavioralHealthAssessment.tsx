
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessment } from '@/hooks/useAssessment';
import { User } from '@/types';

interface BehavioralHealthAssessmentProps {
  user: User;
  onComplete: (result: string) => void;
}

export function BehavioralHealthAssessment({ user, onComplete }: BehavioralHealthAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const { isSubmitting, result, submitAssessment } = useAssessment({
    userId: user.id,
    type: 'behavioral'
  });

  const questions = [
    { id: 'b1', text: 'How often do you engage in physical activity or exercise?' },
    { id: 'b2', text: 'How would you rate your overall sleep quality?' },
    { id: 'b3', text: 'How often do you consume alcohol?' },
    { id: 'b4', text: 'Do you currently use tobacco products?' },
    { id: 'b5', text: 'How often do you eat a balanced diet with fruits and vegetables?' },
    { id: 'b6', text: 'How many hours per day do you typically spend on screens (TV, computer, phone)?' },
    { id: 'b7', text: 'How often do you engage in social activities with friends or family?' },
    { id: 'b8', text: 'How often do you practice relaxation techniques or mindfulness?' },
    { id: 'b9', text: 'How often do you feel that everyday stressors overwhelm you?' },
    { id: 'b10', text: 'How would you rate your work-life balance?' },
    { id: 'b11', text: 'Have you experienced any major life changes in the past year?' },
    { id: 'b12', text: 'How often do you find yourself procrastinating on important tasks?' },
    { id: 'b13', text: 'How often do you experience physical symptoms like headaches, stomachaches, or muscle tension?' },
    { id: 'b14', text: 'How often do you feel satisfied with your daily accomplishments?' },
    { id: 'b15', text: 'How often do you engage in activities that give you a sense of purpose?' },
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
    const assessment = await submitAssessment(answers);
    if (assessment && assessment.result) {
      onComplete(assessment.result);
    }
  };

  const getOptions = (questionId: string) => {
    // Options for specific questions
    if (questionId === 'b1') {
      return [
        { value: 0, label: 'Daily' },
        { value: 1, label: '3-4 times a week' },
        { value: 2, label: 'Once a week' },
        { value: 3, label: 'Rarely or never' }
      ];
    }
    
    if (questionId === 'b2') {
      return [
        { value: 0, label: 'Very good' },
        { value: 1, label: 'Good' },
        { value: 2, label: 'Fair' },
        { value: 3, label: 'Poor' }
      ];
    }
    
    if (questionId === 'b3') {
      return [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Occasionally' },
        { value: 2, label: 'Weekly' },
        { value: 3, label: 'Daily' }
      ];
    }
    
    if (questionId === 'b4') {
      return [
        { value: 0, label: 'No' },
        { value: 1, label: 'Occasionally' },
        { value: 2, label: 'Regularly' },
        { value: 3, label: 'Heavily' }
      ];
    }
    
    if (questionId === 'b6') {
      return [
        { value: 0, label: 'Less than 2 hours' },
        { value: 1, label: '2-4 hours' },
        { value: 2, label: '4-6 hours' },
        { value: 3, label: 'More than 6 hours' }
      ];
    }
    
    if (questionId === 'b11') {
      return [
        { value: 0, label: 'None' },
        { value: 1, label: 'One minor change' },
        { value: 2, label: 'One major change' },
        { value: 3, label: 'Multiple major changes' }
      ];
    }
    
    // Default options for most questions
    return [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' }
    ];
  };

  const currentQuestion = questions[currentStep - 1];
  const options = getOptions(currentQuestion.id);
  const progress = (currentStep / questions.length) * 100;
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Behavioral Health Assessment</CardTitle>
        <CardDescription>
          This assessment helps us understand your daily habits and behaviors that may impact your mental wellbeing.
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
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < questions.length ? (
          <Button 
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={answers[currentQuestion.id] === undefined || isSubmitting}
          >
            {isSubmitting ? 'Analyzing...' : 'Submit'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
