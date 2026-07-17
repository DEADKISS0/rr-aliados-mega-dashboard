"use client";
import { useState } from "react";
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
import CommandCenterWidget from "@/components/CommandCenterWidget";
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
import ReportesEstrategicosWidget from "@/components/ReportesEstrategicosWidget";
import SalesPipelineWidget from "@/components/SalesPipelineWidget";
import FinancialHealthWidget from "@/components/FinancialHealthWidget";
import ClientStatusWidget from "@/components/ClientStatusWidget";
import CompetitorWidget from "@/components/CompetitorWidget";
import ExternalAppWidget from "@/components/ExternalAppWidget";
import Meta5YearWidget from "@/components/Meta5YearWidget";
import AutomationHealthWidget from "@/components/AutomationHealthWidget";

export default function Home() {
  const [activeWidget, setActiveWidget] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useActiveWidgetHighlight(activeWidget);

  return (
    <div className="flex flex-col h-screen relative" style={{ background: "var(--bg-primary)" }}>
      <DashboardBackground />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar
          activeWidget={activeWidget}
          onSelect={setActiveWidget}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main
          className="flex-1 overflow-y-auto py-6"
          style={{ paddingLeft: "var(--page-x)", paddingRight: "var(--page-x)" }}
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
            <SectionHeader number="01" title="Inteligencia IA" subtitle="Predicciones y optimización estratégica" />
            <div id="mirofish-reports" className="col-6">
              <MiroFishReportsWidget />
            </div>
            <div id="estrategia" className="col-6">
              <ReportesEstrategicosWidget />
            </div>

            <div className="section-divider" />

            {/* Zona 3 — Ecosistema */}
            <SectionHeader number="02" title="Ecosistema" subtitle="Apps corporativas integradas" />
            <div className="col-12">
              <div className="apps-grid">
                <div id="company-hub">
                  <ExternalAppWidget title="Company Hub" url="https://x3hlysjfyb4ta.kimi.page/" icon="🏢" />
                </div>
                <div id="cotizador">
                  <ExternalAppWidget title="RR Cotizador" url="https://rr-kotizador.vercel.app/" icon="🧮" />
                </div>
                <div id="altruismo">
                  <ExternalAppWidget title="Altruismo" url="https://altruismo-web.vercel.app/es" icon="🤝" />
                </div>
                <div id="skills-hub-app">
                  <ExternalAppWidget title="RR Skills Hub" url="https://rr-skills-hub.vercel.app/" icon="📚" />
                </div>
                <div id="adquisicion">
                  <ExternalAppWidget title="Dashboard de Adquisición" url="https://3mpm6kcgvmpz4.kimi.page/#panel" icon="📈" />
                </div>
                <div id="dashweb">
                  <ExternalAppWidget title="DashWeb Core" url="https://dashweb-core-frontend-beta.up.railway.app/login" icon="🔧" />
                </div>
              </div>
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
            <div id="calendar-widget" className="col-3">
              <CalendarWidget />
            </div>
            <div id="task-monitor" className="col-3">
              <TaskMonitorWidget />
            </div>
            <div id="command-center" className="col-3">
              <CommandCenterWidget />
            </div>
            <div id="export-widget" className="col-3">
              <ExportWidget />
            </div>
            <div id="automation-health" className="col-12">
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

            <div className="section-divider" />

            <SectionHeader
              number="06"
              title="Skills"
              subtitle={activeWidget === "All" ? "Catálogo completo de skills instaladas" : `Vista: ${activeWidget}`}
            />
            <div id="skills-catalog" className="col-12" data-internal-only>
              <SkillsCatalogWidget />
            </div>

            <div data-internal-only>
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
              <div id="find-skills"><FindSkillsWidget /></div>
              <div id="skill-builder"><SkillBuilderWidget /></div>
              <div id="skill-creator"><SkillCreatorWidget /></div>
              <div id="masters"><SkillFromMastersWidget /></div>
              <div id="installer"><SkillInstallerWidget /></div>
              <div id="mcp"><MCPWidget /></div>
              <div id="a2a"><MultiAgentWidget /></div>
              <div id="consulta"><ConsultaContextoWidget /></div>
              <div id="superpowers"><SuperpowersWidget /></div>
              <div id="orchestrator"><SkillOrchestratorWidget /></div>
              <div id="warpgrep"><WarpgrepsWidget /></div>
            </CollapsibleSection>
            </div>

          </div>
        </main>
      </div>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
