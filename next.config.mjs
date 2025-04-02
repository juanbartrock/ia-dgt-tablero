/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Opcional: si necesitas exponer variables de entorno públicas específicas de Next
  // env: {
  //   NEXT_PUBLIC_VARIABLE_NAME: process.env.NEXT_PUBLIC_VARIABLE_NAME,
  // },
  
  // Añadiendo esta configuración para ayudar con problemas de rutas
  async rewrites() {
    return {
      beforeFiles: [
        // Estas reglas se evalúan antes de que Next.js busque archivos en el sistema
        {
          source: '/',
          destination: '/app/page',
        },
      ],
    };
  },
};

export default nextConfig; 