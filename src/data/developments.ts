export interface Development {
  title: string;
  description: string;
  url: string;
  number: string;
}

export type OpsDevelopmentStatus = "core" | "consolidar" | "soporte" | "retirar";
export type OpsDevelopmentArea = "Finanzas" | "Comercial" | "Contenido" | "Documentos" | "Automatización";

export interface OpsDevelopment {
  title: string;
  shortName: string;
  area: OpsDevelopmentArea;
  status: OpsDevelopmentStatus;
  url: string;
  repo?: string;
  location?: string;
  dataSource: string;
  purpose: string;
  decision: string;
  nextStep: string;
  number: string;
}

export const DEVELOPMENTS: Development[] = [
  { title: "RR Finanzas", description: "Caja, runway, cuentas de cobro y proyecciones conectadas.", url: "/login?next=%2Fops%2Ffinanzas", number: "01" },
  { title: "RR Kotizador", description: "Cotizaciones, precios dinámicos y cronogramas automáticos.", url: "https://rr-kotizador.vercel.app/", number: "02" },
  { title: "DashWeb Core", description: "ERP/CRM para proyectos, tareas, RRHH, facturación y OKRs.", url: "https://dashweb-core-frontend-beta.up.railway.app/login", number: "03" },
  { title: "SaaS Vertical Hub", description: "CRM y demos personalizadas para verticales de negocio.", url: "https://rr-saas-vertical.vercel.app/", number: "04" },
  { title: "Altruismo", description: "Suite de herramientas web sin anuncios para la comunidad.", url: "https://altruismo-web.vercel.app/es", number: "05" },
];

export const OPS_DEVELOPMENTS: OpsDevelopment[] = [
  {
    title: "RR Finanzas",
    shortName: "Finanzas",
    area: "Finanzas",
    status: "core",
    url: "/ops/finanzas",
    repo: "DEADKISS0/rr-finanzas",
    location: "dashweb/rr-finanzas",
    dataSource: "Supabase RR + módulos internos de cuentas de cobro",
    purpose: "Centro financiero vivo: caja, runway, cuentas de cobro, documentos y operación contable.",
    decision: "Queda como fuente principal de finanzas. Todo lo financiero debe entrar por aquí o apuntar aquí.",
    nextStep: "Absorber funciones útiles de rr-finanzas-dashboard y chatbot/finanzas_app.",
    number: "01",
  },
  {
    title: "RR Kotizador",
    shortName: "Kotizador",
    area: "Comercial",
    status: "consolidar",
    url: "https://rr-kotizador.vercel.app/",
    repo: "DEADKISS0/rr-kotizador",
    location: "rr_aliados/08_Dev/Proyectos/RR_Kotizador",
    dataSource: "Precios y cronogramas desde la documentación financiera de RR",
    purpose: "Cotizar servicios, paquetes y cronogramas de pago sin armar propuestas manuales.",
    decision: "Debe entrar al flujo interno como módulo comercial, no vivir como herramienta suelta.",
    nextStep: "Crear acceso desde /ops y migrar reglas de precio a una fuente versionada.",
    number: "02",
  },
  {
    title: "RR Finanzas Dashboard",
    shortName: "Finanzas dashboard",
    area: "Finanzas",
    status: "retirar",
    url: "https://rr-finanzas-dashboard.vercel.app/",
    repo: "DEADKISS0/rr-finanzas-dashboard",
    dataSource: "Legacy por validar",
    purpose: "Dashboard financiero anterior o paralelo.",
    decision: "No debe competir con RR Finanzas. Se conserva solo como referencia temporal.",
    nextStep: "Auditar si tiene datos o vistas únicas; si no, archivar y redirigir a RR Finanzas.",
    number: "03",
  },
  {
    title: "chatbot/finanzas_app",
    shortName: "Finanzas app vieja",
    area: "Finanzas",
    status: "retirar",
    url: "/ops/finanzas",
    location: "chatbot/finanzas_app",
    dataSource: "Código local legacy",
    purpose: "Primera app financiera dentro del paquete del chatbot.",
    decision: "No debe vivir dentro de chatbot. Sus funciones útiles pasan a RR Finanzas.",
    nextStep: "Comparar pantallas/endpoints contra RR Finanzas y archivar la carpeta si no aporta nada nuevo.",
    number: "04",
  },
  {
    title: "RR Content Hub",
    shortName: "Content Hub",
    area: "Contenido",
    status: "core",
    url: "https://rr-content-hub.vercel.app/",
    repo: "DEADKISS0/rr-content-hub",
    dataSource: "Supabase compartido con tablas rr_hub_*",
    purpose: "Ideación, aprobación, producción y publicación de contenido por cliente.",
    decision: "Queda como producto operativo independiente, conectado desde Mega Dashboard.",
    nextStep: "Añadir health check, owner y estado de proyectos en /ops.",
    number: "05",
  },
  {
    title: "RR Precontratos",
    shortName: "Precontratos",
    area: "Documentos",
    status: "core",
    url: "https://rr-precontratos.vercel.app/",
    repo: "DEADKISS0/rr-precontratos",
    dataSource: "Artefactos HTML estáticos + rr-static como soporte",
    purpose: "Precontratos y propuestas publicables por cliente con acceso controlado.",
    decision: "Queda separado porque publica artefactos de cliente y debe ser estable.",
    nextStep: "Crear índice interno de precontratos emitidos y estado de cada cliente.",
    number: "06",
  },
  {
    title: "RR Commander Bot",
    shortName: "Commander Bot",
    area: "Automatización",
    status: "core",
    url: "https://github.com/DEADKISS0/rr-commander-bot",
    repo: "DEADKISS0/rr-commander-bot",
    location: "chatbot/bot_telegram",
    dataSource: "Supabase + knowledge base + integraciones Telegram/Google",
    purpose: "Automatizaciones, comandos, sincronizaciones y operación conversacional de RR.",
    decision: "Queda como servicio separado; Mega Dashboard debe mostrar estado, comandos y bitácora.",
    nextStep: "Exponer estado de Railway, últimas sincronizaciones y comandos críticos dentro de /ops.",
    number: "07",
  },
];

export const REMOVED_FROM_INTERNAL: Array<{ title: string; reason: string; replacement: string }> = [
  {
    title: "RR Skills Hub",
    reason: "Duplica el catálogo de skills que debe vivir como sección del Mega Dashboard, no como producto separado.",
    replacement: "Sección interna de capacidades/automatización dentro de /ops.",
  },
  {
    title: "Primer Contacto Web",
    reason: "El flujo de captura de prospectos debe entrar por CRM/Kotizador/Mega Dashboard para no partir el pipeline.",
    replacement: "Módulo comercial del Mega Dashboard + RR Kotizador.",
  },
];
