import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Limpiar tablas relacionadas primero
    try {
      await prisma.$executeRaw`TRUNCATE TABLE notification_views, accounts, sessions, notification CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`;
    } catch (error) {
      console.error('Error al limpiar tablas:', error);
      // Continuamos incluso si falla el truncado
    }

    // Generar una contraseña hasheada
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Crear un nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrador',
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Usuario admin creado con éxito', 
      user: {
        id: newUser.id,
        username: newUser.username,
        // Contraseña segura para mostrar en la respuesta
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Error al configurar usuario:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al configurar usuario',
      error: String(error)
    }, { status: 500 });
  }
} 