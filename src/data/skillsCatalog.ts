export type SkillStatus = "installed" | "available";
export type SkillCategory = "CREADA" | "USER" | "NATIVA";

export interface SkillData {
  name: string;
  description: string;
  category: SkillCategory;
  status: SkillStatus;
  group: string;
}

export const INSTALLED_NAMES = [
  "advanced-excel-spreadsheet","amazon-competitor-analyzer","benchmarking-expert","brainstorming",
  "consulta-contexto","cronograma-consistente","excel-mcp-server","find-skills","firecrawl",
  "google-maps-extractor","google-news-monitor","grill-me","infinite-quality-loop",
  "interface-designing","karpathy-rules","loop-mode","mcp-client","metricool-browser-operator",
  "mirofish-lite","multi-agent-orchestrator","notebooklm-integration","orquestador","remotion","site-qa-auditor",
  "skill-builder","skill-creator","skill-from-masters","skill-installer",
  "superpowers","systematic-debugging","verification-before-completion","warpgrep",
  "web-research-assistant","writing-plans","x-article-publisher","youtube-clipper"
];

export const SKILLS_CATALOG: SkillData[] = [
  // Skills RR ALIADOS (29 CREADAS + 7 USER) — archivadas 263 NATIVAS genéricas
  { name:"advanced-excel-spreadsheet", description:"Manipulación avanzada de Excel: recupera archivos corruptos, dashboards automatizados", category:"CREADA", status:"installed", group:"Datos" },
  { name:"amazon-competitor-analyzer", description:"Analiza productos top de Amazon con insights accionables sobre vendedores líderes", category:"CREADA", status:"installed", group:"Investigación" },
  { name:"benchmarking-expert", description:"Inteligencia competitiva con frameworks Porter, SWOT, Blue Ocean", category:"CREADA", status:"installed", group:"Investigación" },
  { name:"consulta-contexto", description:"Fuerza preguntas estratégicas antes de ejecutar", category:"CREADA", status:"installed", group:"Planificación" },
  { name:"cronograma-consistente", description:"Cronogramas con aritmética de calendario real (Python)", category:"CREADA", status:"installed", group:"Planificación" },
  { name:"excel-mcp-server", description:"MCP Server que conecta IA a archivos Excel y Google Sheets: lee, escribe y formula", category:"CREADA", status:"installed", group:"Datos" },
  { name:"find-skills", description:"Descubre e instala skills del ecosistema de agentes", category:"CREADA", status:"installed", group:"Meta" },
  { name:"firecrawl", description:"Extracción web: convierte páginas en markdown estructurado", category:"CREADA", status:"installed", group:"Navegador" },
  { name:"google-maps-extractor", description:"Extrae datos de negocios de Google Maps: reviews, ratings", category:"CREADA", status:"installed", group:"Investigación" },
  { name:"google-news-monitor", description:"Monitoreo de Google News con extracción de artículos completos", category:"CREADA", status:"installed", group:"Investigación" },
  { name:"grill-me", description:"Valida planes cuestionando suposiciones y riesgos ocultos", category:"CREADA", status:"installed", group:"Planificación" },
  { name:"karpathy-rules", description:"Reglas de código de Karpathy: 144K stars, previene supuestos", category:"CREADA", status:"installed", group:"Desarrollo" },
  { name:"mcp-client", description:"270+ servidores MCP para conectar IA con herramientas externas", category:"CREADA", status:"installed", group:"Desarrollo" },
  { name:"metricool-browser-operator", description:"Opera Metricool desde el navegador como Social Media Manager", category:"CREADA", status:"installed", group:"Redes Sociales" },
  { name:"mirofish-lite", description:"Reportes diarios de predicción y análisis estratégico del workspace", category:"CREADA", status:"installed", group:"Meta" },
  { name:"multi-agent-orchestrator", description:"Coordina múltiples agentes IA con protocolo A2A Google/Salesforce", category:"CREADA", status:"installed", group:"Desarrollo" },
  { name:"notebooklm-integration", description:"Conecta IA a bases de conocimiento de Google NotebookLM", category:"CREADA", status:"installed", group:"Investigación" },
  { name:"orquestador", description:"Orquestador definitivo: descubre TODAS las skills, visualiza inventario completo, ejecuta solo las requeridas", category:"CREADA", status:"installed", group:"Meta" },
  { name:"remotion", description:"Convierte código React en videos de producción: charts animados, presentaciones", category:"CREADA", status:"installed", group:"Contenido" },
  { name:"site-qa-auditor", description:"Auditor QA automatizado para websites: 7 dimensiones, 25+ checks", category:"CREADA", status:"installed", group:"Calidad" },
  { name:"skill-builder", description:"Genera skills desde descripciones con triggers y scope", category:"CREADA", status:"installed", group:"Meta" },
  { name:"skill-creator", description:"Crea o actualiza skills para agentes (Kimi, Codex, Claude)", category:"CREADA", status:"installed", group:"Meta" },
  { name:"skill-from-masters", description:"Crea skills investigando expertos con búsqueda en 3 capas", category:"CREADA", status:"installed", group:"Meta" },
  { name:"skill-installer", description:"Instala skills desde GitHub o hubs, verifica firmas y actualiza", category:"CREADA", status:"installed", group:"Meta" },
  { name:"superpowers", description:"Metodología completa: Git worktrees, subagents, TDD, code review", category:"CREADA", status:"installed", group:"Desarrollo" },
  { name:"warpgrep", description:"Búsqueda de código con IA en bases de código grandes en 5s", category:"CREADA", status:"installed", group:"Desarrollo" },
  { name:"web-research-assistant", description:"Automatización de navegador real, evade CAPTCHA", category:"CREADA", status:"installed", group:"Investigación" },
  { name:"x-article-publisher", description:"Publica de Markdown a X (Twitter) Articles con formato perfecto", category:"CREADA", status:"installed", group:"Contenido" },
  { name:"youtube-clipper", description:"Extrae clips destacados de YouTube con análisis semántico y subtítulos", category:"CREADA", status:"installed", group:"Contenido" },

  // USER (7)
  { name:"interface-designing", description:"Diseño de interfaces estilo Linear/Vercel/Stripe", category:"USER", status:"installed", group:"Diseño" },
  { name:"systematic-debugging", description:"Debugging en 4 fases: Root Cause → Pattern → Hypothesis → Fix", category:"USER", status:"installed", group:"Desarrollo" },
  { name:"verification-before-completion", description:"Verificación con evidencia fresca antes de completar tareas", category:"USER", status:"installed", group:"Calidad" },
  { name:"brainstorming", description:"Explora ideas y conviértelas en diseños completos", category:"USER", status:"installed", group:"Planificación" },
  { name:"writing-plans", description:"Planes de implementación con tareas bite-sized y código completo", category:"USER", status:"installed", group:"Planificación" },
  { name:"infinite-quality-loop", description:"Bucle de calidad infinito: mejora iterativa antes de presentar", category:"USER", status:"installed", group:"Calidad" },
  { name:"loop-mode", description:"Ciclo planificación → ejecución → revisión → scoring → mejora", category:"USER", status:"installed", group:"Calidad" },

    // AI & Comunicación (7),,,,,,,

  // Analítica & Datos (19),,,,,,,,,,,,,,,,,,,

  // Automatización (5),,,,,

  // Branding & Diseño (7),,,,,,,

  // Científico (5),,,,,

  // Contenido & Escritura (20),,,,,,,,,,,,,,,,,,,,

  // Cumplimiento & Seguridad (1),

  // Desarrollo de Software (32),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

  // Educación & Aprendizaje (11),,,,,,,,,,,

  // Email & Comunicación (12),,,,,,,,,,,,

  // Finanzas & Inversión (36),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

  // Investigación (12),,,,,,,,,,

  // Navegador & Web Scraping (5),,,,,

  // Obsidian & Markdown (3),,,

  // Otros (13),,,,,,,,,,,,,

  // Planificación & PM (12),,,,,,,,,,,,

  // Presentaciones & Documentos (13),,,,,,,,,,,,,

  // Redes Sociales & Marketing (2),,

  // SEO & Web (7),,,,,,,

  // Skills & Meta (6),,,,,,

  // Startup & Negocios (18),,,,,,,,,,,,,,,,,,

  // Utilidades (11),,,,,,,,,,

  // Web App Building (9),,,,,,,,,
];

export const GROUPS = [...new Set(SKILLS_CATALOG.map(s => s.group))].sort();

export const STATS = {
  total: SKILLS_CATALOG.length,
  installed: SKILLS_CATALOG.filter(s => s.status === "installed").length,
  available: SKILLS_CATALOG.filter(s => s.status === "available").length,
  creadas: SKILLS_CATALOG.filter(s => s.category === "CREADA").length,
  user: SKILLS_CATALOG.filter(s => s.category === "USER").length,
  nativas: SKILLS_CATALOG.filter(s => s.category === "NATIVA").length,
};
