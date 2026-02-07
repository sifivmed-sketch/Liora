'use server';

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { MEDICAL_PORTAL_COOKIE_NAME, HEALTH_PLATFORM_COOKIE_NAME } from "../constants/cookies.constants";

const MEDICAL_PORTAL_SECRET = new TextEncoder().encode(
  process.env.MEDICAL_PORTAL_SECRET || "default-secret-key-for-development-only"
);

const HEALTH_PLATFORM_SECRET = new TextEncoder().encode(
  process.env.HEALTH_PLATFORM_SECRET || "default-secret-key-for-development-only"
);

/**
 * User data structure for JWT token
 */
interface UserData {
  id: string;
  email: string;
  name: string;
  lastName: string;
  createdAt: string;
  lastLoginAt: string;
  sessionId?: string;
}

/**
 * Creates and saves a medical portal session token
 * @param userData - User data to include in the token
 * @returns Promise<void>
 */
export const saveMedicalPortalSession = async (userData: UserData): Promise<void> => {
  const token = await new SignJWT({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    lastName: userData.lastName,
    createdAt: userData.createdAt,
    lastLoginAt: userData.lastLoginAt,
    sessionId: userData.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(MEDICAL_PORTAL_SECRET);

  (await cookies()).set(MEDICAL_PORTAL_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });
};

/**
 * Creates and saves a health platform session token
 * @param userData - User data to include in the token
 * @returns Promise<void>
 */
export const saveHealthPlatformSession = async (userData: UserData): Promise<void> => {
  const token = await new SignJWT({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    lastName: userData.lastName,
    createdAt: userData.createdAt,
    lastLoginAt: userData.lastLoginAt,
    sessionId: userData.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(HEALTH_PLATFORM_SECRET);

  (await cookies()).set(HEALTH_PLATFORM_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });
};

/**
 * Deletes the medical portal session cookie
 */
export const deleteMedicalPortalSession = async (): Promise<void> => {
  (await cookies()).delete(MEDICAL_PORTAL_COOKIE_NAME);
};

/**
 * Deletes the health platform session cookie
 */
export const deleteHealthPlatformSession = async (): Promise<void> => {
  (await cookies()).delete(HEALTH_PLATFORM_COOKIE_NAME);
};

