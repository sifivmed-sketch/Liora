import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { MEDICAL_PORTAL_COOKIE_NAME } from "../constants/cookies.constants";
import { redirect } from "next/navigation";

const MEDICAL_PORTAL_SECRET = new TextEncoder().encode(
  process.env.MEDICAL_PORTAL_SECRET || "default-secret-key-for-development-only"
);

export async function getMedicalPortalSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEDICAL_PORTAL_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, MEDICAL_PORTAL_SECRET);
    return verified.payload as {
      id: string;
      email: string;
      name: string;
      lastName: string;
      createdAt: string;
      lastLoginAt: string;
      sessionId?: string;
    };
  } catch {
    return null;
  }
}

export async function MedicalPortalLogout() {
  (await cookies()).delete(MEDICAL_PORTAL_COOKIE_NAME);
  redirect("/portal-medico/login");
}
