import { getHealthPlatformSession } from '@/lib/auth/auth-plataforma-salud.helper';
import { notFound } from 'next/navigation';
import PrintRecordsPageContent from '@/features/plataforma-salud/historial/components/PrintRecordsPageContent';

/**
 * Print/Export medical history page for health platform
 * Allows users to select sections and export their medical history
 * @returns JSX element with print/export page
 */
export default async function PrintRecordsPage() {
  const session = await getHealthPlatformSession();

  if (!session) {
    return notFound();
  }

  return (
    <PrintRecordsPageContent
      sessionId={session.sessionId || ''}
      idPaciente={session.id}
    />
  );
}
