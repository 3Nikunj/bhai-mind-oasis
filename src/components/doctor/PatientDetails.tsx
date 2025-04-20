
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiagnosisForm } from './DiagnosisForm';
import { PrescriptionForm } from './PrescriptionForm';

interface PatientDetailsProps {
  patientId: string;
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
  const [patient, setPatient] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatientData() {
      try {
        const [patientData, assessmentsData, diagnosesData, prescriptionsData] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', patientId).single(),
          supabase.from('assessments').select('*').eq('user_id', patientId),
          supabase.from('diagnoses').select('*').eq('patient_id', patientId),
          supabase.from('prescriptions').select('*').eq('patient_id', patientId)
        ]);

        if (patientData.error) throw patientData.error;
        setPatient(patientData.data);
        setAssessments(assessmentsData.data || []);
        setDiagnoses(diagnosesData.data || []);
        setPrescriptions(prescriptionsData.data || []);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading patient details...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{patient.name}</h2>
        <div className="text-muted-foreground">{patient.email}</div>
      </Card>

      <Tabs defaultValue="assessments">
        <TabsList>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Assessment History</h3>
            {assessments.map((assessment) => (
              <div key={assessment.id} className="mb-4 p-4 border rounded-lg">
                <div className="font-medium capitalize">{assessment.type} Assessment</div>
                <div className="mt-2 text-muted-foreground">{assessment.result}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {new Date(assessment.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="diagnoses" className="mt-4">
          <DiagnosisForm patientId={patientId} onSuccess={() => {
            // Refresh diagnoses after adding new one
            supabase.from('diagnoses').select('*').eq('patient_id', patientId)
              .then(({ data }) => data && setDiagnoses(data));
          }} />
          <div className="mt-4">
            {diagnoses.map((diagnosis) => (
              <Card key={diagnosis.id} className="p-4 mb-4">
                <h4 className="font-medium">{diagnosis.condition}</h4>
                <p className="text-muted-foreground mt-2">{diagnosis.notes}</p>
                <div className="text-sm text-muted-foreground mt-2">
                  {new Date(diagnosis.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-4">
          <PrescriptionForm patientId={patientId} onSuccess={() => {
            // Refresh prescriptions after adding new one
            supabase.from('prescriptions').select('*').eq('patient_id', patientId)
              .then(({ data }) => data && setPrescriptions(data));
          }} />
          <div className="mt-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id} className="p-4 mb-4">
                <h4 className="font-medium">{prescription.medication}</h4>
                <div className="text-sm mt-1">Dosage: {prescription.dosage}</div>
                <p className="text-muted-foreground mt-2">{prescription.instructions}</p>
                <div className="text-sm text-muted-foreground mt-2">
                  Valid until: {prescription.valid_until ? new Date(prescription.valid_until).toLocaleDateString() : 'Not specified'}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
