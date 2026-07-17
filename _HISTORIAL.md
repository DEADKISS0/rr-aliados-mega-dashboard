# Mega Dashboard — Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 17/07/2026 | **Backlog ops** | Purga Reportes Optimización temporal; Calendar LIVE (`/api/calendar` + widgets); sin #command-center; UI densa tareas/automatizaciones; Señales MiroFish con EJEMPLO etiquetado. |
| 17/07/2026 | **Vanguardia polish** | Badges IA/heurístico en reportes estratégicos; chatbot quick prompts envían al instante; PWA icons; sync_reports.ps1 LiteralPath; Modo Pitch + sidebar colapsable ya en prod. Deploy: https://rr-aliados-mega-dashboard.vercel.app |
| 17/07/2026 | **Fix reportes IA + UI simétrica** | Fila de 3 reportes (Predicciones, Optimización temporal, Estrategia) con iframes 520px. `OptimizacionWidget` montado en `page.tsx`. Sidebar con IDs + auto-apertura de secciones colapsables. Hero compacto. `src/lib/llm.ts` + failover en `/api/chat`. `.env.example` documentado. Utilidades CSS `.report-card`, `.report-iframe`, `.apps-grid`. Build verificado en `C:\temp` (Drive corrompe node_modules). Deploy prod: https://skill-orchestrator-dashboard.vercel.app |
| 17/07/2026 | **Reporte estratégico IA** | PDF `Reporte_Estrategico_2026-07-17_0417` sincronizado a `public/reports/` (60% progreso, sin texto fallback). |
| 17/07/2026 | **Reportes + DashWeb Core** | Publicación validada de artefactos, cola read-only de acciones MiroFish, proxy servidor preparado para DashWeb y señales visuales de actividad documental. Se montó el visor de optimización temporal junto a predicciones y estrategia. Build verificado fuera de Google Drive. |
