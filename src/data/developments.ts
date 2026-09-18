export interface Development {
  title: string;
  description: string;
  url: string;
  number: string;
}

export type OpsDevelopmentStatus = "core" | "consolidar" | "soporte" | "retirar";
export type OpsDevelopmentArea =
  | "Centro"
  | "Finanzas"
  | "Comercial"
  | "Contenido"
  | "Documentos"
  | "Automatización"
  | "Producto"
  | "Clientes"
  | "Archivo";

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
  {
    title: "Mega Dashboard",
    description: "Centro público e interno de RR: operación, desarrollos, clientes y control.",
    url: "/login?next=%2Fops",
    number: "01",
  },
  {
    title: "RR Finanzas",
    description: "Caja, runway, cuentas de cobro y proyecciones conectadas.",
    url: "/login?next=%2Fops%2Ffinanzas",
    number: "02",
  },
  {
    title: "RR Content Hub",
    description: "Sistema multi-cliente para idear, aprobar y producir contenido.",
    url: "https://rr-content-hub.vercel.app/",
    number: "03",
  },
  {
    title: "RR Precontratos",
    description: "Precontratos y propuestas publicables con estructura controlada.",
    url: "https://rr-precontratos.vercel.app/",
    number: "04",
  },
  {
    title: "Ruleta de marca",
    description: "Producto SaaS white-label para promos interactivas tipo Match Numa.",
    url: "https://ruleta-de-marca.vercel.app/",
    number: "05",
  },
  {
    title: "Altruismo",
    description: "Suite de herramientas web sin anuncios, ahora con acceso controlado y marcado RR.",
    url: "https://altruismo-web.vercel.app/es",
    number: "06",
  },
];

export const OPS_DEVELOPMENTS: OpsDevelopment[] = [
  {
    title: "RR ALIADOS Mega Dashboard",
    shortName: "Mega Dashboard",
    area: "Centro",
    status: "core",
    url: "/ops",
    repo: "DEADKISS0/rr-aliados-mega-dashboard",
    dataSource: "Supabase RR + data editorial versionada + APIs internas",
    purpose: "Centro de mando público e interno: clientes, desarrollos, finanzas, documentación y operación.",
    decision: "Es la puerta única. No se duplica con landing corporativa ni dashboards viejos.",
    nextStep: "Convertir esta matriz en fuente operativa viva y conectar health checks por app.",
    owner: "RR",
    updated: "2026-09-17",
    number: "01",
  },
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
    nextStep: "Absorber lo útil de rr-finanzas-dashboard y chatbot/finanzas_app.",
    owner: "Finanzas RR",
    updated: "2026-09-15",
    number: "02",
  },
  {
    title: "RR Content Hub",
    shortName: "Content Hub",
    area: "Contenido",
    status: "core",
    url: "https://rr-content-hub.vercel.app/",
    repo: "DEADKISS0/rr-content-hub",
    dataSource: "Supabase compartido con tablas aisladas rr_hub_*",
    purpose: "Ideación, aprobación, producción y publicación de contenido por cliente.",
    decision: "Queda como producto operativo independiente, conectado desde Mega Dashboard.",
    nextStep: "Añadir health check, owner y estado de proyectos en /ops.",
    owner: "Contenido RR",
    updated: "2026-09-12",
    number: "03",
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
    nextStep: "Crear índice interno de precontratos emitidos, cliente, fecha y estado.",
    owner: "Comercial RR",
    updated: "2026-09-17",
    number: "04",
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
    owner: "RR Bot",
    updated: "2026-09-10",
    number: "05",
  },
  {
    title: "RR Aliados Bots",
    shortName: "Bots",
    area: "Automatización",
    status: "soporte",
    url: "https://rr-aliados-bots.vercel.app",
    repo: "DEADKISS0/rr-aliados-bots",
    dataSource: "Repo nuevo + Vercel rr-aliados-bots",
    purpose: "Superficie nueva para bots/automatizaciones de RR.",
    decision: "Se reconoce como soporte reciente; falta auditar alcance antes de declararlo core.",
    nextStep: "Leer repo, definir si sustituye parte de Commander Bot o solo publica una UI auxiliar.",
    owner: "RR Bot",
    updated: "2026-09-17",
    number: "06",
  },
  {
    title: "RR Kotizador",
    shortName: "Kotizador",
    area: "Comercial",
    status: "consolidar",
    url: "https://rr-kotizador.vercel.app/",
    repo: "DEADKISS0/rr-kotizador",
    location: "rr_aliados/08_Dev/Proyectos/RR_Kotizador",
    dataSource: "Precios y cronogramas desde documentación financiera RR",
    purpose: "Cotizar servicios, paquetes y cronogramas de pago sin armar propuestas manuales.",
    decision: "Debe entrar al flujo interno como módulo comercial, no vivir como herramienta suelta.",
    nextStep: "Migrar reglas de precio a fuente versionada y enlazarlo a precontratos.",
    owner: "Comercial RR",
    updated: "2026-07-16",
    number: "07",
  },
  {
    title: "Ruleta de marca / Match Numa",
    shortName: "Ruleta",
    area: "Producto",
    status: "core",
    url: "https://ruleta-de-marca.vercel.app/",
    repo: "DEADKISS0/ruleta-de-marca",
    location: "match_numa/plataforma-ruletas",
    dataSource: "Supabase metrik-lab con tablas wheel_*",
    purpose: "SaaS white-label de ruletas de premios para locales y campañas.",
    decision: "Sigue como producto separado mientras tenga cliente/demo real.",
    nextStep: "Completar auditoría de diseño, auth y datos antes de venderlo como producto activo.",
    owner: "Producto RR",
    updated: "2026-09-05",
    number: "08",
  },
  {
    title: "rr-finanzas-dashboard",
    shortName: "Finanzas dashboard",
    area: "Finanzas",
    status: "retirar",
    url: "https://rr-finanzas-dashboard.vercel.app/",
    repo: "DEADKISS0/rr-finanzas-dashboard",
    dataSource: "Legacy por validar",
    purpose: "Dashboard financiero anterior o paralelo.",
    decision: "No debe competir con RR Finanzas. Se conserva solo como referencia temporal.",
    nextStep: "Auditar vistas únicas; si no hay nada único, archivar y redirigir a RR Finanzas.",
    owner: "Finanzas RR",
    updated: "2026-09-10",
    number: "09",
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
    nextStep: "Comparar pantallas/endpoints contra RR Finanzas y archivar si no aporta nada nuevo.",
    owner: "Finanzas RR",
    updated: "2026-09-16",
    number: "10",
  },
  {
    title: "metrik-lab",
    shortName: "Metrik Lab",
    area: "Producto",
    status: "soporte",
    url: "https://metrik-lab.vercel.app",
    repo: "DEADKISS0/metrik-lab",
    dataSource: "Supabase metrik-lab / app histórica",
    purpose: "Proyecto base/soporte que hoy hospeda parte del backend de la ruleta.",
    decision: "No se muestra como producto RR; se documenta como infraestructura/legacy.",
    nextStep: "Separar qué es app usable y qué es solo backend compartido.",
    owner: "Producto RR",
    updated: "2026-08-31",
    number: "11",
  },
  {
    title: "RR Static",
    shortName: "Static",
    area: "Documentos",
    status: "soporte",
    url: "https://rr-static.vercel.app",
    dataSource: "Archivos estáticos publicados",
    purpose: "Hosting auxiliar para artefactos estáticos.",
    decision: "No es producto; es soporte técnico.",
    nextStep: "Crear índice de artefactos que dependen de este proyecto.",
    owner: "RR",
    updated: "2026-09-14",
    number: "12",
  },
  {
    title: "BOGA Pitch",
    shortName: "BOGA Pitch",
    area: "Clientes",
    status: "archivo",
    url: "https://boga-pitch.vercel.app",
    repo: "DEADKISS0/boga-pitch",
    dataSource: "HTML estático de pitch",
    purpose: "Artefacto puntual de cliente/propuesta BOGA.",
    decision: "Mantener como entregable de cliente, no como desarrollo core.",
    nextStep: "Mover su visibilidad a ficha de cliente BOGA.",
    owner: "Cliente BOGA",
    updated: "2026-09-10",
    number: "13",
  },
  {
    title: "RR SaaS Vertical",
    shortName: "SaaS Vertical",
    area: "Archivo",
    status: "archivo",
    url: "https://rr-saas-vertical-rr-aliados0.vercel.app",
    repo: "DEADKISS0/rr-saas-vertical",
    dataSource: "Supabase propio según repo",
    purpose: "Experimento de CRM y demos para verticales.",
    decision: "Congelado hasta decidir si revive como línea comercial.",
    nextStep: "Extraer aprendizajes útiles y ocultarlo del flujo diario.",
    owner: "RR",
    updated: "2026-08-31",
    number: "14",
  },
  {
    title: "RR Skills Hub",
    shortName: "Skills Hub",
    area: "Clientes",
    status: "retirar",
    url: "https://rr-skills-hub.vercel.app",
    repo: "DEADKISS0/rr-skills-hub",
    dataSource: "Catálogo de skills con asistente",
    purpose: "Catalogo de skills con asistente",
    decision: "Duplica capacidades que deben vivir dentro del Mega Dashboard.",
    nextStep: "Extraer lo util a automatizacion y archivar.",
    owner: "RR",
    updated: "2026-09-10",
    number: "15",
  },
  {
    title: "Primer Contacto Web",
    shortName: "Primer Contacto",
    area: "Clientes",
    status: "retirar",
    url: "https://primer-contacto-web.vercel.app",
    repo: "DEADKISS0/primer-contacto-web",
    dataSource: "Captura de prospectos y entrevistas",
    purpose: "Flujo de captura de prospectos y entrevistas",
    decision: "Parte el pipeline comercial.",
    nextStep: "Migrar preguntas utiles a CRM/Kotizador/Mega Dashboard.",
    owner: "RR",
    updated: "2026-09-16",
    number: "16",
  },
];

export const REMOVED_FROM_INTERNAL: Array<{ title: string; reason: string; replacement: string }> = [
  {
    title: "RR Skills Hub",
    reason: "Duplica el catálogo de skills que debe vivir dentro del Mega Dashboard, no como producto separado.",
    replacement: "Sección interna de capacidades/automatización dentro de /ops.",
  },
  {
    title: "Primer Contacto Web",
    reason: "El flujo de captura de prospectos debe entrar por CRM/Kotizador/Mega Dashboard para no partir el pipeline.",
    replacement: "Módulo comercial del Mega Dashboard + RR Kotizador.",
  },
];