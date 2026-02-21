import { ReactNode } from 'react';
import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import ProtectedLayoutShell from '@/features/portal-medico/components/ProtectedLayoutShell';

interface ProtectedLayoutProps {
  children: ReactNode;
}

/**
 * Layout for protected routes in the medical portal.
 * Renders dashboard (header + sidebar) or only children for full-page routes (e.g. patient record).
 */
const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await getMedicalPortalSession();

  if (!session) {
    return notFound();
  }

  const userName =
    `${session.name || ''} ${session.lastName || ''}`.trim() ||
    session.email.split('@')[0];

  return (
    <ProtectedLayoutShell userName={userName}>
      {children}
    </ProtectedLayoutShell>
  );
};

export default ProtectedLayout;
