import { NextResponse } from 'next/server';

export async function GET() {
  // Simplemente redirigimos a la página de login
  return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'https://ia-dgt-tablero-6872zv1gg-juanbartrock.vercel.app'));
} 