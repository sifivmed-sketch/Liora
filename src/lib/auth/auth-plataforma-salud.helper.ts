'use server';

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getLoginErrorMessage, isLoginSuccessful, loginPatient, LoginPatientRequest } from "@/features/plataforma-salud/login/services/login.service";
import { HEALTH_PLATFORM_COOKIE_NAME } from "../constants/cookies.constants";
import { redirect } from "next/navigation";

const HEALTH_PLATFORM_SECRET = new TextEncoder().encode(process.env.HEALTH_PLATFORM_SECRET || "default-secret-key-for-development-only");

export async function HealthPlatformLogin (credentials: { email: string, password: string, stationId: string }) { 
    const request: LoginPatientRequest = { 
        usuario: credentials.email,
        clave: credentials.password,
        equipo: credentials.stationId,
    }
    const response = await loginPatient(request);
    
    if (!isLoginSuccessful(response)) {
        throw new Error(getLoginErrorMessage(response) || "Login failed. Please try again.");
    }

    const token = await new SignJWT({ 
        id: response.Id_Usuario,
        email: response.Email,
        name: response.Nombre,
        lastName: response.Apellidos,
        createdAt: response.Fecha_Creacion,
        lastLoginAt: response.Fecha_Ultimo_Acceso,
    }).setProtectedHeader({alg: "HS256"})
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(HEALTH_PLATFORM_SECRET);

    (await cookies()).set(HEALTH_PLATFORM_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/", // Available for all paths

    });

    return {
        token,
    }
}

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