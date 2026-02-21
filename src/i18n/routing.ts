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
        '/portal-medico/pacientes': {
            'es': '/portal-medico/pacientes',
            'en': '/medical-portal/patients',
        },
        '/portal-medico/calendario': {
            'es': '/portal-medico/calendario',
            'en': '/medical-portal/calendar',
        },
        '/portal-medico/sala-espera': {
            'es': '/portal-medico/sala-espera',
            'en': '/medical-portal/waiting-room',
        },
        '/portal-medico/consulta': {
            'es': '/portal-medico/consulta',
            'en': '/medical-portal/consultation',
        },
        '/portal-medico/plantillas': {
            'es': '/portal-medico/plantillas',
            'en': '/medical-portal/templates',
        },
        '/portal-medico/plantillas/[id]': {
            'es': '/portal-medico/plantillas/[id]',
            'en': '/medical-portal/templates/[id]',
        },
        '/portal-medico/pacientes/[id]': {
            'es': '/portal-medico/pacientes/[id]',
            'en': '/medical-portal/patients/[id]',
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
        '/plataforma-salud/citas': { 
            'es': '/plataforma-salud/citas',
            'en': '/medical-portal/appointments',
        },
        '/plataforma-salud/historial': { 
            'es': '/plataforma-salud/historial',
            'en': '/health-platform/medical-history',
        },
        '/plataforma-salud/historial/print': { 
            'es': '/plataforma-salud/historial/print',
            'en': '/health-platform/medical-history/print',
        },
        '/plataforma-salud/control-acceso': { 
            'es': '/plataforma-salud/control-acceso',
            'en': '/health-platform/access-control',
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