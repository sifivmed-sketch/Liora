import CheckIcon from "@/components/icons/check.icon";
import { useTranslations } from "next-intl";
import MedicalCard from "@/components/MedicalCard";
import Logo from "@/components/Logo";
import Link from "@/components/Link";
import RegisterForm from "@/features/plataforma-salud/registro/components/RegisterForm";

export default function HealthPlatformRegister() {
    const t = useTranslations("plataforma-salud.register");
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
            <MedicalCard variant="health-platform" className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-8">
                    <Logo />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
                    <p className="text-gray-600 text-base md:text-lg">{t("subtitle")}</p>

                    <div className="flex items-center justify-center mt-4">
                        <CheckIcon className="h-5 w-5 mx-1 text-[var(--color-primary)]" />
                        <span className="text-sm text-gray-600">{t("register-verified")}</span>
                    </div>
                </div>

                {/* Register Form */}
                <RegisterForm />
            </MedicalCard>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 mt-4">
                <p>
                    {t("already-have-account")} 
                    <Link href="/plataforma-salud/login" variant="health">{t("login-here")}</Link>
                </p>
            </footer>
        </div>
    )
}