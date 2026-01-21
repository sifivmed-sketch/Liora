import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localePrefix: 'never',
    pathnames: { 
        '/': '/',
        '/portal-medico/login': { 
            'es': '/portal-medico/inicio-sesion',
            'en': '/medical-portal/login',
        },
        '/portal-medico/registro': { 
            'es': '/portal-medico/registro',
            'en': '/medical-portal/register',
        },
        '/portal-medico/registro-exitoso': { 
            'es': '/portal-medico/registro-exitoso',
            'en': '/medical-portal/register-success',
        }, 
        '/portal-medico/perfil': { 
            'es': '/portal-medico/perfil',
            'en': '/medical-portal/profile',
        },
        '/plataforma-salud/login': { 
            'es': '/plataforma-salud/inicio-sesion',
            'en': '/health-platform/login',
        },
        '/plataforma-salud/registro': { 
            'es': '/plataforma-salud/registro',
            'en': '/health-platform/register',
        },
        '/plataforma-salud/registro-exitoso': { 
            'es': '/plataforma-salud/registro-exitoso',
            'en': '/health-platform/register-success',
        },
        '/plataforma-salud/perfil': { 
            'es': '/plataforma-salud/perfil',
            'en': '/health-platform/profile',
        },
        '/plataforma-salud/perfil-medico': { 
            'es': '/plataforma-salud/perfil-medico',
            'en': '/health-platform/medical-profile',
        },
        '/plataforma-salud': { 
            'es': '/plataforma-salud',
            'en': '/health-platform',
        },
        '/activar/[codigo]': { 
            'es': '/activar/[codigo]',
            'en': '/activate/[codigo]',
        },
        
    }
})