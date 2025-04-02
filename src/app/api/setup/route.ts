import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Verificar si ya existe un usuario admin
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: 'El usuario admin ya existe',
        userExists: true
      }, { status: 200 });
    }

    // Solo si no existe el usuario admin, limpiamos tablas relacionadas
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
        // No mostrar contraseña en texto plano en respuesta
        passwordHint: 'admin123 (Solo mostrado en configuración inicial)'
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