import LogoutButton from "@/features/portal-medico/components/LogoutButton";
import { getMedicalPortalSession } from "@/lib/auth/auth-medical-portal.helper";
import { notFound } from "next/navigation";

export default async function PerfilPage() {
  const session = await getMedicalPortalSession();

  if (!session) {
    return notFound();
  }

  // Get user's full name or fallback to email
  const userName =
    `${session.name || ""} ${session.lastName || ""}`.trim() ||
    session.email.split("@")[0];

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>
          Perfil de: <strong> {session.email} </strong>
        </h1>
        <h2>
          Nombre del usuario:
          <strong>{userName}</strong>
        </h2>

        {/* Logout Button */}
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}