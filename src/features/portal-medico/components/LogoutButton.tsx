'use client';

import { MedicalPortalLogout } from "@/lib/auth/auth-medical-portal.helper";

const LogoutButton = () => {
    return (
        <button onClick={async () => await MedicalPortalLogout()} className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200 cursor-pointer" >
            Cerrar sesión
        </button>
    )
}

export default LogoutButton;