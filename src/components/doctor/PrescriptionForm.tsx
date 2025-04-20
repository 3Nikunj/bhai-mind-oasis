
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PrescriptionFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export function PrescriptionForm({ patientId, onSuccess }: PrescriptionFormProps) {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a prescription.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('prescriptions').insert({
        patient_id: patientId,
        doctor_id: user.id,
        medication,
        dosage,
        instructions,
        valid_until: validUntil || null,
      });

      if (error) throw error;

      toast({
        title: "Prescription Added",
        description: "The prescription has been saved successfully."
      });

      setMedication('');
      setDosage('');
      setInstructions('');
      setValidUntil('');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding prescription:', error);
      toast({
        title: "Error",
        description: "Failed to save the prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Prescription</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Medication"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="date"
            placeholder="Valid Until"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Prescription'}
        </Button>
      </form>
    </Card>
  );
}
