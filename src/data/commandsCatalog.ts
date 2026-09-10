export interface Command {
  id: string;
  name: string;
  description: string;
  icon: string;
  keywords: string[];
  action: "navigate" | "filter" | "search" | "external" | "info";
  target?: string;
  shortcut?: string;
}

export const commandsCatalog: Command[] = [
  { id: "reports", name: "Reportes", description: "Ir a la sección de reportes", icon: "📊", keywords: ["reporte", "predicciones", "estrategico"], action: "navigate", target: "mirofish-reports", shortcut: "/reportes" },
  { id: "skills", name: "Skills Catalog", description: "Ir al catálogo de skills", icon: "📦", keywords: ["skills", "catalogo", "habilidades"], action: "navigate", target: "skills-catalog", shortcut: "/skills" },
  { id: "apps", name: "Aplicaciones", description: "Ir a las aplicaciones corporativas", icon: "🏢", keywords: ["apps", "aplicaciones", "company", "cotizador"], action: "navigate", target: "company-hub", shortcut: "/apps" },
  { id: "search", name: "Buscar", description: "Abrir búsqueda global", icon: "🔍", keywords: ["buscar", "search", "encontrar"], action: "search", shortcut: "/buscar" },
  { id: "refresh", name: "Refrescar", description: "Forzar actualización de todos los widgets", icon: "🔄", keywords: ["refrescar", "actualizar", "refresh"], action: "info" },
  { id: "stats", name: "Estadísticas", description: "Mostrar estadísticas del dashboard", icon: "📈", keywords: ["estadisticas", "stats", "metricas"], action: "navigate", target: "business-metrics" },
  { id: "calendar", name: "Calendario", description: "Ir al calendario", icon: "📅", keywords: ["calendario", "fecha", "evento"], action: "navigate", target: "calendar-widget" },
  { id: "tasks", name: "Tareas", description: "Ver tareas programadas", icon: "⚙️", keywords: ["tareas", "programadas", "tasks"], action: "navigate", target: "task-monitor" },
  { id: "theme", name: "Cambiar Tema", description: "Alternar entre modo oscuro y claro", icon: "🌙", keywords: ["tema", "dark", "light", "oscuro", "claro"], action: "info" },
  { id: "help", name: "Ayuda", description: "Mostrar comandos disponibles", icon: "❓", keywords: ["ayuda", "help", "comandos"], action: "info" },
];
