import z from "zod";

/**
 * Creates a register schema with custom error messages
 * @param t - Translation function for error messages
 * @returns Zod schema with localized error messages
 */
export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, { message: t("name-error") }),
      lastName: z.string().min(1, { message: t("last-name-error") }),
      email: z.email({ message: t("email-error") }),
      phone: z.string().min(1, { message: t("phone-error") }),
      password: z
        .string()
        .min(8, { message: t("password-error") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
          message: t("password-regex-error"),
        }),
      confirmPassword: z.string().min(8, { message: t("password-error") }),
      termsAndConditions: z.boolean().refine((val) => val === true, {
        message: t("terms-error"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("password-match-error"),
      path: ["confirmPassword"],
    });

// Default schema without translations (for backward compatibility)
export const registerSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  termsAndConditions: z.boolean(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;