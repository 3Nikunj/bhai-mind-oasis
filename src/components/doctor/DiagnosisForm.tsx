
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface DiagnosisFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export function DiagnosisForm({ patientId, onSuccess }: DiagnosisFormProps) {
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('diagnoses').insert({
        patient_id: patientId,
        condition,
        notes,
      });

      if (error) throw error;

      toast({
        title: "Diagnosis Added",
        description: "The diagnosis has been saved successfully."
      });

      setCondition('');
      setNotes('');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      toast({
        title: "Error",
        description: "Failed to save the diagnosis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Diagnosis</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Diagnosis'}
        </Button>
      </form>
    </Card>
  );
}
