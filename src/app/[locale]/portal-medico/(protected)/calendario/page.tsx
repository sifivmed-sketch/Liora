import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import CalendarPageContent from '@/features/portal-medico/calendario/components/CalendarPageContent';

export default async function CalendarioPage() {
  const session = await getMedicalPortalSession();
  if (!session) return notFound();
  return <CalendarPageContent />;
}
