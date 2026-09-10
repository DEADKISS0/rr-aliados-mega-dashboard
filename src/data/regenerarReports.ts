export type ReportRegenerarVariant = "predicciones" | "optimizacion";

/** Local docs exist at mirofish_lite/DOCUMENTACION.md — no public URL hosted. */
export const MIROFISH_DOCS_URL: string | null = null;

export const REGENERAR_INSTRUCTIONS: Record<ReportRegenerarVariant, string> = {
  predicciones: `# Regenerar Reporte Estrategico (MiroFish-Lite)
cd "G:\\Mi unidad\\RR_Aliados\\08_Dev\\Proyectos\\mirofish_lite"
python enhanced_report.py
cd "G:\\Mi unidad\\RR_Aliados\\08_Dev\\Proyectos\\skill-orchestrator-dashboard"
.\\scripts\\sync_reports.ps1`,
  optimizacion: `# Regenerar Reporte de Optimizacion Estrategica (MiroFish-Lite)
cd "G:\\Mi unidad\\RR_Aliados\\08_Dev\\Proyectos\\mirofish_lite"
python optimization_report.py
cd "G:\\Mi unidad\\RR_Aliados\\08_Dev\\Proyectos\\skill-orchestrator-dashboard"
.\\scripts\\sync_reports.ps1`,
};

export const REGENERAR_TOOLTIP =
  "Regenerar via MiroFish-Lite y sincronizar con scripts/sync_reports.ps1";