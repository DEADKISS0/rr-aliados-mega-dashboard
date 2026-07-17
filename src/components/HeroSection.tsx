"use client";
import { STATS } from "@/data/skillsCatalog";
import { getBusinessContext } from "@/data/businessContext";

export default function HeroSection() {
  const ctx = getBusinessContext();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    {
      icon: "📊",
      title: "Predicciones",
      desc: "Análisis predictivo con IA para los próximos 7 días.",
      targetId: "mirofish-reports",
    },
    {
      icon: "🎯",
      title: "Estrategia",
      desc: "Optimización estratégica contra la meta 5-year de RR ALIADOS.",
      targetId: "estrategia",
    },
  ];

  const stats = [
    { label: "Skills Instaladas", value: String(STATS.installed), color: "var(--ember)" },
    { label: "Skills Disponibles", value: String(STATS.available), color: "var(--warning)" },
    { label: "Meta Q3 Clientes", value: `${ctx.clientsClosed}/${ctx.clientsTargetQ3}`, color: "var(--success)" },
    { label: "Runway (días)", value: String(ctx.runwayDays), color: ctx.runwayDays < 60 ? "var(--danger)" : "var(--ember-light)" },
  ];

  return (
    <section
      id="dashboard"
      className="col-12 glass-panel relative overflow-hidden animate-in"
    >
      <div
        className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "var(--ember)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "var(--void)" }}
      />

      <div className="relative z-10 p-6 md:p-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="font-mono-label px-3 py-1.5 rounded-full"
                style={{ background: "var(--ember-20)", color: "var(--ember-light)", border: "1px solid var(--ember-30)" }}
              >
                Skill Orchestrator
              </span>
              <span className="font-mono-label" style={{ color: "var(--text-muted)" }}>
                Brutalismo Estratégico Colombiano
              </span>
            </div>
            <h1 className="text-hero mb-3" style={{ color: "var(--text-primary)" }}>
              Centro de Comando
            </h1>
            <p className="text-sm md:text-base max-w-xl font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Reportes IA, pipeline comercial, apps corporativas y{" "}
              <strong style={{ color: "var(--ember-light)" }}>{STATS.installed} skills</strong> instaladas.
              Todo el ecosistema RR ALIADOS en un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 lg:min-w-[28rem]">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`stat-tile animate-in animate-in-delay-${Math.min(i + 1, 3)}`}
              >
                <span className="text-stat" style={{ color: s.color }}>{s.value}</span>
                <span className="font-mono-label leading-tight" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => scrollTo(f.targetId)}
              className={`group p-5 rounded-xl text-left transition-all cursor-pointer animate-in animate-in-delay-${Math.min(i + 1, 3)}`}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{f.icon}</span>
                <span
                  className="font-mono-label opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--ember)" }}
                >
                  Ir →
                </span>
              </div>
              <h3
                className="font-display text-base tracking-wide mb-2 group-hover:text-[var(--ember-light)] transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p className="text-xs font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {f.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
