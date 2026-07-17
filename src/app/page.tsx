"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import DashboardBackground from "@/components/DashboardBackground";
import SectionHeader from "@/components/ui/SectionHeader";
import { useActiveWidgetHighlight } from "@/hooks/useActiveWidgetHighlight";
import BusinessMetricsWidget from "@/components/BusinessMetricsWidget";
import CalendarWidget from "@/components/CalendarWidget";
import TaskMonitorWidget from "@/components/TaskMonitorWidget";
import ChatbotWidget from "@/components/ChatbotWidget";
import GoogleAnalyticsWidget from "@/components/GoogleAnalyticsWidget";
import GoogleCalendarWidget from "@/components/GoogleCalendarWidget";
import ExportWidget from "@/components/ExportWidget";
import CollapsibleSection from "@/components/CollapsibleSection";
import InterfaceDesigningWidget from "@/components/InterfaceDesigningWidget";
import BenchmarkingWidget from "@/components/BenchmarkingWidget";
import ExcelWidget from "@/components/ExcelWidget";
import GoogleNewsWidget from "@/components/GoogleNewsWidget";
import GoogleMapsWidget from "@/components/GoogleMapsWidget";
import MetricoolWidget from "@/components/MetricoolWidget";
import WebResearchWidget from "@/components/WebResearchWidget";
import FirecrawlWidget from "@/components/FirecrawlWidget";
import AmazonWidget from "@/components/AmazonWidget";
import NotebookLMWidget from "@/components/NotebookLMWidget";
import BrainstormingWidget from "@/components/BrainstormingWidget";
import GrillMeWidget from "@/components/GrillMeWidget";
import CronogramaWidget from "@/components/CronogramaWidget";
import KarpathyWidget from "@/components/KarpathyWidget";
import DebuggingWidget from "@/components/DebuggingWidget";
import VerificationWidget from "@/components/VerificationWidget";
import QAAuditorWidget from "@/components/QAAuditorWidget";
import LoopModeWidget from "@/components/LoopModeWidget";
import QualityLoopWidget from "@/components/QualityLoopWidget";
import MCPWidget from "@/components/MCPWidget";
import MultiAgentWidget from "@/components/MultiAgentWidget";
import RemotionWidget from "@/components/RemotionWidget";
import SkillBuilderWidget from "@/components/SkillBuilderWidget";
import SkillCreatorWidget from "@/components/SkillCreatorWidget";
import SkillFromMastersWidget from "@/components/SkillFromMastersWidget";
import SkillInstallerWidget from "@/components/SkillInstallerWidget";
import SkillOrchestratorWidget from "@/components/SkillOrchestratorWidget";
import SuperpowersWidget from "@/components/SuperpowersWidget";
import WarpgrepsWidget from "@/components/WarpgrepWidget";
import WritingPlansWidget from "@/components/WritingPlansWidget";
import XPublisherWidget from "@/components/XPublisherWidget";
import YouTubeClipperWidget from "@/components/YouTubeClipperWidget";
import FindSkillsWidget from "@/components/FindSkillsWidget";
import ConsultaContextoWidget from "@/components/ConsultaContextoWidget";
import SkillsCatalogWidget from "@/components/SkillsCatalogWidget";
import MiroFishReportsWidget from "@/components/MiroFishReportsWidget";
import MiroFishSignalsWidget from "@/components/MiroFishSignalsWidget";
import ReportesEstrategicosWidget from "@/components/ReportesEstrategicosWidget";
import ActionProposalWidget from "@/components/ActionProposalWidget";
import SalesPipelineWidget from "@/components/SalesPipelineWidget";
import FinancialHealthWidget from "@/components/FinancialHealthWidget";
import ClientStatusWidget from "@/components/ClientStatusWidget";
import CompetitorWidget from "@/components/CompetitorWidget";
import Meta5YearWidget from "@/components/Meta5YearWidget";
import AutomationHealthWidget from "@/components/AutomationHealthWidget";
import EcosystemAppsGrid from "@/components/EcosystemAppsGrid";
import ShellSkillCard from "@/components/ui/ShellSkillCard";

const SIDEBAR_KEY = "rr-sidebar-collapsed";

export default function Home() {
  const [activeWidget, setActiveWidget] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useActiveWidgetHighlight(activeWidget);

  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-screen relative" style={{ background: "var(--bg-primary)" }}>
      <DashboardBackground />
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarCollapseToggle={toggleSidebarCollapse}
      />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar
          activeWidget={activeWidget}
          onSelect={setActiveWidget}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onCollapseToggle={toggleSidebarCollapse}
        />
        <main
          className="flex-1 overflow-y-auto py-6"
          style={{
            paddingLeft: "var(--page-x)",
            paddingRight: "var(--page-x)",
            paddingBottom: "5rem",
          }}
        >
          <div className="dashboard-grid">

            {/* Zona 1 — Command Center */}
            <HeroSection />
            <div id="business-metrics" className="col-12">
              <BusinessMetricsWidget />
            </div>
            <div className="col-12">
              <Meta5YearWidget />
            </div>

            <div className="section-divider" />

            {/* Zona 2 — Inteligencia IA */}
            <SectionHeader number="01" title="Inteligencia IA" subtitle="Predicciones, estrategia y acciones verificables" />
            <div id="mirofish-reports" className="col-6">
              <MiroFishReportsWidget />
            </div>
            <div id="estrategia" className="col-6">
              <ReportesEstrategicosWidget />
            </div>
            <div id="action-proposals" className="col-12">
              <ActionProposalWidget />
            </div>
            <div id="mirofish-signals" className="col-12">
              <MiroFishSignalsWidget />
            </div>

            <div className="section-divider" />

            {/* Zona 3 — Ecosistema */}
            <SectionHeader number="02" title="Ecosistema" subtitle="Apps corporativas + deep-links accionables" />
            <div className="col-12">
              <EcosystemAppsGrid />
            </div>

            <div className="section-divider" />

            {/* Zona 4 — Negocio */}
            <SectionHeader number="03" title="Negocio" subtitle="Pipeline comercial y salud financiera" />
            <div id="sales-pipeline" className="col-6">
              <SalesPipelineWidget />
            </div>
            <div id="financial-health" className="col-6">
              <FinancialHealthWidget />
            </div>

            <div className="section-divider" />

            {/* Zona 5 — Operaciones */}
            <SectionHeader number="04" title="Operaciones" subtitle="Calendario, tareas y exportación" />
            <div id="calendar-widget" className="col-4">
              <CalendarWidget />
            </div>
            <div id="task-monitor" className="col-4" data-pitch-hide>
              <TaskMonitorWidget />
            </div>
            <div id="export-widget" className="col-4" data-pitch-hide>
              <ExportWidget />
            </div>
            <div id="automation-health" className="col-12" data-pitch-hide>
              <AutomationHealthWidget />
            </div>

            <div className="section-divider" />

            {/* Zona 6 — Growth */}
            <SectionHeader number="05" title="Growth" subtitle="Analytics, clientes y competencia" />
            <div id="google-analytics" className="col-3">
              <GoogleAnalyticsWidget />
            </div>
            <div id="google-calendar" className="col-3">
              <GoogleCalendarWidget />
            </div>
            <div id="client-status" className="col-3">
              <ClientStatusWidget />
            </div>
            <div id="competitor-intel" className="col-3">
              <CompetitorWidget />
            </div>

            <div className="section-divider" data-internal-only />

            <div data-internal-only className="contents">
              <SectionHeader
                number="06"
                title="Skills"
                subtitle={activeWidget === "All" ? "Catálogo completo de skills instaladas" : `Vista: ${activeWidget}`}
              />
            </div>
            <div id="skills-catalog" className="col-12" data-internal-only>
              <SkillsCatalogWidget />
            </div>

            <div className="col-12 flex flex-col gap-4" data-internal-only>
              <CollapsibleSection title="DATA & ANALYTICS" icon="📊" sectionId="data-analytics" defaultOpen={false}>
                <div id="excel-widget"><ExcelWidget /></div>
                <div id="google-news"><GoogleNewsWidget /></div>
                <div id="google-maps"><GoogleMapsWidget /></div>
                <div id="amazon-analyzer"><AmazonWidget /></div>
                <div id="metricool"><MetricoolWidget /></div>
              </CollapsibleSection>

              <CollapsibleSection title="RESEARCH" icon="🔍" sectionId="research" defaultOpen={false}>
                <div id="web-research"><WebResearchWidget /></div>
                <div id="firecrawl"><FirecrawlWidget /></div>
                <div id="notebooklm"><NotebookLMWidget /></div>
              </CollapsibleSection>

              <CollapsibleSection title="DEV & QA" icon="⚙️" sectionId="dev-qa" defaultOpen={false}>
                <div id="karpathy-rules"><KarpathyWidget /></div>
                <div id="debugging"><DebuggingWidget /></div>
                <div id="verification"><VerificationWidget /></div>
                <div id="qa-auditor"><QAAuditorWidget /></div>
                <div id="loop-mode"><LoopModeWidget /></div>
                <div id="quality-loop"><QualityLoopWidget /></div>
              </CollapsibleSection>

              <CollapsibleSection title="CONTENT" icon="✍️" sectionId="content" defaultOpen={false}>
                <div id="x-publisher"><XPublisherWidget /></div>
                <div id="youtube-clip"><YouTubeClipperWidget /></div>
                <div id="remotion"><RemotionWidget /></div>
                <div id="cronograma"><CronogramaWidget /></div>
              </CollapsibleSection>

              <CollapsibleSection title="STRATEGY" icon="🎯" sectionId="strategy" defaultOpen={false}>
                <div id="brainstorming"><BrainstormingWidget /></div>
                <div id="grill-me"><GrillMeWidget /></div>
                <div id="writing-plans"><WritingPlansWidget /></div>
                <div id="benchmarking"><BenchmarkingWidget /></div>
                <div id="interface-designing"><InterfaceDesigningWidget /></div>
              </CollapsibleSection>

              <CollapsibleSection title="META / SKILLS" icon="🧠" sectionId="meta-skills" defaultOpen={false}>
                <div id="find-skills">
                  <ShellSkillCard title="Find Skills" skillSlug="find-skills" icon="🔎">
                    <FindSkillsWidget />
                  </ShellSkillCard>
                </div>
                <div id="skill-builder">
                  <ShellSkillCard title="Skill Builder" skillSlug="skill-builder" icon="🧱">
                    <SkillBuilderWidget />
                  </ShellSkillCard>
                </div>
                <div id="skill-creator">
                  <ShellSkillCard title="Skill Creator" skillSlug="skill-creator" icon="✨">
                    <SkillCreatorWidget />
                  </ShellSkillCard>
                </div>
                <div id="masters">
                  <ShellSkillCard title="Skill From Masters" skillSlug="skill-from-masters" icon="🎓">
                    <SkillFromMastersWidget />
                  </ShellSkillCard>
                </div>
                <div id="installer">
                  <ShellSkillCard title="Skill Installer" skillSlug="skill-installer" icon="📦">
                    <SkillInstallerWidget />
                  </ShellSkillCard>
                </div>
                <div id="mcp">
                  <ShellSkillCard title="MCP Client" skillSlug="mcp-client" icon="🔌">
                    <MCPWidget />
                  </ShellSkillCard>
                </div>
                <div id="a2a">
                  <ShellSkillCard title="Multi-Agent (A2A)" skillSlug="multi-agent-orchestrator" icon="🤖" quarantine={false}>
                    <MultiAgentWidget />
                  </ShellSkillCard>
                </div>
                <div id="consulta">
                  <ShellSkillCard title="Consulta Contexto" skillSlug="consulta-contexto" icon="❓">
                    <ConsultaContextoWidget />
                  </ShellSkillCard>
                </div>
                <div id="superpowers">
                  <ShellSkillCard title="Superpowers" skillSlug="superpowers" icon="⚡">
                    <SuperpowersWidget />
                  </ShellSkillCard>
                </div>
                <div id="orchestrator">
                  <ShellSkillCard title="Skill Orchestrator" skillSlug="orquestador" icon="🎯" quarantine={false}>
                    <SkillOrchestratorWidget />
                  </ShellSkillCard>
                </div>
                <div id="warpgrep">
                  <ShellSkillCard title="Warpgrep" skillSlug="warpgrep" icon="📡">
                    <WarpgrepsWidget />
                  </ShellSkillCard>
                </div>
              </CollapsibleSection>
            </div>

            <Footer />
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
