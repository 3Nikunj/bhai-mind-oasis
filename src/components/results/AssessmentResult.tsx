
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, Download, Printer } from 'lucide-react';

interface AssessmentResultProps {
  result: string;
  onClose: () => void;
}

export function AssessmentResult({ result, onClose }: AssessmentResultProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>BHAI - Assessment Result</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 2rem;
              }
              h1 {
                color: #333;
                margin-bottom: 1rem;
              }
              .date {
                color: #666;
                margin-bottom: 2rem;
              }
              .content {
                white-space: pre-line;
              }
            </style>
          </head>
          <body>
            <h1>BHAI - Mental Health Assessment Result</h1>
            <div class="date">Date: ${new Date().toLocaleDateString()}</div>
            <div class="content">${result}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `BHAI-Assessment-${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownload} className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
