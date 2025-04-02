# Tablero de Control - Equipo IA

Este es un proyecto Next.js para un dashboard destinado a Directores del área de IA, construido con:

*   **Framework**: Next.js (App Router)
*   **UI**: Tailwind CSS + Shadcn/ui
*   **Base de Datos**: PostgreSQL (preparado para Neon)
*   **ORM**: Prisma
*   **Autenticación**: NextAuth.js (Credentials Provider)
*   **Visualización**: Recharts

## Configuración para Despliegue en Vercel

1.  **Clonar el Repositorio**: Clona este repositorio a tu cuenta de GitHub/GitLab/Bitbucket.
2.  **Crear Proyecto en Vercel**: Importa el repositorio clonado en Vercel.
3.  **Configurar Variables de Entorno**: En la configuración del proyecto en Vercel, añade las siguientes variables de entorno:
    *   `DATABASE_URL`: La URL de conexión a tu base de datos PostgreSQL en Neon (la que incluye usuario, contraseña, host, puerto y nombre de la base de datos).
    *   `NEXTAUTH_SECRET`: Una cadena secreta segura para firmar los tokens JWT de NextAuth. Puedes generar una con `openssl rand -base64 32` o usar un generador online.
    *   Otras variables que puedas necesitar (ej. `NEXT_PUBLIC_SUPABASE_...` si las usas).
4.  **Configurar Build Command**: Vercel debería detectar Next.js automáticamente. El comando de build por defecto (`npm run build` o el que Vercel use) ejecutará `prisma generate && next build` gracias a la configuración en `package.json`.
5.  **Desplegar**: Vercel construirá y desplegará la aplicación.

## Preparación de la Base de Datos (Neon)

Antes o después del primer despliegue, necesitarás asegurarte de que el esquema de la base de datos esté aplicado:

1.  **Conectar Localmente a Neon (Opcional pero recomendado)**:
    *   Instala `prisma` y `node` localmente.
    *   Crea un archivo `.env` en la raíz de tu proyecto local (¡no lo subas a Git!) con tu `DATABASE_URL` de Neon.
    *   Ejecuta `npm install` (o `yarn` / `pnpm install`) localmente para instalar dependencias, incluyendo `@prisma/client`.
    *   Ejecuta `npx prisma db push` para sincronizar tu esquema Prisma con la base de datos Neon. **Advertencia**: `db push` es bueno para prototipos/desarrollo rápido, pero para producción se recomiendan migraciones (`prisma migrate dev`, `prisma migrate deploy`).
2.  **Crear Migraciones (Método Preferido)**:
    *   En lugar de `db push`, usa `npx prisma migrate dev --name nombre-migracion-inicial` localmente (conectado a Neon via `.env`). Esto generará archivos SQL en `prisma/migrations`.
    *   Vercel *podría* tener integraciones para ejecutar `prisma migrate deploy` automáticamente durante el build si detecta la carpeta `prisma/migrations`. Revisa la documentación de Vercel y Prisma sobre despliegues.
    *   Si no, puede que necesites ejecutar `npx prisma migrate deploy` manualmente desde un entorno que tenga acceso a la BD de producción después del despliegue.

## Crear Usuario Inicial

Necesitarás al menos un usuario en la tabla `users` para poder iniciar sesión. La contraseña debe estar hasheada con `bcryptjs`.

Puedes crear un script simple de Node.js para esto (ej. `scripts/seed.ts`) o insertar el usuario manualmente usando alguna herramienta de base de datos conectada a Neon.

**Ejemplo de script (requiere `ts-node` o similar para ejecutar):**

```typescript
// scripts/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'director_admin'; // O el username que quieras
  const plainPassword = 'tu_contraseña_segura'; // ¡Usa una contraseña segura!
  const name = 'Nombre Apellido Director';

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 es el número de rondas de sal

  // Crear el usuario
  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      name: name,
      // Añade otros campos si son necesarios
    },
  });
  console.log(`Usuario creado: ${user.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Para ejecutarlo (después de `npm install` y configurar `.env` localmente):
`npx ts-node scripts/seed.ts`

## Desarrollo Local (con Docker Compose)

Si prefieres trabajar localmente:

1.  **Instalar Docker y Docker Compose**.
2.  **Crear archivo `.env`**: Copia las variables de `docker-compose.yml` (como `DATABASE_URL=postgresql://director_user:PON_TU_PASSWORD_SEGURA_AQUI@db:5432/tablero_db`, `NEXTAUTH_SECRET`, etc.) a un archivo `.env` en la raíz.
3.  **Construir e Iniciar Contenedores**: Ejecuta `docker-compose up --build -d`.
4.  **Aplicar Esquema Prisma**: Una vez los contenedores estén corriendo, ejecuta el comando de Prisma *dentro* del contenedor de la app:
    `docker-compose exec app npx prisma db push` (o `migrate dev`)
5.  **Acceder a la App**: Abre `http://localhost:3000` en tu navegador.
6.  **Ver Logs**: `docker-compose logs -f app` o `docker-compose logs -f db`.
7.  **Detener Contenedores**: `docker-compose down`.

## Próximos Pasos

*   Implementar los componentes visuales del dashboard en `src/components/dashboard/`.
*   Añadir los componentes específicos de Shadcn/ui necesarios (ej. `npx shadcn-ui@latest add card button input ...`).
*   Implementar la lógica de obtención de datos en `src/app/dashboard/page.tsx` usando Prisma.
*   Estilizar la página de login `src/app/login/page.tsx` con componentes Shadcn/ui.
*   Implementar las funcionalidades específicas (crear notificación, cambiar contraseña, etc.). 