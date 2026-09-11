export interface Development {
  title: string;
  description: string;
  url: string;
  number: string;
}

export const DEVELOPMENTS: Development[] = [
  { title: "RR Finanzas", description: "Caja, runway, cuentas de cobro y proyecciones conectadas.", url: "/login?next=%2Fops%2Ffinanzas", number: "01" },
  { title: "RR Kotizador", description: "Cotizaciones, precios dinámicos y cronogramas automáticos.", url: "https://rr-kotizador.vercel.app/", number: "02" },
  { title: "DashWeb Core", description: "ERP/CRM para proyectos, tareas, RRHH, facturación y OKRs.", url: "https://dashweb-core-frontend-beta.up.railway.app/login", number: "03" },
  { title: "SaaS Vertical Hub", description: "CRM y demos personalizadas para verticales de negocio.", url: "https://rr-saas-vertical.vercel.app/", number: "04" },
  { title: "Altruismo", description: "Suite de herramientas web sin anuncios para la comunidad.", url: "https://altruismo-web.vercel.app/es", number: "05" },
];
