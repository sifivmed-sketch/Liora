import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import WaitingRoomPageContent from '@/features/portal-medico/sala-espera/components/WaitingRoomPageContent';

export default async function SalaEsperaPage() {
  const session = await getMedicalPortalSession();
  if (!session) return notFound();
  return <WaitingRoomPageContent />;
}
