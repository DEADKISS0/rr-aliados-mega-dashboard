"use client";
import { useEffect } from "react";

const NAV_TO_ID: Record<string, string> = {
  All: "",
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

function toolToId(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useActiveWidgetHighlight(activeWidget: string) {
  useEffect(() => {
    document.querySelectorAll(".widget-highlight").forEach((el) => {
      el.classList.remove("widget-highlight");
    });

    if (activeWidget === "All") return;

    const id = NAV_TO_ID[activeWidget] ?? toolToId(activeWidget);
    const el = document.getElementById(id);
    if (el) {
      el.classList.add("widget-highlight");
      return () => el.classList.remove("widget-highlight");
    }
  }, [activeWidget]);
}
