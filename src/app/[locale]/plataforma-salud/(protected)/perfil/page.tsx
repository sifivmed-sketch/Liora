import { getHealthPlatformSession } from "@/lib/auth/auth-plataforma-salud.helper";
import { notFound } from "next/navigation";
import ProfilePageContent from "@/features/plataforma-salud/perfil/components/ProfilePageContent";
import { cookies } from "next/headers";

export default async function PerfilPage() {
  const session = await getHealthPlatformSession();

  if (!session) {
    return notFound();
  }

  // Debug: Log session data
  console.log('=== PerfilPage Session ===');
  console.log('session:', session);
  console.log('session.sessionId:', session.sessionId);
  console.log('session.id:', session.id);

  // Get user's full name
  const userName =
    `${session.name || ""} ${session.lastName || ""}`.trim() ||
    session.email.split("@")[0];

  return (
    <ProfilePageContent
      sessionId={session.sessionId || ""}
      idPaciente={session.id}
      userName={userName}
      userEmail={session.email}
    />
  );
}
