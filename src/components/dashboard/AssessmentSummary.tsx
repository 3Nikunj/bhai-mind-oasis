
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboard } from '@/hooks/useDashboard';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface AssessmentSummaryProps {
  userId: string;
}

export function AssessmentSummary({ userId }: AssessmentSummaryProps) {
  const { assessments, isLoading } = useDashboard(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments?.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{format(new Date(assessment.created_at), 'PPP')}</TableCell>
                  <TableCell className="capitalize">{assessment.type}</TableCell>
                  <TableCell className="max-w-lg">
                    <div className="line-clamp-3">{assessment.result}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
