import Link from "@/components/Link";
import { Link as NavigationLink } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import MedicalCard from "@/components/MedicalCard";
import { useTranslations } from "next-intl";
import LoginForm from "@/features/plataforma-salud/login/components/LoginForm";

export default function HealthPlatformLogin() {
    const t = useTranslations("plataforma-salud.login");
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
            <MedicalCard variant="health-platform" className="bg-white rounded-3xl shadow-2xl mb-6 max-w-lg mx-auto w-full">
                <div className="text-center mb-8">
                    <Logo />
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
                    {/* Subtitle / Description */}
                    <p className="text-gray-600 text-base md:text-lg">{t("subtitle")}</p>
                
                    <div className="flex items-center justify-center mt-4">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-600">{t("description")}</span>
                    </div>
                </div>
                
                {/* Login Form */}
                <LoginForm />

                {/* Links to register */}
                <div className="border-t border-gray-200 text-center pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-4">
                        {t("no-have-account")}
                    </p>
                    <NavigationLink     
                    href="/plataforma-salud/registro" 
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-base font-medium rounded-lg border border-gray-200 bg-white text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-sm focus-ring w-full !no-underline"
                    >
                        {t("register")}
                    </NavigationLink>
                </div>
            </MedicalCard>

            <footer className="text-center text-xs text-gray-500 space-y-2">
                <p>
                    {t("terms-and-privacy")}
                    <Link type="next" variant="health" href="#">{t("terms")}</Link> y 
                    <Link type="next" variant="health" href="#">{t("privacy")}</Link>
                </p>
                <p>
                    {t("health-platform")}
                </p>
        </footer>
        </div>
    );
}