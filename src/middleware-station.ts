import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware configuration for matching routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

/**
 * Middleware function to handle station ID initialization
 * This middleware runs on every request and ensures the station ID is available
 * 
 * @param request - The incoming request
 * @returns NextResponse with the request or modified response
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Create response
  const response = NextResponse.next();
  
  // Add headers to indicate station ID initialization is needed
  response.headers.set('x-station-id-required', 'true');
  response.headers.set('x-station-id-api-url', process.env.NEXT_PUBLIC_API_URL || '');
  
  return response;
} 