import LanguageSelector from "@/components/LanguageSelector";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Language Selector */}
        <div className="mb-8 flex justify-end">
          <LanguageSelector />
        </div>
        
        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {t("title")}
          </h1>
          
          <div className="mt-8">
            <Link 
              href="/portal-medico/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {t("portal-medico-login-title")}
            </Link>
          </div>

          <div className="mt-8">
            <Link 
              href="/plataforma-salud/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors duration-200 no-underline"
            >
              {t("health-platform-login-title")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
