'use client';

import { HealthPlatformLogout } from "@/lib/auth/auth-plataforma-salud.helper";

const LogoutButton = () => {
    return (
        <button onClick={async () => await HealthPlatformLogout()} className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200 cursor-pointer" >
            Cerrar sesión
        </button>
    )
}

export default LogoutButton;