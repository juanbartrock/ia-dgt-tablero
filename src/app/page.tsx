export default function SimplePage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Tablero Director IA</h1>
        <p className="mb-4">Página de prueba para diagnosticar problemas de despliegue.</p>
        <div className="flex justify-between">
          <a 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ir a Login
          </a>
          <a 
            href="/dashboard" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Ir a Dashboard
          </a>
        </div>
      </div>
    </div>
  );
} 