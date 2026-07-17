export interface SearchItem {
  id: string;
  title: string;
  description: string;
  type: "widget" | "skill" | "section" | "app";
  section: string;
  targetId: string;
  icon: string;
  sectionId?: string;
}

export const searchIndex: SearchItem[] = [
  // Comando
  { id: "business-metrics", title: "Métricas del Negocio", description: "KPIs en tiempo real del dashboard", type: "widget", section: "COMANDO", targetId: "business-metrics", icon: "📈" },
  { id: "sales-pipeline", title: "Pipeline de Ventas", description: "Wuunder, Real Seguros y prospectos activos", type: "widget", section: "COMANDO", targetId: "sales-pipeline", icon: "💰" },
  { id: "financial-health", title: "Salud Financiera", description: "Capital, runway y costos operativos", type: "widget", section: "COMANDO", targetId: "financial-health", icon: "🏦" },

  // Widgets de Reportes
  { id: "mirofish-reports", title: "Predicciones MiroFish", description: "Reportes de predicciones con IA para los próximos 7 días", type: "widget", section: "REPORTES", targetId: "mirofish-reports", icon: "📊" },
  { id: "estrategia", title: "Optimización Estratégica", description: "Reporte estratégico contra la meta 5-year de RR ALIADOS", type: "widget", section: "REPORTES", targetId: "estrategia", icon: "🎯" },

  // Aplicaciones
  { id: "company-hub", title: "Company Hub", description: "Hub corporativo de RR ALIADOS", type: "app", section: "APLICACIONES", targetId: "company-hub", icon: "🏢" },
  { id: "cotizador", title: "RR Cotizador", description: "Plan maestro y cotizaciones", type: "app", section: "APLICACIONES", targetId: "cotizador", icon: "🧮" },
  { id: "altruismo", title: "Altruismo", description: "Herramientas web sin anuncios", type: "app", section: "APLICACIONES", targetId: "altruismo", icon: "🤝" },
  { id: "skills-hub-app", title: "RR Skills Hub", description: "Catálogo de skills de RR ALIADOS", type: "app", section: "APLICACIONES", targetId: "skills-hub-app", icon: "📚" },
  { id: "adquisicion", title: "Dashboard de Adquisición", description: "Panel de adquisición de clientes", type: "app", section: "APLICACIONES", targetId: "adquisicion", icon: "📈" },
  { id: "dashweb", title: "DashWeb Core", description: "Plataforma ERP/CRM interna", type: "app", section: "APLICACIONES", targetId: "dashweb", icon: "🔧" },

  // Skills Catalog
  { id: "skills-catalog", title: "Skills Catalog", description: "Catálogo completo de 35+ skills de IA", type: "section", section: "CATÁLOGO", targetId: "skills-catalog", icon: "📦" },

  // Data & Analytics
  { id: "excel-widget", title: "Excel Widget", description: "Herramientas avanzadas de Excel y Google Sheets", type: "widget", section: "DATA & ANALYTICS", targetId: "excel-widget", icon: "📊", sectionId: "data-analytics" },
  { id: "google-news", title: "Google News", description: "Monitoreo de noticias en Google News", type: "widget", section: "DATA & ANALYTICS", targetId: "google-news", icon: "📰", sectionId: "data-analytics" },
  { id: "google-maps", title: "Google Maps", description: "Extracción de datos de Google Maps", type: "widget", section: "DATA & ANALYTICS", targetId: "google-maps", icon: "🗺️", sectionId: "data-analytics" },
  { id: "amazon-analyzer", title: "Amazon Analyzer", description: "Análisis de competidores en Amazon", type: "widget", section: "DATA & ANALYTICS", targetId: "amazon-analyzer", icon: "🛒", sectionId: "data-analytics" },
  { id: "metricool", title: "Metricool", description: "Gestión de redes sociales", type: "widget", section: "DATA & ANALYTICS", targetId: "metricool", icon: "📱", sectionId: "data-analytics" },

  // Research
  { id: "web-research", title: "Web Research", description: "Asistente de investigación web con navegador real", type: "widget", section: "RESEARCH", targetId: "web-research", icon: "🔍", sectionId: "research" },
  { id: "firecrawl", title: "Firecrawl", description: "Scraping web profesional", type: "widget", section: "RESEARCH", targetId: "firecrawl", icon: "🕷️", sectionId: "research" },
  { id: "notebooklm", title: "NotebookLM", description: "Integración con bases de conocimiento", type: "widget", section: "RESEARCH", targetId: "notebooklm", icon: "📓", sectionId: "research" },

  // Dev & QA
  { id: "karpathy-rules", title: "Karpathy Rules", description: "Reglas de código de Andrej Karpathy", type: "widget", section: "DEV & QA", targetId: "karpathy-rules", icon: "📏", sectionId: "dev-qa" },
  { id: "debugging", title: "Debugging", description: "Metodología de debugging sistemático", type: "widget", section: "DEV & QA", targetId: "debugging", icon: "🐛", sectionId: "dev-qa" },
  { id: "verification", title: "Verification", description: "Verificación antes de completar", type: "widget", section: "DEV & QA", targetId: "verification", icon: "✅", sectionId: "dev-qa" },
  { id: "qa-auditor", title: "QA Auditor", description: "Auditoría de QA para sitios web", type: "widget", section: "DEV & QA", targetId: "qa-auditor", icon: "🔎", sectionId: "dev-qa" },
  { id: "loop-mode", title: "Loop Mode", description: "Ciclo iterativo de planificación y ejecución", type: "widget", section: "DEV & QA", targetId: "loop-mode", icon: "🔄", sectionId: "dev-qa" },
  { id: "quality-loop", title: "Quality Loop", description: "Loop de calidad infinito", type: "widget", section: "DEV & QA", targetId: "quality-loop", icon: "♾️", sectionId: "dev-qa" },

  // Content
  { id: "x-publisher", title: "X Publisher", description: "Publicación de artículos en X (Twitter)", type: "widget", section: "CONTENT", targetId: "x-publisher", icon: "🐦", sectionId: "content" },
  { id: "youtube-clip", title: "YouTube Clip", description: "Extracción de clips destacados de YouTube", type: "widget", section: "CONTENT", targetId: "youtube-clip", icon: "🎬", sectionId: "content" },
  { id: "remotion", title: "Remotion", description: "Generación de videos con React", type: "widget", section: "CONTENT", targetId: "remotion", icon: "🎥", sectionId: "content" },
  { id: "cronograma", title: "Cronograma", description: "Gráfico de Gantt para timelines", type: "widget", section: "CONTENT", targetId: "cronograma", icon: "📅", sectionId: "content" },

  // Strategy
  { id: "brainstorming", title: "Brainstorming", description: "Framework de lluvia de ideas", type: "widget", section: "STRATEGY", targetId: "brainstorming", icon: "💡", sectionId: "strategy" },
  { id: "grill-me", title: "Grill-Me", description: "Validación de planes por preguntas", type: "widget", section: "STRATEGY", targetId: "grill-me", icon: "🔥", sectionId: "strategy" },
  { id: "writing-plans", title: "Writing Plans", description: "Creación de planes de implementación", type: "widget", section: "STRATEGY", targetId: "writing-plans", icon: "📝", sectionId: "strategy" },
  { id: "benchmarking", title: "Benchmarking", description: "Análisis competitivo de mercado", type: "widget", section: "STRATEGY", targetId: "benchmarking", icon: "📊", sectionId: "strategy" },
  { id: "interface-designing", title: "Interface Designing", description: "Diseño de interfaces estilo Linear/Vercel", type: "widget", section: "STRATEGY", targetId: "interface-designing", icon: "🎨", sectionId: "strategy" },

  // Meta / Skills
  { id: "find-skills", title: "Find Skills", description: "Descubrir skills del ecosistema", type: "widget", section: "META", targetId: "find-skills", icon: "🔍", sectionId: "meta-skills" },
  { id: "skill-builder", title: "Skill Builder", description: "Construir skills desde descripciones", type: "widget", section: "META", targetId: "skill-builder", icon: "🔨", sectionId: "meta-skills" },
  { id: "skill-creator", title: "Skill Creator", description: "Crear skills con triggers y alcance", type: "widget", section: "META", targetId: "skill-creator", icon: "✨", sectionId: "meta-skills" },
  { id: "masters", title: "Masters", description: "Crear skills investigando expertos", type: "widget", section: "META", targetId: "masters", icon: "🎓", sectionId: "meta-skills" },
  { id: "installer", title: "Installer", description: "Instalar skills del ecosistema", type: "widget", section: "META", targetId: "installer", icon: "📦", sectionId: "meta-skills" },
  { id: "mcp", title: "MCP", description: "Model Context Protocol client", type: "widget", section: "META", targetId: "mcp", icon: "🔌", sectionId: "meta-skills" },
  { id: "a2a", title: "A2A", description: "Orquestación Agent-to-Agent", type: "widget", section: "META", targetId: "a2a", icon: "🤝", sectionId: "meta-skills" },
  { id: "consulta", title: "Consulta Contexto", description: "Consulta de contexto empresarial", type: "widget", section: "META", targetId: "consulta", icon: "💬", sectionId: "meta-skills" },
  { id: "superpowers", title: "Superpowers", description: "Metodología completa de desarrollo", type: "widget", section: "META", targetId: "superpowers", icon: "💪", sectionId: "meta-skills" },
  { id: "orchestrator", title: "Skill Orchestrator", description: "Orquestación de múltiples skills", type: "widget", section: "META", targetId: "orchestrator", icon: "🧠", sectionId: "meta-skills" },
  { id: "warpgrep", title: "Warpgrep", description: "Búsqueda de código con IA", type: "widget", section: "META", targetId: "warpgrep", icon: "🔎", sectionId: "meta-skills" },
];

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  targetId?: string;
  sectionId?: string;
}

export const quickActions: QuickAction[] = [
  {
    id: "wuunder-pipeline",
    title: "Pipeline Wuunder",
    description: "Ir al deal #1 — deadline Jul 2026",
    icon: "🔥",
    targetId: "sales-pipeline",
  },
  {
    id: "mirofish-report",
    title: "Último reporte IA",
    description: "Predicciones MiroFish-Lite",
    icon: "📊",
    targetId: "mirofish-reports",
  },
  {
    id: "cotizador",
    title: "RR Cotizador",
    description: "Abrir cotizador en nueva pestaña",
    icon: "🧮",
    href: "https://rr-kotizador.vercel.app/",
  },
  {
    id: "deploy",
    title: "Deploy producción",
    description: "vercel deploy --prod --yes",
    icon: "🚀",
    href: "https://vercel.com/dashboard",
  },
  {
    id: "skills-sync",
    title: "Skills Catalog",
    description: "Verificar 36 skills instaladas",
    icon: "📦",
    targetId: "skills-catalog",
  },
];
