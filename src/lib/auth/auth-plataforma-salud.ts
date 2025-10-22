import { betterAuth } from "better-auth";

export const HealthPlatformAuth = betterAuth({
  session: {
    modelName: "health_platform_session",
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  },

  advanced: {
    cookiePrefix: "health_platform",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});