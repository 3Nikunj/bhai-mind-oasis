
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssessmentResultProps {
  result: string;
  onClose: () => void;
}

export function AssessmentResult({ result, onClose }: AssessmentResultProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Personalized Analysis</CardTitle>
        <CardDescription>
          Based on your responses, we've prepared a personalized plan to support your mental wellbeing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="whitespace-pre-line">{result}</div>
        </ScrollArea>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </CardContent>
    </Card>
  );
}
