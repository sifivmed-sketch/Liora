import { getHealthPlatformSession } from '@/lib/auth/auth-plataforma-salud.helper';
import { notFound } from 'next/navigation';
import AppointmentsPageContent from '@/features/plataforma-salud/citas/components/AppointmentsPageContent';

/**
 * Appointments page for health platform
 * Displays patient appointments and appointment history
 * @returns JSX element with appointments page
 */
export default async function CitasPage() {
  const session = await getHealthPlatformSession();

  if (!session) {
    return notFound();
  }

  return <AppointmentsPageContent />;
}
