export interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  schedule: string;
  script: string;
  lastRun?: string;
  status: "success" | "failure" | "pending" | "unknown";
}

export const taskDefinitions: TaskDefinition[] = [
  {
    id: "predictions",
    name: "Reporte de Predicciones",
    description: "Genera predicciones para los próximos 7 días usando IA",
    schedule: "Diario 05:00 y 17:00",
    script: "enhanced_report.py",
    lastRun: "2026-07-14T05:44:00",
    status: "success",
  },
  {
    id: "strategic",
    name: "Reporte Estratégico",
    description: "Análisis estratégico contra la meta 5-year",
    schedule: "Diario 05:00 y 17:00",
    script: "reporte_optimizacion_estrategica.py",
    lastRun: "2026-07-14T05:51:00",
    status: "success",
  },
  {
    id: "deploy",
    name: "Deploy a Vercel",
    description: "Despliega el dashboard en producción",
    schedule: "Después de cada generación de reportes",
    script: "vercel deploy --prod --yes",
    lastRun: "2026-07-14T05:51:00",
    status: "success",
  },
];
