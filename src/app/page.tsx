import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RR ALIADOS — Brutalismo Estratégico Colombiano",
  description:
    "Growth partner boutique. AI First. Resultados medibles. Estrategia, desarrollo, contenido y datos para hacer crecer tu negocio.",
};

const DEVELOPMENTS = [
  {
    id: "mega-dashboard",
    title: "Mega Dashboard",
    description: "Centro de comando centralizado. Métricas, reportes IA, pipeline y skills en un solo lugar.",
    url: "https://rr-aliados-mega-dashboard.vercel.app/",
    icon: "🎯",
    tags: ["nextjs", "ia", "dashboard"],
  },
  {
    id: "rr-finanzas",
    title: "RR Finanzas",
    description: "Dashboard financiero en tiempo real. Caja, runway, cuentas de cobro y proyecciones.",
    url: "https://rr-finanzas.vercel.app/",
    icon: "💰",
    tags: ["finanzas", "nextjs", "supabase"],
  },
  {
    id: "rr-kotizador",
    title: "RR Kotizador",
    description: "Cotizador de servicios con precios dinámicos y cronogramas automáticos de pago.",
    url: "https://rr-kotizador.vercel.app/",
    icon: "🧮",
    tags: ["ventas", "cotizador", "automatizacion"],
  },
  {
    id: "primer-contacto",
    title: "Primer Contacto Web",
    description: "App de captura de prospectos: leads y registro de entrevistas estructuradas.",
    url: "https://primer-contacto-web.vercel.app/",
    icon: "📋",
    tags: ["crm", "leads", "nextjs"],
  },
  {
    id: "dashweb",
    title: "DashWeb Core",
    description: "ERP/CRM interno. Proyectos, tareas, RRHH, CRM, facturación y OKRs.",
    url: "https://dashweb-core-frontend-beta.up.railway.app/login",
    icon: "🔧",
    tags: ["erp", "crm", "railway"],
  },
  {
    id: "skills-hub",
    title: "RR Skills Hub",
    description: "Catálogo y gestión de skills de IA del equipo. 35+ skills orquestadas.",
    url: "https://rr-skills-hub.vercel.app/",
    icon: "📚",
    tags: ["ia", "skills", "catalogo"],
  },
  {
    id: "saas-vertical",
    title: "SaaS Vertical Hub",
    description: "CRM panaderías + pipeline + demos personalizadas. Backend Supabase.",
    url: "https://rr-saas-vertical.vercel.app/",
    icon: "🥐",
    tags: ["saas", "crm", "supabase"],
  },
  {
    id: "altruismo",
    title: "Altruismo",
    description: "Suite de herramientas web sin anuncios, creada por la comunidad.",
    url: "https://altruismo-web.vercel.app/es",
    icon: "🤝",
    tags: ["comunidad", "herramientas", "web"],
  },
];

const CLIENTS = [
  { name: "Wuundeer", industry: "B2B Mayorista confección", status: "Prospecto", url: "https://wuundeer-prototype.vercel.app/" },
  { name: "Satiro Sushi", industry: "Restaurante", status: "Cliente activo" },
  { name: "BOGA", industry: "Panadería / SaaS", status: "Cliente activo", url: "https://junisama.com.co/" },
  { name: "Siraitia", industry: "Agro exportación", status: "Prospecto" },
  { name: "Real Seguros", industry: "Corredora seguros", status: "Prototipo", url: "https://real-seguros-web.vercel.app/" },
  { name: "Café Angústula", industry: "Finca cafetera", status: "Prototipo", url: "https://augustula-cafe.vercel.app/" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight">RR ALIADOS</span>
            <span className="text-xs text-white/50 hidden sm:block">Brutalismo Estratégico Colombiano</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#desarrollos" className="text-sm text-white/70 hover:text-white transition">Desarrollos</a>
            <a href="#clientes" className="text-sm text-white/70 hover:text-white transition">Clientes</a>
            <a href="#metodo" className="text-sm text-white/70 hover:text-white transition">Método</a>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded hover:bg-white/90 transition"
            >
              Acceso interno
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-6">
              Con las manos<br />en el fuego.
            </h1>
            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mb-8">
              Growth partner boutique. AI First. Resultados medibles.
              Estrategia, desarrollo, contenido y datos para hacer crecer tu negocio.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#desarrollos"
                className="px-8 py-4 bg-white text-black font-bold rounded hover:bg-white/90 transition"
              >
                Ver desarrollos
              </a>
              <a
                href="#clientes"
                className="px-8 py-4 border border-white/20 text-white font-bold rounded hover:bg-white/10 transition"
              >
                Nuestros clientes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-black">8+</div>
            <div className="text-white/50 text-sm mt-1">Desarrollos propios</div>
          </div>
          <div>
            <div className="text-4xl font-black">6</div>
            <div className="text-white/50 text-sm mt-1">Clientes y prospectos</div>
          </div>
          <div>
            <div className="text-4xl font-black">35+</div>
            <div className="text-white/50 text-sm mt-1">Skills IA orquestadas</div>
          </div>
          <div>
            <div className="text-4xl font-black">100%</div>
            <div className="text-white/50 text-sm mt-1">AI First</div>
          </div>
        </div>
      </section>

      {/* Desarrollos */}
      <section id="desarrollos" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Desarrollos</h2>
          <p className="text-white/60 mb-12 max-w-2xl">
            Herramientas que construimos para operar mejor: dashboards, CRMs, cotizadores,
            captura de leads y plataformas verticales.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEVELOPMENTS.map((dev) => (
              <a
                key={dev.id}
                href={dev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/10 rounded-lg p-6 hover:border-white/30 transition bg-white/[0.02]"
              >
                <div className="text-3xl mb-4">{dev.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition">{dev.title}</h3>
                <p className="text-white/50 text-sm mb-4">{dev.description}</p>
                <div className="flex flex-wrap gap-2">
                  {dev.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes */}
      <section id="clientes" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Clientes y prospectos</h2>
          <p className="text-white/60 mb-12 max-w-2xl">
            Trabajamos con negocios que quieren crecer con estrategia y tecnología.
            Estos son algunos de los proyectos en los que estamos activos.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLIENTS.map((client) => (
              <div
                key={client.name}
                className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition bg-white/[0.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{client.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    client.status === "Cliente activo"
                      ? "bg-green-500/20 text-green-400"
                      : client.status === "Prospecto"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {client.status}
                  </span>
                </div>
                <p className="text-white/50 text-sm mb-4">{client.industry}</p>
                {client.url && (
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-white transition underline underline-offset-4"
                  >
                    Ver proyecto →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Método */}
      <section id="metodo" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12">Nuestro método</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-5xl font-black text-white/10 mb-4">01</div>
              <h3 className="text-xl font-bold mb-3">Estrategia brutal</h3>
              <p className="text-white/50">
                No vendemos humo. Analizamos tu negocio, tu mercado y tu competencia
                antes de proponer cualquier cosa. Si no podemos ayudarte, te lo decimos.
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-white/10 mb-4">02</div>
              <h3 className="text-xl font-bold mb-3">AI First</h3>
              <p className="text-white/50">
                Usamos inteligencia artificial en todo: desde la estrategia hasta la ejecución.
                35+ skills propias que nos permiten entregar más rápido y con mejor calidad.
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-white/10 mb-4">03</div>
              <h3 className="text-xl font-bold mb-3">Resultados medibles</h3>
              <p className="text-white/50">
                Todo lo que hacemos se mide. Dashboards en tiempo real, reportes IA,
                y métricas claras para que sepas exactamente qué está pasando.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">¿Quieres crecer con nosotros?</h2>
          <p className="text-white/60 mb-8">
            Agenda una llamada de descubrimiento. Analizamos tu caso y te decimos
            si podemos ayudarte y cómo.
          </p>
          <a
            href="mailto:rraliadosteam@gmail.com"
            className="inline-block px-8 py-4 bg-white text-black font-bold rounded hover:bg-white/90 transition"
          >
            Agendar llamada
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/40 text-sm">
            © 2026 RR ALIADOS S.A.S. — Envigado, Colombia
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="mailto:rraliadosteam@gmail.com" className="hover:text-white transition">
              rraliadosteam@gmail.com
            </a>
            <Link href="/login" className="hover:text-white transition">
              Acceso interno
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
