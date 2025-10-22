import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import RegisterSuccessContent from '@/features/portal-medico/registro-exitoso/components/RegisterSuccessContent';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'portal-medico.register-success' });
  
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

const RegisterSuccessPage = () => {
  return <RegisterSuccessContent />;
};

export default RegisterSuccessPage;
