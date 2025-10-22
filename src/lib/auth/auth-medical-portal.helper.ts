'use server';

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { MEDICAL_PORTAL_COOKIE_NAME } from "../constants/cookies.constants";
import { redirect } from "next/navigation";
import { getLoginErrorMessage, isLoginSuccessful, loginDoctor, LoginDoctorRequest } from "@/features/portal-medico/login/services/login.service";

const MEDICAL_PORTAL_SECRET = new TextEncoder().encode(process.env.MEDICAL_PORTAL_SECRET || "default-secret-key-for-development-only");

export async function MedicalPortalLogin (credentials: { email: string, password: string, stationId: string }) { 
    const request: LoginDoctorRequest = { 
        usuario: credentials.email,
        clave: credentials.password,
        equipo: credentials.stationId,
    }
    const response = await loginDoctor(request);
    
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
      .sign(MEDICAL_PORTAL_SECRET);

    (await cookies()).set(MEDICAL_PORTAL_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/", // Available for all paths

    });

    return {
        token,
    }
}

export async function getMedicalPortalSession () {
    const cookieStore = await cookies(); 
    const token = cookieStore.get(MEDICAL_PORTAL_COOKIE_NAME)?.value; 

    if (!token) return null

    try { 
        const verified = await jwtVerify(token, MEDICAL_PORTAL_SECRET);
        return verified.payload as { id: string, email: string, name: string, lastName: string, createdAt: string, lastLoginAt: string };
    }catch { 
        return null
    }
}

export async function MedicalPortalLogout () {
    (await cookies()).delete(MEDICAL_PORTAL_COOKIE_NAME);
    redirect('/portal-medico/login');
}