import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Generates metadata for the Portal Médico layout with internationalization
 * @returns {Promise<Metadata>} The metadata object
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal-medico.metadata");
  
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Layout específico para el Portal Médico
 * Aplica los estilos y configuraciones médicas específicas
 */
export default function PortalMedicoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="portal-medico px-4">
      {children}
    </main>
  );
}
