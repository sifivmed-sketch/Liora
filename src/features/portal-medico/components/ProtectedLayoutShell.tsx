'use client';

import { usePathname } from '@/i18n/navigation';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

interface ProtectedLayoutShellProps {
  children: React.ReactNode;
  userName: string;
}

/**
 * Wraps protected content: shows full dashboard (header + sidebar + main) or only children.
 * When the route is the patient record (e.g. /portal-medico/pacientes/[id]), renders only children
 * so the expediente page can be full-page without the panel menu.
 */
const ProtectedLayoutShell = ({ children, userName }: ProtectedLayoutShellProps) => {
  const pathname = usePathname() ?? '';

  const isPatientRecordPage = /(^|\/)(portal-medico\/pacientes|medical-portal\/patients)\/[^/]+$/.test(pathname);
  const isConsultationPage = /(^|\/)(portal-medico\/consulta|medical-portal\/consultation)(\/|$)/.test(pathname);

  if (isPatientRecordPage || isConsultationPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <DashboardHeader userName={userName} />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayoutShell;
