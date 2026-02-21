import { getMedicalPortalSession } from '@/lib/auth/auth-medical-portal.helper';
import { notFound } from 'next/navigation';
import TemplateEditorPageContent from '@/features/portal-medico/plantillas/components/TemplateEditorPageContent';

const VALID_IDS = ['1', '2', '3', '4', '5', '6'] as const;

type PageProps = { params: Promise<{ id: string }> };

/**
 * Template editor page. Receives template id (1–6) and renders the editor
 * with the same layout as record-template-editor.html.
 */
export default async function TemplateEditorPage({ params }: PageProps) {
  const session = await getMedicalPortalSession();
  if (!session) return notFound();

  const { id } = await params;
  if (!VALID_IDS.includes(id as (typeof VALID_IDS)[number])) return notFound();

  const templateId = parseInt(id, 10) as 1 | 2 | 3 | 4 | 5 | 6;
  return <TemplateEditorPageContent templateId={templateId} />;
}
