import { betterAuth } from "better-auth";

export const MedicalPortalAuth = betterAuth({
  session: {
    modelName: "medical_portal_session",
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  },

  advanced: {
    cookiePrefix: "medical_portal",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});