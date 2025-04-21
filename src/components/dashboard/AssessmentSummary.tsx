
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboard } from '@/hooks/useDashboard';
import { format } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface AssessmentSummaryProps {
  userId: string;
}

export function AssessmentSummary({ userId }: AssessmentSummaryProps) {
  const { assessments, isLoading, error } = useDashboard(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load assessment summary data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const hasAssessments = assessments && assessments.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasAssessments ? (
          <div className="min-h-[200px] flex flex-col items-center justify-center text-muted-foreground p-4">
            <p>No assessment data available.</p>
            <p className="text-sm mt-2">Complete an assessment to see your history here.</p>
          </div>
        ) : (
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
                {assessments.map((assessment) => (
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
        )}
      </CardContent>
    </Card>
  );
}
