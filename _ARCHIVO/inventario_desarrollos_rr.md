# Inventario Maestro de Desarrollos y URLs — RR ALIADOS

> Fuente: `rr_aliados/Deploys_Indexer.md` + `rr_aliados/06_Clientes/URLS.md`
> Actualizado: 2026-09-09

## Clientes / Prospectos

| Cliente | URL | Tipo | Estado |
|---------|-----|------|--------|
| Wuundeer (prototipo) | https://wuundeer-prototype.vercel.app/ | Prototipo B2B | Activo |
| Wuundeer (precontrato) | https://manepeqsicoda.github.io/Wuundeer_PreContract/ | Propuesta comercial | Activo |
| Wuundeer (pitch) | https://manepeqsicoda.github.io/WuunderPitch/ | Pitch deck | Activo |
| BOGA (prototipo RR) | https://junisama-seven.vercel.app/ | Prototipo pitch | Activo |
| BOGA / Junisama (landing prod) | https://junisama.com.co/ | Landing cliente | Producción |
| BOGA (pitch) | https://junisama-seven.vercel.app/pitch/ | Pitch RR | Activo |
| Real Seguros | https://real-seguros-web.vercel.app/ | Prototipo corredora seguros | Prototipo |
| Café Angústula | https://augustula-cafe.vercel.app/ | Landing finca cafetera | Prototipo |
| FisioVida Medellín | https://fisio-vida-seven.vercel.app/ | Prototipo fisioterapia | Prototipo |
| Unidos Fundación Social | https://unidos-fundacion-social.vercel.app/ | SPA fundación social | Prototipo |
| Soluciones Agropecuarias | https://soluciones-agropecuarias-two.vercel.app/ | Agro B2G/B2B | Prototipo |
| Siraitia | (sin deploy público) | Prospecto | Documentación |
| Alma y Mente | (sin deploy público) | Prospecto | Estrategia |
| Amsterdam | (sin deploy público) | Prospecto | Transcripciones |
| Satiro Sushi | (sin deploy público) | Prospecto | Contexto |
| Zapatos | (sin deploy público) | Prospecto | Contexto |

## Herramientas internas RR

| Deploy | URL | Descripción | Estado |
|--------|-----|-------------|--------|
| RR Mega Dashboard | https://rr-aliados-mega-dashboard.vercel.app/ | Centro comando centralizado | Activo |
| RR Web Corporativa | https://rr-web-omega.vercel.app/ | Web corporativa RR | Prototipo |
| RR Kotizador | https://rr-kotizador.vercel.app/ | Cotizador servicios + cronogramas | Activo |
| Primer Contacto Web | https://primer-contacto-web.vercel.app/ | Captura prospectos | Prototipo |
| RR DashWEB | https://dashweb-core-frontend-beta.up.railway.app/ | ERP/CRM interno | Beta |
| RR Finanzas | https://rr-finanzas.vercel.app/ | Dashboard finanzas | Activo |
| RR Skills Hub | https://rr-skills-hub.vercel.app/ | Catálogo skills IA | Activo |
| RR SaaS Vertical | https://rr-saas-vertical.vercel.app/ | CRM panaderías | Activo |
| Altruismo | https://altruismo-web.vercel.app/es | Herramientas web comunidad | Activo |

## Kimi Pages

| Deploy | URL | Descripción |
|--------|-----|-------------|
| Company Hub | https://x3hlysjfyb4ta.kimi.page/ | Hub conocimiento central |
| Skills Hub (Kimi) | https://yvapiyrswankg.kimi.page/ | Catálogo skills |
| Generador Cuenta Cobro | https://jzvemwtafnfcw.kimi.page/ | Generador cuentas |
| Dashboard Adquisición | https://3mpm6kcgvmpz4.kimi.page/#panel | Panel adquisición |

## Otros repos GitHub

| Repo | Descripción |
|------|-------------|
| rr-web-corporativa | Web corporativa RR |
| rr-commander-bot | Bot Telegram RR |
| rr-finanzas | Dashboard finanzas |
| rr-dashweb | ERP/CRM interno |
| rr-saas-vertical | CRM panaderías |
| rr-skills-hub | Skills Hub |
| rr-kotizador | Cotizador |
| chatbot-app-web | Chatbot web |
| ruleta-de-marca | Ruletas premios white-label |
| metrik-lab | Metrik Lab |
| altruismo-web | Altruismo |
| altruismo | Altruismo comunidad |
| rr-aliados-mega-dashboard | Mega Dashboard |
| SIRAITIA | Prototipo Siraitia |
| Vietnam-Green-Life | Vietnam Green Life |
| DASHBOAR-PLANES-VENTAS | Dashboard planes ventas |

## Relaciones entre deployments

```
rr-web-omega (Web Corporativa)
  ├── rr-kotizador (cotizador de servicios)
  ├── primer-contacto-web (captura prospectos)
  └── Company Hub (Kimi)

rr-kotizador
  ├── Precios → 04_Finanzas/RR_Aliados_Precios_Actualizado.xlsx
  ├── Cronogramas → 08_Dev/Proyectos/RR_Kotizador/
  └── Integración futura → DashWEB

Skills Hub
  ├── Skills CREADAS → 05_IA_Herramientas/Skills/CREADAS/
  ├── Skills NATIVAS → 05_IA_Herramientas/Skills/NATIVAS/
  └── Skills USER → 05_IA_Herramientas/Skills/USER/

Company Hub
  ├── Estrategia → 01_Estrategia/
  ├── Clientes → 06_Clientes/
  ├── Finanzas → 04_Finanzas/
  └── Admin → 09_Admin/
```
