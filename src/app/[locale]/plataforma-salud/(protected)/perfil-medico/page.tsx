import { getHealthPlatformSession } from "@/lib/auth/auth-plataforma-salud.helper";
import { notFound } from "next/navigation";
import MedicalProfileContent from "@/features/plataforma-salud/perfil-medico/components/MedicalProfileContent";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Generate metadata for the medical profile page
 * @param params - Route parameters including locale
 * @returns Metadata object
 */
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "plataforma-salud.medical-profile.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Medical Profile Page
 * Displays medical information and doctor permissions
 * Protected route - requires authentication
 */
export default async function PerfilMedicoPage() {
  const session = await getHealthPlatformSession();

  if (!session) {
    return notFound();
  }

  return <MedicalProfileContent />;
}
