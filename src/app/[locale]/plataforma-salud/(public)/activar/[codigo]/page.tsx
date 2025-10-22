import { getTranslations } from 'next-intl/server';
import ActivationContent from '@/features/plataforma-salud/activar/components/ActivationContent';

export async function generateMetadata() {
  const t = await getTranslations('plataforma-salud.activation.metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ActivationPage() {
  return (
    <div className="plataforma-salud">
      <ActivationContent />
    </div>
  );
}
