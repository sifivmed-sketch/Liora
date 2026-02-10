import { getHealthPlatformSession } from '@/lib/auth/auth-plataforma-salud.helper';
import { notFound } from 'next/navigation';
import MedicalHistoryPageContent from '@/features/plataforma-salud/historial/components/MedicalHistoryPageContent';

/**
 * Medical history page for health platform
 * Displays patient's complete medical history
 * @returns JSX element with medical history page
 */
export default async function HistorialPage() {
  const session = await getHealthPlatformSession();

  if (!session) {
    return notFound();
  }

  return (
    <MedicalHistoryPageContent
      sessionId={session.sessionId || ''}
      idPaciente={session.id}
    />
  );
}
