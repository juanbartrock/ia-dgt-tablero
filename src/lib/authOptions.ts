import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Eliminamos el adaptador de Prisma para evitar problemas de compatibilidad
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

// Extendemos el tipo User de NextAuth para incluir username
declare module 'next-auth' {
  interface User {
    id: number;
    username: string;
    name?: string | null;
  }
  
  interface Session {
    user: {
      id: number;
      username: string;
      name?: string | null;
    }
  }
}

// También necesitamos extender el tipo JWT
declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    username: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Quitamos el adaptador para usar solo JWT
  providers: [
    CredentialsProvider({
      // El nombre que se mostrará en el formulario de inicio de sesión (si usas uno autogenerado)
      name: 'Credenciales',
      // `credentials` se usa para generar un formulario en la página de inicio de sesión.
      // Puedes especificar los campos que esperas que se envíen.
      credentials: {
        username: { label: "Usuario", type: "text", placeholder: "tu_usuario" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials: Record<"username" | "password", string> | undefined) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Busca al usuario por nombre de usuario (no por ID)
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
            // Seleccionamos solo los campos que necesitamos, sin incluir el ID problemático
            select: {
              id: true,
              username: true,
              password: true,
              name: true
            }
          });

          if (!user || !user.password) {
            console.error('Usuario no encontrado:', credentials.username);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordValid) {
            // Construimos un objeto de usuario simple para el token JWT
            // Convertimos explícitamente el ID a string para evitar problemas de tipo
            return {
              id: user.id,
              username: user.username,
              name: user.name
            };
          } else {
            console.error('Contraseña incorrecta para:', credentials.username);
            return null;
          }
        } catch (error) {
          console.error('Error en autenticación:', error);
          return null;
        }
      }
    })
  ],
  // Configuración de la sesión
  session: {
    strategy: 'jwt', // Usaremos JWT para las sesiones
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  // Callbacks para personalizar el comportamiento
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      // Cuando se crea el JWT por primera vez (después del authorize)
      // añadimos el ID de usuario y el username al token.
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Añadimos el ID y el username del token a la sesión del cliente
      if (token) {
        session.user.id = token.id as number;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  // Página de inicio de sesión personalizada (opcional, si no quieres la autogenerada)
  pages: {
     signIn: '/login', // Redirige a /login si el usuario necesita iniciar sesión
     // error: '/auth/error', // Página para mostrar errores de autenticación (opcional)
     // signOut: '/logout', // Página personalizada de cierre de sesión (opcional)
   },
  // Secret para firmar los JWT, crucial para seguridad.
  // ¡Asegúrate de que esta variable esté en tus variables de entorno!
  secret: process.env.NEXTAUTH_SECRET,

  // Debugging (útil en desarrollo)
  // debug: process.env.NODE_ENV === 'development',
}; 