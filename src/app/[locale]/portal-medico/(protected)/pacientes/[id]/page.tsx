import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import PatientRecordPageContent from '@/features/portal-medico/pacientes/components/PatientRecordPageContent';

interface PatientRecordPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientRecordPage({ params }: PatientRecordPageProps) {
  const session = await getMedicalPortalSession();
  if (!session) return notFound();
  const { id } = await params;
  const userName =
    `${session.name ?? ''} ${session.lastName ?? ''}`.trim() ||
    session.email.split('@')[0];
  return <PatientRecordPageContent patientId={id} userName={userName} />;
}
