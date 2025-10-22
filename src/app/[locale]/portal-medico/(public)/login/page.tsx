import Logo from "@/components/Logo";
import MedicalCard from "@/components/MedicalCard";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Link as NavigationLink } from "@/i18n/navigation";
import LoginForm from "@/features/portal-medico/login/components/LoginForm";


/**
 * Página de login para el Portal Médico
 * Utiliza el sistema de colores médicos específicos
 */
export default function MedicalPortalLogin() {
  const t = useTranslations("portal-medico.login");

  return (
      <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
        <MedicalCard variant="medical-portal" className="p-4 sm:p-6 md:p-8 mb-6 max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <Logo />
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
            {/* Subtitle / Description */}
            <p className="text-gray-600 text-base md:text-lg">{t("subtitle")}</p>
          
            <div className="flex items-center justify-center mt-4">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM12 18.75c-1.24 0-2.25-1.01-2.25-2.25s1.01-2.25 2.25-2.25 2.25 1.01 2.25 2.25-1.01 2.25-2.25 2.25zm3.75-7.5h-7.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h7.5c.41 0 .75.34.75.75s-.34.75-.75.75zm0-3h-7.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h7.5c.41 0 .75.34.75.75s-.34.75-.75.75z"/>
              </svg>
              <span className="text-xs sm:text-sm text-gray-600">{t("description")}</span>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm />
          
           {/* Links to register */}
           <div className="border-t border-gray-200 text-center pt-4 mt-4">
             <p className="text-sm text-gray-600 mb-4">
               {t("no-account")}
             </p>
             <NavigationLink 
               href="/portal-medico/registro" 
               className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-base font-medium rounded-lg border border-gray-200 bg-white text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-sm focus-ring w-full"
             >
               {t("register")}
             </NavigationLink>
           </div>
        </MedicalCard>

         <footer className="text-center text-xs text-gray-500 space-y-2">
           <p>
             {t("terms-and-privacy")}
             <Link href="#" className="text-blue-600 underline transition-colors duration-200 hover:text-blue-800 focus-ring rounded-md px-1">{t("terms")}</Link> y 
             <Link href="#" className="text-blue-600 underline transition-colors duration-200 hover:text-blue-800 focus-ring rounded-md px-1">{t("privacy")}</Link>
           </p>
          <p>
            {t("portal")}
          </p>
        </footer>
      </div>
  );    
}
  