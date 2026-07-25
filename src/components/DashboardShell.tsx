"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import DashboardBackground from "@/components/DashboardBackground";
import SectionHeader from "@/components/ui/SectionHeader";
import { useActiveWidgetHighlight } from "@/hooks/useActiveWidgetHighlight";
import Meta5YearWidget from "@/components/Meta5YearWidget";
import BusinessMetricsWidget from "@/components/BusinessMetricsWidget";
import MiroFishReportsWidget from "@/components/MiroFishReportsWidget";
import ReportInsightBoard from "@/components/ReportInsightBoard";
import ActionProposalWidget from "@/components/ActionProposalWidget";
import MiroFishSignalsWidget from "@/components/MiroFishSignalsWidget";
import ReportesEstrategicosWidget from "@/components/ReportesEstrategicosWidget";
import SalesPipelineWidget from "@/components/SalesPipelineWidget";
import FinancialHealthWidget from "@/components/FinancialHealthWidget";
import CalendarWidget from "@/components/CalendarWidget";
import TaskMonitorWidget from "@/components/TaskMonitorWidget";
import ExportWidget from "@/components/ExportWidget";
import AutomationHealthWidget from "@/components/AutomationHealthWidget";
import GoogleAnalyticsWidget from "@/components/GoogleAnalyticsWidget";
import GoogleCalendarWidget from "@/components/GoogleCalendarWidget";
import ClientStatusWidget from "@/components/ClientStatusWidget";
import CompetitorWidget from "@/components/CompetitorWidget";
import SkillsCatalogWidget from "@/components/SkillsCatalogWidget";
import EcosystemAppsGrid from "@/components/EcosystemAppsGrid";
import ChatbotWidget from "@/components/ChatbotWidget";

const SIDEBAR_KEY = "rr-sidebar-collapsed";

export default function DashboardShell() {
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
            <HeroSection />
            <div id="business-metrics" className="col-12">
              <BusinessMetricsWidget />
            </div>
            <div className="col-12">
              <Meta5YearWidget />
            </div>

            <div className="section-divider" />

            <SectionHeader number="01" title="Inteligencia IA" subtitle="Predicciones, estrategia y acciones verificables" />
            <div id="mirofish-reports" className="col-6">
              <MiroFishReportsWidget />
            </div>
            <div id="estrategia" className="col-6">
              <ReportesEstrategicosWidget />
            </div>
            <div id="report-insights" className="col-12" data-vis="ops">
              <ReportInsightBoard />
            </div>
            <div id="action-proposals" className="col-12" data-vis="ops">
              <ActionProposalWidget />
            </div>
            <div id="mirofish-signals" className="col-12" data-vis="ops">
              <MiroFishSignalsWidget />
            </div>

            <div className="section-divider" />

            <SectionHeader number="02" title="Ecosistema" subtitle="Apps corporativas + deep-links accionables" />
            <div className="col-12">
              <EcosystemAppsGrid />
            </div>

            <div className="section-divider" data-vis="ops" />

            <div data-vis="ops" className="contents">
              <SectionHeader number="03" title="Negocio" subtitle="Pipeline comercial y salud financiera" />
            </div>
            <div id="sales-pipeline" className="col-6" data-vis="ops">
              <SalesPipelineWidget />
            </div>
            <div id="financial-health" className="col-6" data-vis="ops">
              <FinancialHealthWidget />
            </div>

            <div className="section-divider" data-vis="ops" />

            <div data-vis="ops" className="contents">
              <SectionHeader number="04" title="Operaciones" subtitle="Calendario, tareas y exportación" />
            </div>
            <div id="calendar-widget" className="col-4" data-vis="ops">
              <CalendarWidget />
            </div>
            <div id="task-monitor" className="col-4" data-vis="ops">
              <TaskMonitorWidget />
            </div>
            <div id="export-widget" className="col-4" data-vis="ops">
              <ExportWidget />
            </div>
            <div id="automation-health" className="col-12" data-vis="ops">
              <AutomationHealthWidget />
            </div>

            <div className="section-divider" />

            <SectionHeader number="05" title="Growth" subtitle="Analytics, clientes y competencia" />
            <div id="google-analytics" className="col-3">
              <GoogleAnalyticsWidget />
            </div>
            <div id="google-calendar" className="col-3" data-vis="ops">
              <GoogleCalendarWidget />
            </div>
            <div id="client-status" className="col-3">
              <ClientStatusWidget />
            </div>
            <div id="competitor-intel" className="col-3">
              <CompetitorWidget />
            </div>

            <div className="section-divider" />

            <SectionHeader number="06" title="Skills" subtitle="Catálogo completo de skills instaladas" />
            <div id="skills-catalog" className="col-12">
              <SkillsCatalogWidget />
            </div>

            <Footer />
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
