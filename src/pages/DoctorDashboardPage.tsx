
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PatientList } from '@/components/doctor/PatientList';
import { PatientDetails } from '@/components/doctor/PatientDetails';

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  if (!user || user.role !== 'doctor') {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <PatientList onSelectPatient={setSelectedPatientId} />
        </div>
        <div className="md:col-span-2">
          {selectedPatientId ? (
            <PatientDetails patientId={selectedPatientId} />
          ) : (
            <div className="text-center text-muted-foreground p-8">
              Select a patient to view their details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
