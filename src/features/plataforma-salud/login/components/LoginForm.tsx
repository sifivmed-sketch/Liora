'use client';

import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import { LoginFormData, loginSchema } from "../schema/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LockIcon from "@/components/icons/lock.icon";
import EmailIcon from "@/components/icons/email.icon";
import { useStationId } from "@/lib/stores/station.store";
import Link from "@/components/Link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HealthPlatformLogin } from "@/lib/auth/auth-plataforma-salud.helper";

const LoginForm = () => {
    const t = useTranslations("plataforma-salud.login");
    const router = useRouter();
    const [loginError, setLoginError] = useState<string | null>(null);

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        setError
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Get station ID (automatically initialized globally)
    const stationId = useStationId();

    /**
     * Handles the form submission
     * @param data {LoginFormData} - The form data
     * @returns void
     */
    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoginError(null);

            // Call the HealthPlatformLogin function
            const result = await HealthPlatformLogin({
                email: data.email,
                password: data.password,
                stationId: stationId || ''
            });

            // Only redirect if login was successful
            if (result && result.token) {
                router.push('/plataforma-salud/perfil');
            } else {
                setLoginError('Failed to create session. Please try again.');
            }
        } catch (error) {
            setLoginError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
        }
    }

    /**
     * Renders the login form
     * @returns JSX.Element
     */
    return (
        <form id="login-form" className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Input
                label={t("email")}
                type="email"
                placeholder={t("email-placeholder")}
                required
                registration={register("email")}
                error={errors.email?.message}
                helperText={t("email-helper-text")}
                showError={false}
                autoComplete="email"
                icon={<EmailIcon className="text-[var(--color-light-blue)]"  /> }
                helperTextClassName="!text-[var(--color-secondary)]"
            />
            
            <Input
                label={t("password")}
                type="password"
                placeholder={t("password-placeholder")}
                required
                registration={register("password")}
                error={errors.password?.message}
                helperText={t("password-helper-text")}
                showError={false}
                icon={<LockIcon className="text-[var(--color-light-blue)]" /> }
                helperTextClassName="!text-[var(--color-secondary)]"
            />

            <div className="text-right -mt-5">
                <Link href="#" type="next" variant="health" className="text-sm">
                    {t("forgot-password")}
                </Link>
            </div>

            {/* Error message display */}
            {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {loginError}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:bg-[#248456] hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
                {isSubmitting ? t("logging-in") : t("login")}
            </button>
        </form>
    )
}

export default LoginForm;