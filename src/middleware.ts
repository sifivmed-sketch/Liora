// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

const HEALTH_PLATFORM_SECRET = new TextEncoder().encode(
  process.env.HEALTH_PLATFORM_SECRET || "default-secret-key-for-development-only"
);

const MEDICAL_PORTAL_SECRET = new TextEncoder().encode(
  process.env.MEDICAL_PORTAL_SECRET || "default-secret-key-for-development-only"
);

// Función para verificar si es una ruta de la plataforma (en cualquier idioma)
function isPlatformPath(path: string): boolean {
  return path.startsWith('/plataforma-salud') || path.startsWith('/health-platform');
}

// Función para verificar si es una ruta del portal médico (en cualquier idioma)
function isMedicalPortalPath(path: string): boolean {
  return path.startsWith('/portal-medico') || path.startsWith('/medical-portal');
}

// Función para verificar si es una ruta pública de plataforma-salud
function isPublicPlatformPath(path: string): boolean {
  const publicPatterns = [
    // Español
    /^\/plataforma-salud\/(login|inicio-sesion)/,
    /^\/plataforma-salud\/(registro|sign-up)/,
    /^\/plataforma-salud\/(recuperar-password|forgot-password)/,
    /^\/plataforma-salud\/(registro-exitoso|register-success)/,
    /^\/plataforma-salud\/(activar|activate)/,
    // Inglés
    /^\/health-platform\/(login|sign-in)/,
    /^\/health-platform\/(register|sign-up)/,
    /^\/health-platform\/(forgot-password|recover-password)/,
    /^\/health-platform\/(register-success|registration-success)/,
    /^\/health-platform\/(activate|activar)/,
  ];
  
  return publicPatterns.some(pattern => pattern.test(path));
}

// Función para verificar si es una ruta pública del portal médico
function isPublicMedicalPath(path: string): boolean {
  const publicPatterns = [
    // Español
    /^\/portal-medico\/(login|inicio-sesion)/,
    /^\/portal-medico\/(registro|sign-up)/,
    /^\/portal-medico\/(recuperar-password|forgot-password)/,
    /^\/portal-medico\/(registro-exitoso|register-success)/,
    /^\/portal-medico\/(activar|activate)/,
    // Inglés
    /^\/medical-portal\/(login|sign-in)/,
    /^\/medical-portal\/(register|sign-up)/,
    /^\/medical-portal\/(forgot-password|recover-password)/,
    /^\/medical-portal\/(register-success|registration-success)/,
    /^\/medical-portal\/(activate|activar)/,
  ];
  
  return publicPatterns.some(pattern => pattern.test(path));
}

// Función para obtener la ruta de login según el módulo y idioma
function getLoginPath(path: string): string {
  if (path.startsWith('/medical-portal')) {
    return '/medical-portal/login';
  }
  if (path.startsWith('/portal-medico')) {
    return '/portal-medico/login';
  }
  if (path.startsWith('/health-platform')) {
    return '/health-platform/login';
  }
  return '/plataforma-salud/login';
}

// Función para obtener la ruta de dashboard según el módulo y idioma
function getDashboardPath(path: string): string {
  if (path.startsWith('/medical-portal')) {
    return '/medical-portal/profile';
  }
  if (path.startsWith('/portal-medico')) {
    return '/portal-medico/perfil';
  }
  if (path.startsWith('/health-platform')) {
    return '/health-platform/profile';
  }
  return '/plataforma-salud/perfil';
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Proteger rutas de plataforma-salud
  if (isPlatformPath(path)) {
    const token = request.cookies.get('health_platform_session')?.value;
    const isPublic = isPublicPlatformPath(path);
    
    // Verificar si está autenticado
    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, HEALTH_PLATFORM_SECRET);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // Si está autenticado y va a ruta pública → Dashboard
    if (isAuthenticated && isPublic) {
      return NextResponse.redirect(
        new URL(getDashboardPath(path), request.url)
      );
    }

    // Si NO está autenticado y va a ruta privada → Login
    if (!isAuthenticated && !isPublic) {
      return NextResponse.redirect(
        new URL(getLoginPath(path), request.url)
      );
    }
  }

  // Proteger rutas de portal-medico
  if (isMedicalPortalPath(path)) {
    const token = request.cookies.get('medical_portal_session')?.value;
    const isPublic = isPublicMedicalPath(path);
    
    // Verificar si está autenticado
    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, MEDICAL_PORTAL_SECRET);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // Si está autenticado y va a ruta pública → Dashboard
    if (isAuthenticated && isPublic) {
      return NextResponse.redirect(
        new URL(getDashboardPath(path), request.url)
      );
    }

    // Si NO está autenticado y va a ruta privada → Login
    if (!isAuthenticated && !isPublic) {
      return NextResponse.redirect(
        new URL(getLoginPath(path), request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};