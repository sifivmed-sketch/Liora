import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import ConsultationPageContent from '@/features/portal-medico/consulta/components/ConsultationPageContent';

export default async function ConsultaPage() {
  const session = await getMedicalPortalSession();
  if (!session) return notFound();
  const userName =
    `${session.name ?? ''} ${session.lastName ?? ''}`.trim() ||
    session.email.split('@')[0];
  return <ConsultationPageContent userName={userName} />;
}
