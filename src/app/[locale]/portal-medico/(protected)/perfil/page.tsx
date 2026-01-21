import MedicalProfileContent from "@/features/portal-medico/perfil/components/MedicalProfileContent";
import { getMedicalPortalSession } from "@/lib/auth/auth-medical-portal.helper";
import { notFound } from "next/navigation";

export default async function PerfilPage() {
  const session = await getMedicalPortalSession();

  if (!session) {
    return notFound();
  }

  // Get user ID from session (use email as fallback)
  const userId = session.id || session.email;

  // Get user's full name or fallback to email prefix
  const userName =
    `${session.name || ""} ${session.lastName || ""}`.trim() ||
    session.email.split("@")[0];

  return (
    <>
      <MedicalProfileContent userId={userId} userName={userName} />
    </>
  );
}