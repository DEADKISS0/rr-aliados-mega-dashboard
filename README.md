# RR ALIADOS — Mega Dashboard

Centro de comando interno de RR ALIADOS S.A.S. — Brutalismo Estratégico Colombiano.

**Producción:** https://rr-aliados-mega-dashboard.vercel.app/

## Stack

- Next.js 16 + React 19 + Tailwind 4 + TypeScript
- Design system: Pitch / Void / Ember / Parchment / Ash (brandkit RR)
- Fuentes: Bebas Neue, Inter, IBM Plex Mono

## Features

| Feature | Descripción |
|---------|-------------|
| **Modo Pitch** | Vista cliente/inversor — oculta skills/ops/chatbot (atajo `P`) + Pack Pitch PDF |
| **Chat grounded** | `/api/chat` inyecta KPIs, pipeline interno y últimos reportes MiroFish |
| **Pack Pitch** | `/api/generate-pdf` `template:pitch` — HTML branded + imprimir/PDF |
| **GA4** | `/api/analytics` — Data API real si hay service account; si no, DEMO vacío (sin random) |
| **News** | `/api/news` — Google News RSS live + cache `public/data/news_feed.json` |
| **Metricool** | `/api/metricool` — stub listo; sin token = 0 métricas (no fake followers) |
| **Auth roles** | Cookie HMAC `ops`/`pitch`/`client` — middleware bloquea APIs sensibles |
| **Shell skills** | Badge Shell + deep-link Skills Hub (cuarentena teatro) |
| **Ecosystem health** | Ping Cotizador / Skills Hub / Adq Talento en `/api/automation` |
| **Sidebar colapsable** | Rail de iconos en desktop con preferencia en localStorage |
| **Command palette** | `Ctrl+K` — búsqueda + acciones rápidas (Wuunder, deploy, reportes) |
| **Pipeline API** | `/api/pipeline` — snapshot interno de deals; no sustituye DashWeb Core |
| **Automation health** | `/api/automation` — frescura real de índices (mtime, stale >24h) |
| **Finance snapshot** | `public/data/finance_snapshot.json` — capital/burn/Wuunder (sin CRM) |
| **Escenario Wuunder** | Toggle local en Salud Financiera (Abierto/Cerrado → runway) |
| **Meta 5 años** | Progreso hacia visión 2026→2031 desde `_HOJA_DE_RUTA.md` |
| **PWA** | `manifest.json` con iconos brand + colores pitch/ember |

## Widgets de reportes IA

| Widget | Índice JSON | Carpeta PDFs |
|--------|-------------|--------------|
| Predicciones | `/reports/predicciones_index.json` | `public/reports/` |
| Estrategia | `/reports/estrategicos_index.json` | `public/reports/` |

## Pipeline

```
enhanced_report.py → public/reports/ (+ predicciones_index.json)
reporte_optimizacion_estrategica.py → public/reports/ (+ estrategicos_index.json, action_ledger.json)
         ↓
scripts/sync_reports.ps1  (valida índices y artefactos publicados)
         ↓
vercel deploy --prod --yes
         ↓
https://rr-aliados-mega-dashboard.vercel.app/
```

## Desarrollo local

```bash
cd skill-orchestrator-dashboard
npm install
npm run dev
```

> **Nota:** `node_modules` en Google Drive puede corromperse. Preferir build en Vercel o instalar fuera de Drive.

### Variables de entorno (`.env.local`)

| Variable | Uso |
|----------|-----|
| `OPENROUTER_API_KEY` / `GROQ_API_KEY` / `OPENCODE_API_KEY` | Chatbot IA (failover automático) |
| `MIROFISH_WEBHOOK_URL` | Opcional — botón Regenerar dispara webhook |
| `MIROFISH_WEBHOOK_SECRET` | Bearer opcional para el webhook |
| `DASHWEB_API_URL` / `DASHWEB_SERVICE_TOKEN` | Proxy servidor read-only hacia DashWeb Core; nunca exponer al cliente |
| `GOOGLE_ANALYTICS_PROPERTY_ID` | GA4 property ID (número o `properties/XXXX`) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON completo de service account (Viewer en GA4) |
| `METRICOOL_API_TOKEN` | Opcional — habilita stub Metricool configurado |
| `METRICOOL_BRAND_ID` | Opcional — brand Metricool |
| `AUTH_SECRET` | Activa auth por roles (HMAC cookie). Sin esto = open/ops |
| `AUTH_OPS_PASSWORD` | Clave rol ops (APIs + UI completa) |
| `AUTH_PITCH_PASSWORD` | Clave rol pitch (Pitch Mode forzado, sin APIs sensibles) |
| `AUTH_CLIENT_PASSWORD` | Clave rol client (igual pitch) |
| `GOOGLE_CALENDAR_CLIENT_ID` | OAuth client ID (Google Cloud → Calendar API) |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_CALENDAR_REFRESH_TOKEN` | Refresh token de `rraliadosteam@gmail.com` (scope `calendar.readonly`) |
| `GOOGLE_CALENDAR_ID` | Opcional — default `rraliadosteam@gmail.com` |

Sin `GOOGLE_CALENDAR_*` completos, `#google-calendar` y `#calendar-widget` muestran badge **DEMO** con agenda operativa MiroFish/Wuunder (no se finge live). Con credenciales válidas en Vercel, `/api/calendar` consulta Calendar API v3 en vivo.

### Google Calendar en Vercel (live)

1. Google Cloud Console → habilitar **Google Calendar API**.
2. Crear OAuth client (Desktop o Web) y obtener refresh token para `rraliadosteam@gmail.com` con scope `https://www.googleapis.com/auth/calendar.readonly`.
3. En Vercel (Production): `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REFRESH_TOKEN` (+ opcional `GOOGLE_CALENDAR_ID`).
4. Redeploy. Verificar `GET /api/calendar` → `"live": true, "demo": false`.

Sin credenciales, GA/Calendar/Metricool muestran badge **DEMO/Mock**. Sin `MIROFISH_WEBHOOK_URL`, Regenerar copia comandos al clipboard.

## Sync de reportes

```powershell
.\scripts\sync_reports.ps1
```

### Cron (Windows Task Scheduler)

| Campo | Valor |
|-------|--------|
| Trigger | Diario 06:00 y 18:00 (tras MiroFish) |
| Programa | `powershell.exe` |
| Argumentos | `-NoProfile -ExecutionPolicy Bypass -File "G:\Mi unidad\RR_Aliados\skill-orchestrator-dashboard\scripts\sync_reports.ps1"` |
| Después | `vercel deploy --prod --yes` |

`/api/automation` marca warning/error si los índices en `public/` tienen mtime >24h / >72h.

### News (posicionamiento)

```powershell
.\scripts\sync_news.ps1
```

También disponible en vivo: `GET /api/news` (RSS Google News CO). Cache: `public/data/news_feed.json`.

### Caja (sin CRM)

Editar `public/data/finance_snapshot.json` tras cambios de capital. El centro de alertas avisa si runway &lt;90 días o capital &lt;3 meses de burn.

## Estructura clave

| Ruta | Contenido |
|------|-----------|
| `src/styles/brand-tokens.css` | Tokens de marca RR |
| `src/components/ui/WidgetCard.tsx` | Primitive de card unificada |
| `src/app/page.tsx` | Layout grid 12 columnas simétrico |
| `src/app/api/pipeline/route.ts` | API pipeline comercial |
| `src/app/api/automation/route.ts` | API salud automatizaciones |
| `src/data/businessContext.ts` | KPIs vivos (runway, Wuunder, meta 5 años) |
| `src/data/skillsCatalog.ts` | Catálogo de skills (fuente de verdad) |
| `src/contexts/PresentationModeContext.tsx` | Modo pitch |
| `public/brand/` | Logo y favicon |

## Deploy

```bash
vercel deploy --prod --yes
```

Verificar skills: `python RR_Aliados\05_IA_Herramientas\Skills\sync_skills.py` → 36=36
