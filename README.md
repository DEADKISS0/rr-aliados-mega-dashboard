# RR ALIADOS — Mega Dashboard

Centro de comando interno de RR ALIADOS S.A.S. — Brutalismo Estratégico Colombiano.

**Producción:** https://rr-aliados-mega-dashboard.vercel.app/

---

## ¿Qué es?

El Mega Dashboard es el centro de comando centralizado de RR ALIADOS. Unifica en un solo lugar:

- **Métricas del negocio** en tiempo real (capital, runway, MRR, clientes)
- **Reportes IA** (MiroFish, predicciones, optimizaciones estratégicas)
- **Catálogo de skills** instaladas y disponibles
- **Salud financiera** con escenarios (Wuunder abierto/cerrado)
- **Pipeline comercial** y automatizaciones
- **Meta 5 años** (2026 → 2031) con visión y progreso

## Acceso

| URL | Uso |
|-----|-----|
| `https://rr-aliados-mega-dashboard.vercel.app/` | Producción — acceso público (modo Elevator) |
| `http://localhost:3000/` | Desarrollo local |

### Credenciales

| Rol | Descripción | Cómo acceder |
|-----|-------------|--------------|
| **Público / Elevator** | Vista cliente/inversor — oculta skills, ops y datos sensibles | Sin autenticación |
| **Partners / Ops** | Vista completa — datos internos, pipeline, costos, reportes | Click en 🔒 → ingresar clave de acceso |
| **Pitch** | Vista presentación comercial | Atajo `P` + Pack Pitch PDF |

Las contraseñas de acceso se configuran mediante variables de entorno en Vercel (`AUTH_OPS_PASSWORD`, `AUTH_PITCH_PASSWORD`, `AUTH_CLIENT_PASSWORD`).

## Dos modos de visualización

### Modo Elevator (público)

- Tema claro (warm parchment)
- Muestra showcase, reportes públicos, catálogo de skills
- Oculta datos financieros internos, pipeline, costos de equipo
- Ideal para clientes potenciales, inversores, reclutamiento

### Modo Partners (admin)

- Tema oscuro (pitch/void)
- Muestra todos los widgets con datos en vivo
- Incluye pipeline comercial, costos, fechas clave, escenarios
- Acceso por contraseña compartida (HMAC cookie)

## Stack tecnológico

- **Framework:** Next.js 16 + React 19 + TypeScript
- **Estilos:** Tailwind 4 + CSS custom properties (brandkit)
- **Design tokens:** Pitch / Void / Ember / Parchment / Ash
- **Fuentes:** Bebas Neue, Inter, IBM Plex Mono
- **PWA:** Manifest JSON + Service Worker con cache-first
- **Despliegue:** Vercel (producción + preview)
- **Reportes:** Python (MiroFish Lite + scripts de optimización)

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Edge + Serverless)             │
│  ┌──────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │ Next.js  │  │  API Routes │  │  Service Worker     │   │
│  │ (SSR/SSG)│  │ /api/*     │  │  (offline cache)    │   │
│  └────┬─────┘  └─────┬──────┘  └────────────────────┘   │
│       │              │                                    │
│  ┌────▼──────────────▼──────────────────────────────┐   │
│  │           public/ (static assets)                  │   │
│  │  /reports/  /data/  /brand/  /optimizacion/      │   │
│  └───────────────────────────────────────────────────┘   │
│       │              │                                    │
│       ▼              ▼                                    │
│  ┌──────────┐  ┌────────────┐                            │
│  │ DashWeb  │  │ Google     │  ┌──────────────────────┐  │
│  │ Core API │  │ Calendar   │  │ MiroFish / Skills    │  │
│  │ (CRM)    │  │ / GA4 / RSS│  │ (Python pipeline)    │  │
│  └──────────┘  └────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Flujo de datos

1. **Reportes IA:** scripts Python generan JSON/PDF en `public/reports/`
2. **Pipeline:** API `/api/pipeline` consulta datos financieros y contexto
3. **Skills:** catálogo desde `src/data/skillsCatalog.ts` (fuente de verdad)
4. **Widgets:** componentes React consumen datos estáticos + APIs serverless
5. **PWA:** service worker cachea shell y sirve offline

## Cómo desplegar

```bash
cd skill-orchestrator-dashboard
vercel deploy --prod --yes
```

Verificar skills después del deploy:
```bash
python "G:\Mi unidad\RR_Aliados\05_IA_Herramientas\Skills\sync_skills.py"
```

## Pipeline de reportes (GitHub Actions)

El pipeline de reportes se ejecuta mediante **GitHub Actions** y/o **Windows Task Scheduler** local:

### Workflow automatizado (GitHub Actions)

```yaml
name: Sync Reports
on:
  schedule:
    - cron: '30 5,17 * * *'   # 05:30 y 17:30 UTC
  workflow_dispatch:           # botón manual

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run MiroFish reports
        run: |
          python enhanced_report.py
          python optimization_report.py
          python reporte_optimizacion_estrategica.py
      - name: Sync to public/
        run: |
          scripts/sync_reports.ps1
      - name: Deploy to Vercel
        run: npx vercel deploy --prod --yes
```

### Pipeline local (Windows Task Scheduler alternativo)

```powershell
Trigger: Diario tras MiroFish (05:30 / 17:30)
Programa: powershell.exe
Argumentos: -NoProfile -ExecutionPolicy Bypass -File "G:\Mi unidad\RR_Aliados\skill-orchestrator-dashboard\scripts\sync_reports.ps1"
Después: vercel deploy --prod --yes
```

### Flujo completo

```
enhanced_report.py → public/reports/ + public/data/mirofish/
optimization_report.py → public/optimizacion/
reporte_optimizacion_estrategica.py → public/reports/ + action_ledger.json
         ↓
scripts/sync_reports.ps1  (valida 3 índices + ledger + scan de secretos)
         ↓
vercel deploy --prod --yes
         ↓
https://rr-aliados-mega-dashboard.vercel.app/
```

### Gate de embeds (ecosistema)

Antes de desplegar (o justo después en prod):

```powershell
npm run check:embeds
# o: .\scripts\check_ecosystem_embeds.ps1 -BaseUrl https://rr-aliados-mega-dashboard.vercel.app
```

Consulta `GET /api/ecosystem/embed-check` y falla (exit 1) si alguna app con `embed: iframe|auto` tiene hard-block de framing.

## Widgets de reportes IA

| Widget | Índice / fuente | Notas |
|--------|-----------------|-------|
| Predicciones | `/reports/predicciones_index.json` | PDF + KPIs |
| Estrategia | `/reports/estrategicos_index.json` | Progreso calibrado |
| Optimización temporal | `/optimizacion/reports_index.json` | Diario/semanal/mensual/dashboard |
| Tablero de lectura rápida | `/data/action_ledger.json` + `/data/mirofish/*` | Matriz de acciones, progreso, charts |
| Propuestas de Acción | `/api/action-proposals` | Cola read-only → DashWeb con confirmación |
| Señales MiroFish | `/data/mirofish/patterns.json` | Actividad documental (no salud de negocio) |

## Funcionalidades clave

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
| **PWA** | `manifest.json` con iconos brand + service worker offline |

## PWA (Progressive Web App)

El dashboard es instalable como aplicación:

- **Manifest:** `public/manifest.json` con nombre, iconos y colores de marca
- **Service Worker:** `public/sw.js` — estrategia cache-first para assets estáticos, network-first para APIs
- **Offline:** navegación básica del shell funciona sin conexión
- **Meta tags:** viewport, apple-mobile-web-app-capable, theme-color

Para instalar en Android/iOS/Desktop: abre el dashboard en el navegador → menú "Instalar" o "Añadir a pantalla de inicio".

## Accesibilidad

El dashboard implementa prácticas de accesibilidad:

- **Skip-to-content:** enlace al inicio del layout
- **ARIA labels:** todos los elementos interactivos en CommandPalette, QRCodeModal, PartnerAccessModal
- **ARIA roles:** `role="dialog"`, `aria-modal="true"` en modales y paletas
- **ARIA-expanded:** secciones colapsables en SkillsCatalog
- **Focus visible:** outline ember en `:focus-visible`
- **Touch targets:** mínimo 44px en dispositivos táctiles
- **Contraste AA:** verificado en ambos temas (oscuro y elevator)
- **Reduced motion:** respeta `prefers-reduced-motion`
- **High contrast:** soporte para `prefers-contrast: more`

## Estructura del proyecto

| Ruta | Contenido |
|------|-----------|
| `src/app/layout.tsx` | Layout raíz con metadatos, PWA y skip-to-content |
| `src/app/page.tsx` | Layout grid 12 columnas simétrico |
| `src/components/` | Widgets, modales, paletas |
| `src/data/` | Fuentes de verdad (skills, métricas, contexto) |
| `src/contexts/` | Auth, Theme, PresentationMode |
| `src/styles/` | Brand tokens, elevator theme, globals |
| `public/` | Assets estáticos, reports, data, SW |
| `scripts/` | Scripts PowerShell de sync y utilidades |
| `src/app/api/` | API routes serverless |

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

**Script asistido (recomendado):**

```powershell
cd skill-orchestrator-dashboard
.\scripts\setup_google_live.ps1 -PushToVercel
vercel deploy --prod --yes
```

Pasos en Google Cloud (una vez):

1. Habilitar **Google Calendar API**.
2. Pantalla de consentimiento OAuth + usuario de prueba `rraliadosteam@gmail.com`.
3. Credenciales → OAuth client **Desktop** (o Web) con redirect `http://127.0.0.1:8765/`.
4. Ejecutar el script arriba (abre el navegador, guarda `.env.local` y opcionalmente sube a Vercel).
5. Verificar `GET /api/calendar` → `"live": true, "demo": false`.

### Google Analytics GA4 (live)

No se puede automatizar sin tu JSON de service account:

1. Cloud Console → Service Account → Key JSON.
2. GA4 → Admin → Property Access → añadir `client_email` como **Viewer**.
3. Vercel Production: `GOOGLE_ANALYTICS_PROPERTY_ID` + `GOOGLE_SERVICE_ACCOUNT_KEY` (JSON en una línea).
4. `vercel deploy --prod --yes` → `GET /api/analytics` sin badge DEMO.

Sin credenciales, GA/Calendar/Metricool muestran badge **DEMO/Mock**. Sin `MIROFISH_WEBHOOK_URL`, Regenerar copia comandos al clipboard.

## Sync de reportes

```powershell
.\scripts\sync_reports.ps1
```

Aceptación end-to-end (local + prod):

```bash
python "G:\Mi unidad\RR_Aliados\05_IA_Herramientas\mirofish_lite\verify_report_crm.py"
```

### Cron (Windows Task Scheduler)

| Campo | Valor |
|-------|--------|
| Trigger | Diario tras MiroFish (recomendado 05:30 / 17:30) |
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

Editar `public/data/finance_snapshot.json` tras cambios de capital. El centro de alertas avisa si runway <90 días o capital <3 meses de burn.

## DashWeb Core (CRM)

- Única fuente de verdad de proyectos, tareas y participantes.
- Credenciales solo servidor: `DASHWEB_API_URL`, `DASHWEB_SERVICE_TOKEN`.
- Flujo: propuesta → selector de proyecto → confirmación individual → tarea **sin asignado** → asignación en diálogo separado.
- Matching primario por `sourceActionId`; el match por título es sugerencia y requiere confirmación.
- Datos demo/test se excluyen por defecto de listados y sugerencias.

## Licencia

Uso interno — RR ALIADOS S.A.S.