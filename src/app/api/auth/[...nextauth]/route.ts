import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma'; // Nuestra instancia de Prisma
import bcrypt from 'bcryptjs';

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Usamos el adaptador de Prisma
  providers: [
    CredentialsProvider({
      // El nombre que se mostrará en el formulario de inicio de sesión (si usas uno autogenerado)
      name: 'Credentials',
      // `credentials` se usa para generar un formulario en la página de inicio de sesión.
      // Puedes especificar los campos que esperas que se envíen.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "tu_usuario" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null; // No se proporcionaron credenciales
        }

        // Busca al usuario en tu base de datos
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (user && user.password) {
          // Compara la contraseña proporcionada con la hasheada en la BD
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordValid) {
            // Cualquier objeto devuelto aquí se guardará en el `user` del token JWT
            // Devolvemos solo la información necesaria y segura
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              // No incluyas la contraseña aquí!
            };
          } else {
            // Contraseña incorrecta
            console.error('Intento de inicio de sesión fallido (contraseña incorrecta) para:', credentials.username);
            return null;
          }
        } else {
          // Usuario no encontrado
          console.error('Intento de inicio de sesión fallido (usuario no encontrado): ', credentials.username);
          return null;
        }
      }
    })
  ],
  // Configuración de la sesión
  session: {
    strategy: 'jwt', // Usaremos JWT para las sesiones
  },
  // Callbacks para personalizar el comportamiento
  callbacks: {
    async jwt({ token, user }) {
      // Cuando se crea el JWT por primera vez (después del authorize)
      // añadimos el ID de usuario y el username al token.
      if (user) {
        token.id = user.id;
        token.username = (user as any).username; // Hacemos type assertion si es necesario
      }
      return token;
    },
    async session({ session, token }) {
      // Añadimos el ID y el username del token a la sesión del cliente
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }; 