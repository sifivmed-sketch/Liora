'use client';

import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  RegisterFormData,
  createRegisterSchema,
} from "../schema/register.schema";
import Link from "@/components/Link";
import {
  registerDoctor,
  createRegisterDoctorRequest,
  type DoctorRegistrationResult,
} from "../services/register.service";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useRegistrationStore } from "@/lib/stores/registration.store";

const RegisterForm = () => {
  const t = useTranslations("portal-medico.register");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const markRegistrationSuccessful = useRegistrationStore(
    (state) => state.markRegistrationSuccessful
  );
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      termsAndConditions: false,
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  /**
   * Handles form submission with proper error handling and loading states
   * @param data - Form data validated by Zod
   */
  const onSubmit = async (data: RegisterFormData) => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    setApiError(null); // Clear previous errors

    try {
      const request = createRegisterDoctorRequest({
        email: data.email,
        password: data.password,
      });

      const result: DoctorRegistrationResult = await registerDoctor(request);

      if (result.success) {
        // Mark registration as successful and store user email
        markRegistrationSuccessful(data.email);
        // Redirect to success page with i18n support
        // Keep loading state active during navigation
        router.push({ pathname: "/portal-medico/registro-exitoso" });
        // Don't set isSubmitting to false here - let the component unmount during navigation
      } else {
        // Handle registration errors
        const errorMessage = result.errorMessage || t("registration-failed");
        setApiError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("unexpected-error");
      setApiError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="registerForm"
      className="space-y-8"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-6">
        <Input
          label={t("email")}
          type="email"
          placeholder={t("email-placeholder")}
          required
          registration={register("email")}
          error={errors.email?.message}
          autoComplete="email"
          disabled={isSubmitting}
        />

        <Input
          label={t("password")}
          type="password"
          placeholder={t("password-placeholder")}
          required
          registration={register("password")}
          error={errors.password?.message}
          helperText={t("password-helper-text")}
          disabled={isSubmitting}
        />

        <Input
          label={t("confirm-password")}
          type="password"
          placeholder={t("confirm-password-placeholder")}
          required
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <label className="flex items-start space-x-3 cursor-pointer">
            <Input
              type="checkbox"
              registration={register("termsAndConditions")}
              id="termsAndConditions"
              name="termsAndConditions"
              required
              className="mt-1.5"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700 select-none">
              {t("accept-terms-and-conditions")}
              <Link href="#" type="next" variant="medical">
                {t("terms-and-conditions")}
              </Link>{" "}
              {t("and")}{" "}
              <Link href="#" type="next" variant="medical">
                {t("privacy-policy")}
              </Link>{" "}
              {t("for")} {t("information-verified-confirmation")}
            </span>
          </label>
        </div>
        {errors.termsAndConditions && (
          <div className="mt-2 flex items-center text-red-600 text-xs px-1">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errors.termsAndConditions.message}</span>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                {t("error-title")}
              </h3>
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50 rounded-full p-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--color-medical-primary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-medical-dark)] hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-medical-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        {isSubmitting ? t("creating") : t("submit")}
      </button>
    </form>
  );
};

export default RegisterForm