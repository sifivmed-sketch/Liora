import { getTranslations } from 'next-intl/server';
import ActivationContent from '@/features/portal-medico/activar/components/ActivationContent';

export async function generateMetadata() {
  const t = await getTranslations('portal-medico.activation.metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function MedicalActivationPage() {
  return (
    <div className="portal-medico">
      <ActivationContent />
    </div>
  );
}
