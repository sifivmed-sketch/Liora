import { ReactNode } from 'react';
import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import DashboardHeader from '@/features/portal-medico/components/DashboardHeader';
import DashboardSidebar from '@/features/portal-medico/components/DashboardSidebar';

interface ProtectedLayoutProps {
  children: ReactNode;
}

/**
 * Layout component for protected routes in the medical portal
 * Provides authentication check and dashboard structure with header and sidebar
 * 
 * @param children - The child components to render within this layout
 * @returns JSX element with protected layout structure
 */
const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await getMedicalPortalSession();

  if (!session) {
    return notFound();
  }

  // Get user's full name or fallback to email
  const userName =
    `${session.name || ""} ${session.lastName || ""}`.trim() ||
    session.email.split("@")[0];

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <DashboardHeader userName={userName} />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
