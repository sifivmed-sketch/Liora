import LogoutButton from "@/features/plataforma-salud/components/LogoutButton";
import { getHealthPlatformSession } from "@/lib/auth/auth-plataforma-salud.helper";
import { notFound } from "next/navigation";

export default async function PerfilPage() {
    const session = await getHealthPlatformSession();

    if (!session) {
        return notFound();
    }

    return (
        <>
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Perfil de: <strong> {session.email} </strong> </h1>
            <h2>Nombre: <strong> {session.name} </strong> </h2>
            {/* Logout Button */}
            <div className="mt-4">
                <LogoutButton/>
            </div>
        </div>
        </>
    )
}