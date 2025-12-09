import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { HEALTH_PLATFORM_COOKIE_NAME } from "../constants/cookies.constants";
import { redirect } from "next/navigation";

const HEALTH_PLATFORM_SECRET = new TextEncoder().encode(process.env.HEALTH_PLATFORM_SECRET || "default-secret-key-for-development-only");

export async function getHealthPlatformSession () {
    const cookieStore = await cookies(); 
    const token = cookieStore.get(HEALTH_PLATFORM_COOKIE_NAME)?.value; 

    if (!token) return null

    try { 
        const verified = await jwtVerify(token, HEALTH_PLATFORM_SECRET);
        return verified.payload as { id: string, email: string, name: string, lastName: string, createdAt: string, lastLoginAt: string };
    }catch { 
        return null
    }
}

export async function HealthPlatformLogout () {
    (await cookies()).delete(HEALTH_PLATFORM_COOKIE_NAME);
    redirect('/plataforma-salud/login');
}