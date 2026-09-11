import Link from "next/link";
import type { Metadata } from "next";
import { CLIENTS } from "@/data/clients";
import { DEVELOPMENTS } from "@/data/developments";

export const metadata: Metadata = {
  title: "RR ALIADOS — Growth Partner",
  description: "Estrategia, desarrollo y datos para convertir marcas con potencial en sistemas de crecimiento.",
};


const statusLabel = { active: "Activo", prospect: "Prospecto", closed: "Cerrado", paused: "Pausado" } as const;

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav">
        <Link href="/" className="brand-lockup" aria-label="RR Aliados inicio"><img src="/brand/rr/simbolo_transparent_fucsia.png" alt="" className="brand-symbol" /><span>RR ALIADOS</span></Link>
        <div className="landing-nav__links"><a href="#desarrollos">Desarrollos</a><a href="#clientes">Clientes</a><a href="#metodo">Método</a><Link href="/login" className="brand-button brand-button--small">Acceso interno ↗</Link></div>
      </nav>

      <section className="landing-hero"><div className="hero-mark">[ RR / GROWTH_PARTNER ]</div><div className="hero-grid"><div className="hero-copy"><p className="eyebrow">ESTRATEGIA · ARQUITECTURA · EJECUCIÓN</p><h1>Con las manos<br /><em>en el fuego.</em></h1><p className="hero-lede">No entregamos archivos. Construimos sistemas de crecimiento con criterio visual, tecnología y datos sobre la mesa.</p><div className="hero-actions"><a href="#desarrollos" className="brand-button">Ver el ecosistema ↓</a><a href="#contacto" className="brand-button brand-button--ghost">Iniciar conversación ↗</a></div></div><div className="hero-panel" aria-label="Manifiesto RR Aliados"><img src="/brand/rr/simbolo_transparent_mostaza.png" alt="Símbolo RR Aliados" className="hero-symbol" /><div className="hero-panel__line"><span>STATUS</span><b>ACTIVE_MANIFESTO</b></div><div className="hero-panel__line"><span>MODE</span><b>AI_FIRST / HUMAN_LED</b></div><div className="hero-panel__line"><span>RULE</span><b>TRANSPARENCIA RADICAL</b></div><p>“La cuerda de tres hilos no se rompe fácil.”</p></div></div></section>

      <section className="landing-stats" aria-label="Indicadores RR Aliados"><div><strong>{DEVELOPMENTS.length}+</strong><span>desarrollos activos</span></div><div><strong>{CLIENTS.length}</strong><span>clientes y prospectos</span></div><div><strong>35+</strong><span>skills orquestadas</span></div><div><strong>100%</strong><span>AI First</span></div></section>

      <section id="desarrollos" className="landing-section"><div className="section-intro"><p className="eyebrow">01 / ECOSISTEMA</p><h2>Lo que construimos<br /><span>para operar mejor.</span></h2><p>Productos internos, prototipos y sistemas que convierten estrategia en operación.</p></div><div className="development-grid">{DEVELOPMENTS.map(({ title, description, url, number }) => <a key={title} href={url} target={url.startsWith("/") ? undefined : "_blank"} rel={url.startsWith("/") ? undefined : "noreferrer"} className="development-card"><span className="card-index">{number}</span><h3>{title} <span>↗</span></h3><p>{description}</p><small>ABRIR DESARROLLO</small></a>)}</div></section>

      <section id="clientes" className="landing-section landing-section--alt"><div className="section-intro"><p className="eyebrow">02 / ALIANZAS</p><h2>Marcas con<br /><span>algo que decir.</span></h2><p>Una vista pública del trabajo y las oportunidades que estamos construyendo.</p></div><div className="client-grid">{CLIENTS.map((client) => { const url = client.prototypeUrl || client.website; return <article key={client.slug} className="client-row">{url ? <a href={url} target="_blank" rel="noreferrer" className="client-row__main" aria-label={`Ver proyecto ${client.name}`}><span className="client-status">{statusLabel[client.status]}</span><h3>{client.name}</h3><p>{client.industry}</p><span className="client-open">↗</span></a> : <><span className="client-status">{statusLabel[client.status]}</span><h3>{client.name}</h3><p>{client.industry}</p><span className="client-pending">EN CONSTRUCCIÓN</span></>}{client.instagram ? <a href={client.instagram} target="_blank" rel="noreferrer" className="client-ig" aria-label={`Instagram ${client.name}`}>IG</a> : null}</article>; })}</div></section>

      <section id="metodo" className="landing-section method-section"><p className="eyebrow">03 / FORMA DE TRABAJO</p><h2>Vanguardia como<br /><span>ventaja operativa.</span></h2><div className="method-grid"><div><b>01</b><h3>Inmersión total</h3><p>Conocemos tus números, cuellos de botella y ambición antes de proponer.</p></div><div><b>02</b><h3>AI First</h3><p>La inteligencia artificial acelera la ejecución; el criterio humano decide el rumbo.</p></div><div><b>03</b><h3>Resultados medibles</h3><p>Métricas abiertas, decisiones claras y operación visible.</p></div></div></section>

      <section id="contacto" className="landing-cta"><img src="/brand/rr/simbolo_transparent_blanco.png" alt="" className="cta-symbol" /><p className="eyebrow">[ INITIATING_ALLIANCE ]</p><h2>¿Crecemos juntos?</h2><a href="mailto:rraliadosteam@gmail.com" className="brand-button brand-button--mustard">Agendar conversación ↗</a></section>
      <footer className="landing-footer"><span>© 2026 RR ALIADOS S.A.S. — Envigado, Colombia</span><span>CON LAS MANOS EN EL FUEGO.</span><Link href="/login">Acceso interno ↗</Link></footer>
    </main>
  );
}
