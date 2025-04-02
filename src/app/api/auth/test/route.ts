import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'No autenticado', status: 401 },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: 'Autenticación exitosa',
    user: session.user,
    session
  });
} 