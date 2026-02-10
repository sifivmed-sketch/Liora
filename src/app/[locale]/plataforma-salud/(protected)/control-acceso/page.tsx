import { getHealthPlatformSession } from '@/lib/auth/auth-plataforma-salud.helper';
import { notFound } from 'next/navigation';
import AccessControlPageContent from '@/features/plataforma-salud/control-acceso/components/AccessControlPageContent';

/**
 * Access control page for health platform
 * Displays patient's access control settings
 * @returns JSX element with access control page
 */
export default async function ControlAccesoPage() {
  const session = await getHealthPlatformSession();

  if (!session) {
    return notFound();
  }

  return <AccessControlPageContent />;
}
