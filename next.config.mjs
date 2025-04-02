/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Opcional: si necesitas exponer variables de entorno públicas específicas de Next
  // env: {
  //   NEXT_PUBLIC_VARIABLE_NAME: process.env.NEXT_PUBLIC_VARIABLE_NAME,
  // },
  
  // Reescribimos la ruta raíz a una API que sabemos que funciona
  async redirects() {
    return [
      {
        source: '/',
        destination: '/api/root',
        permanent: false,
      },
    ];
  },

  // Cambiamos la configuración de rewrites para que no interfiera
  async rewrites() {
    return [];
  },
};

export default nextConfig; 