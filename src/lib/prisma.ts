import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Crear un cliente mock que no haga nada en caso de que queramos saltar la inicialización
const mockPrismaClient = new Proxy({} as PrismaClient, {
  get: () => async () => { return { id: 'mock-data' }; }
});

// Verificar si debemos saltarnos la inicialización de Prisma
const shouldSkipPrismaInit = process.env.SKIP_PRISMA_INIT === 'true';

export const prisma = 
  shouldSkipPrismaInit 
    ? mockPrismaClient 
    : global.prisma ||
      new PrismaClient({
        // Opcional: Configuraciones de logging para desarrollo
        // log: ['query', 'info', 'warn', 'error'],
      });

if (process.env.NODE_ENV !== 'production' && !shouldSkipPrismaInit) {
  global.prisma = prisma as PrismaClient;
} 