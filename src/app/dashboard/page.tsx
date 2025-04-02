import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Importaciones placeholder para componentes del dashboard
// import Header from "@/components/dashboard/Header";
// import NotificationSection from "@/components/dashboard/NotificationSection";
// import TaskSummary from "@/components/dashboard/TaskSummary";
// import HighlightedTasks from "@/components/dashboard/HighlightedTasks";
// import RecentActivity from "@/components/dashboard/RecentActivity";
// import Footer from "@/components/dashboard/Footer"; // Podría incluir el Last Update

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Si no hay sesión, redirige a login
  if (!session) {
    redirect("/login");
  }

  // Aquí iría la lógica para obtener los datos del dashboard desde la BD
  // const notifications = await getActiveNotifications();
  // const taskStats = await getTaskStats();
  // const highlightedTasks = await getHighlightedTasks();
  // const recentActivity = await getRecentActivity();
  // const lastTaskUpdate = await getLastTaskUpdateTimestamp();

  // Placeholder para el contenido del dashboard
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header user={session.user} /> */}
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Director IA</h1>

        {/* Aquí se renderizarían los componentes reales del dashboard */} 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna Principal (o sección superior) */} 
          <div className="lg:col-span-2 space-y-6">
            {/* <NotificationSection notifications={notifications} /> */} 
            <div className="bg-yellow-100 p-4 rounded border border-yellow-300">Notificaciones Activas (Placeholder)</div>
            {/* <TaskSummary stats={taskStats} /> */} 
            <div className="bg-blue-100 p-4 rounded border border-blue-300">Resumen Tareas (Placeholder)</div>
          </div>

          {/* Columna Lateral (o sección inferior) */} 
          <div className="lg:col-span-1 space-y-6">
            {/* <HighlightedTasks tasks={highlightedTasks} /> */} 
            <div className="bg-green-100 p-4 rounded border border-green-300">Tareas Destacadas (Placeholder)</div>
            {/* <RecentActivity activity={recentActivity} /> */} 
            <div className="bg-purple-100 p-4 rounded border border-purple-300">Actividad Reciente (Placeholder)</div>
          </div>
        </div>

        {/* Indicador de Última Actualización (ejemplo) */} 
        <div className="mt-8 text-sm text-gray-500">
          {/* Estado de tareas actualizado por última vez: {lastTaskUpdate} (Placeholder) */}
          Estado de tareas actualizado por última vez: (Placeholder)
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
} 