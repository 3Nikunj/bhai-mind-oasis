
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface PatientListProps {
  onSelectPatient: (patientId: string) => void;
}

export function PatientList({ onSelectPatient }: PatientListProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('role', 'patient');

        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Loading patients...</div>;
  }

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Patients</h2>
      <ScrollArea className="h-[600px]">
        <div className="space-y-2">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className="p-3 rounded-lg hover:bg-accent cursor-pointer"
            >
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-muted-foreground">{patient.email}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
