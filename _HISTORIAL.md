# Mega Dashboard — Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 17/07/2026 | **Fix reportes IA + UI simétrica** | Fila de 3 reportes (Predicciones, Optimización temporal, Estrategia) con iframes 520px. `OptimizacionWidget` montado en `page.tsx`. Sidebar con IDs + auto-apertura de secciones colapsables. Hero compacto. `src/lib/llm.ts` + failover en `/api/chat`. `.env.example` documentado. Utilidades CSS `.report-card`, `.report-iframe`, `.apps-grid`. Build verificado en `C:\temp` (Drive corrompe node_modules). Deploy prod: https://skill-orchestrator-dashboard.vercel.app |
