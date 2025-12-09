'use client';

import { useRouter } from "@/i18n/navigation";
import { deleteMedicalPortalSession } from "@/lib/auth/auth-actions";

const LogoutButton = () => {
  const router = useRouter();

  /**
   * Handles the logout action
   * @returns void
   */
  const handleLogout = async () => {
    await deleteMedicalPortalSession();
    router.push("/portal-medico/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200 cursor-pointer"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;