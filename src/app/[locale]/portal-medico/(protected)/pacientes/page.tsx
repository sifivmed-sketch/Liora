import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import PatientsPageContent from '@/features/portal-medico/pacientes/components/PatientsPageContent';

export default async function PacientesPage() {
  const session = await getMedicalPortalSession();
  if (!session) return notFound();
  return <PatientsPageContent />;
}
