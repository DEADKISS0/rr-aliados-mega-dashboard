"use client";
import SidebarGroup from "./SidebarGroup";

interface SidebarProps {
  activeWidget: string;
  onSelect: (w: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

const comando = ["Inicio", "Métricas", "Pipeline", "Finanzas", "Calendario", "Tareas", "Exportar"];
const reportes = ["MiroFish Reports", "Estrategia"];
const aplicaciones = ["Company Hub", "Cotizador", "Altruismo", "Skills Hub App", "Adquisición Clientes", "Adquisición Talento", "DashWeb", "Skills Catalog", "SaaS Vertical"];
const dataAnalytics = ["Excel Widget", "Google Maps", "Google News", "Amazon Analyzer", "Metricool"];
const research = ["Web Research", "Firecrawl", "NotebookLM"];
const devQA = ["Karpathy Rules", "Debugging", "Verification", "QA Auditor", "Loop Mode", "Quality Loop"];
const content = ["X Publisher", "YouTube Clip", "Remotion", "Cronograma"];
const strategy = ["Brainstorming", "Grill-Me", "Writing Plans", "Benchmarking", "Interface Designing"];
const meta = ["Find Skills", "Skill Builder", "Skill Creator", "Masters", "Installer", "MCP", "A2A", "Consulta", "Superpowers", "Orchestrator", "Warpgrep"];

const GROUP_ICONS: Record<string, string> = {
  Comando: "⌘",
  "Reportes IA": "📊",
  Aplicaciones: "▦",
  "Data & Analytics": "📈",
  Research: "🔍",
  "Dev & QA": "⚙️",
  Content: "✍️",
  Strategy: "🎯",
  "Meta / Skills": "🧠",
};

const TOOL_SECTIONS: Record<string, string> = {
  "Excel Widget": "data-analytics",
  "Google Maps": "data-analytics",
  "Google News": "data-analytics",
  "Amazon Analyzer": "data-analytics",
  Metricool: "data-analytics",
  "Web Research": "research",
  Firecrawl: "research",
  NotebookLM: "research",
  "Karpathy Rules": "dev-qa",
  Debugging: "dev-qa",
  Verification: "dev-qa",
  "QA Auditor": "dev-qa",
  "Loop Mode": "dev-qa",
  "Quality Loop": "dev-qa",
  "X Publisher": "content",
  "YouTube Clip": "content",
  Remotion: "content",
  Cronograma: "content",
  Brainstorming: "strategy",
  "Grill-Me": "strategy",
  "Writing Plans": "strategy",
  Benchmarking: "strategy",
  "Interface Designing": "strategy",
  "Find Skills": "meta-skills",
  "Skill Builder": "meta-skills",
  "Skill Creator": "meta-skills",
  Masters: "meta-skills",
  Installer: "meta-skills",
  MCP: "meta-skills",
  A2A: "meta-skills",
  Consulta: "meta-skills",
  Superpowers: "meta-skills",
  Orchestrator: "meta-skills",
  Warpgrep: "meta-skills",
};

const NAV_IDS: Record<string, string> = {
  Inicio: "dashboard",
  Métricas: "business-metrics",
  Pipeline: "sales-pipeline",
  Finanzas: "financial-health",
  Calendario: "calendar-widget",
  Tareas: "task-monitor",
  Exportar: "export-widget",
  "MiroFish Reports": "mirofish-reports",
  Estrategia: "estrategia",
  "Company Hub": "company-hub",
  Cotizador: "cotizador",
  Altruismo: "altruismo",
  "Skills Hub App": "skills-hub-app",
  "Adquisición Clientes": "adquisicion",
  "Adquisición Talento": "adq-talentos",
  DashWeb: "dashweb",
  "SaaS Vertical": "saas-vertical",
  "Skills Catalog": "skills-catalog",
};

function skillToId(name: string): string {
  return NAV_IDS[name] ?? name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function NavItem({
  name,
  active,
  onClick,
  collapsed,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}) {
  const short = name.slice(0, 2).toUpperCase();
  return (
    <button
      onClick={onClick}
      className={`nav-item ${active ? "active" : ""} ${collapsed ? "nav-item-collapsed" : ""}`}
      title={name}
      aria-label={name}
    >
      {collapsed ? short : name}
    </button>
  );
}

export default function Sidebar({
  activeWidget,
  onSelect,
  isOpen = true,
  onClose,
  collapsed = false,
  onCollapseToggle,
}: SidebarProps) {
  const handleClick = (name: string) => {
    if (name === "Inicio") {
      onSelect("All");
      setTimeout(() => {
        document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      if (onClose) onClose();
      return;
    }
    onSelect(name);
    const sectionId = TOOL_SECTIONS[name];
    if (sectionId) {
      window.dispatchEvent(new CustomEvent("dashboard-nav", { detail: { sectionId } }));
    }
    const id = skillToId(name);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, sectionId ? 150 : 0);
    if (onClose) onClose();
  };

  const renderGroups = (isCollapsed: boolean) => {
    if (isCollapsed) {
      const jump = (first: string) => () => handleClick(first);
      return (
        <div className="flex flex-col gap-1 items-center">
          {Object.entries(GROUP_ICONS).map(([label, icon]) => {
            const first =
              label === "Comando" ? "Inicio" :
              label === "Reportes IA" ? "MiroFish Reports" :
              label === "Aplicaciones" ? "Company Hub" :
              label === "Data & Analytics" ? "Excel Widget" :
              label === "Research" ? "Web Research" :
              label === "Dev & QA" ? "Karpathy Rules" :
              label === "Content" ? "X Publisher" :
              label === "Strategy" ? "Brainstorming" : "Find Skills";
            return (
              <button
                key={label}
                type="button"
                className="nav-item nav-item-collapsed"
                title={label}
                aria-label={label}
                onClick={jump(first)}
              >
                {icon}
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <>
        <SidebarGroup label="Comando" defaultOpen={true}>
          {comando.map((s) => (
            <NavItem key={s} name={s} active={s === "Inicio" ? activeWidget === "All" : activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Reportes IA" defaultOpen={true}>
          {reportes.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Aplicaciones" defaultOpen={true}>
          {aplicaciones.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Data & Analytics">
          {dataAnalytics.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Research">
          {research.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Dev & QA">
          {devQA.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Content">
          {content.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Strategy">
          {strategy.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Meta / Skills">
          {meta.map((s) => (
            <NavItem key={s} name={s} active={activeWidget === s} onClick={() => handleClick(s)} />
          ))}
        </SidebarGroup>
      </>
    );
  };

  const sidebarContent = (isCollapsed: boolean) => (
    <aside
      className="h-full overflow-y-auto py-4 px-2 flex flex-col gap-1 transition-all"
      style={{
        width: isCollapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)",
        borderRight: "1px solid var(--border)",
        background: "var(--bg-glass)",
      }}
    >
      <div
        className={`pb-3 mb-2 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-2"}`}
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        {!isCollapsed && (
          <span className="font-mono-label" style={{ color: "var(--ember)" }}>Navegación</span>
        )}
        {onCollapseToggle && (
          <button
            type="button"
            className="btn-ghost !p-1.5 !text-xs hidden md:inline-flex"
            onClick={onCollapseToggle}
            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {isCollapsed ? "»" : "«"}
          </button>
        )}
      </div>
      {renderGroups(isCollapsed)}
    </aside>
  );

  return (
    <>
      <div className="hidden md:block flex-shrink-0">{sidebarContent(collapsed)}</div>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <div className="relative h-full shadow-2xl" style={{ background: "var(--bg-glass)" }}>
            {sidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
}
