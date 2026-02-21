import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import TemplatesPageContent from '@/features/portal-medico/plantillas/components/TemplatesPageContent';

/**
 * Plantillas (consultation section templates) page.
 * Same design as record-templates: stepper with 6 sections, edit panels aligned to Consulta.
 */
export default async function PlantillasPage() {
  const session = await getMedicalPortalSession();
  if (!session) return notFound();
  return <TemplatesPageContent />;
}
