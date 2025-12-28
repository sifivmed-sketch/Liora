import { getHealthPlatformSession } from "@/lib/auth/auth-plataforma-salud.helper";
import { notFound } from "next/navigation";
import ProfilePageContent from "@/features/plataforma-salud/perfil/components/ProfilePageContent";
import { cookies } from "next/headers";

export default async function PerfilPage() {
  const session = await getHealthPlatformSession();

  if (!session) {
    return notFound();
  }

  // Get the token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("health_platform_session")?.value || "";

  // Get user's full name
  const userName =
    `${session.name || ""} ${session.lastName || ""}`.trim() ||
    session.email.split("@")[0];

  return (
    <ProfilePageContent
      token={token}
      idPaciente={session.id}
      userName={userName}
      userEmail={session.email}
    />
  );
}
