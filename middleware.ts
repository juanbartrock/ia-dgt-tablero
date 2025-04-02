import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este middleware se ejecuta para todas las rutas (se puede limitar con config.matcher)
export function middleware(request: NextRequest) {
  // Si la solicitud es para la raíz del sitio
  if (request.nextUrl.pathname === '/') {
    // Redirigir a la página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Para todas las demás rutas, permitir que continúen normalmente
  return NextResponse.next();
}

// Opcional: especificar las rutas a las que se aplica este middleware
export const config = {
  matcher: ['/', '/api/:path*'],
}; 