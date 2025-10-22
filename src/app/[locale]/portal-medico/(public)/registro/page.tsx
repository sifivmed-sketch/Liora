import CheckIcon from "@/components/icons/check.icon";
import Logo from "@/components/Logo";
import MedicalCard from "@/components/MedicalCard";
import { useTranslations } from "next-intl";
import { Link as NavigationLink } from "@/i18n/navigation";
import RegisterForm from "@/features/portal-medico/registro/components/RegisterForm";

export default function MedicalPortalRegister() {
    const t = useTranslations("portal-medico.register");
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
            <MedicalCard variant="medical-portal" className="p-4 sm:p-6 md:p-8 mb-6 max-w-4xl mx-auto w-full">
                <div className="text-center mb-8">
                    <Logo />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
                    <p className="text-gray-600 text-base md:text-lg">{t("subtitle")}</p>

                    <div className="flex items-center justify-center mt-4">
                        <CheckIcon />
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
                    <NavigationLink href="/portal-medico/login" className=" text-sm text-blue-600 underline transition-colors duration-200 hover:text-blue-800 focus-ring rounded-md px-1">{t("login-here")}</NavigationLink>
                </p>
            </footer>
        </div>
    )
}