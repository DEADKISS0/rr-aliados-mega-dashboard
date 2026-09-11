# Arquitectura de datos del Mega Dashboard

## Zonas

- `/` es la landing pública. Solo muestra catálogo de desarrollos, prototipos y método.
- `/ops` y `/ops/clientes/*` son privados y requieren rol `ops`.
- Las APIs de proyectos, entidades y demos son internas; no deben ser consumidas por visitantes.

## Fuentes de verdad

| Dominio | Fuente actual | API del dashboard | Estado |
|---|---|---|---|
| Proyectos, pipeline y pagos | Supabase REST | `/api/projects` | Integración inicial; validar esquema y datos |
| Entidades/clientes | Supabase REST | `/api/entities` | Integración inicial; validar esquema y datos |
| Demos SaaS | Supabase REST | `/api/demos` | Integración inicial; validar esquema y datos |
| Reportes MiroFish | índices JSON versionados | APIs de reportes | Derivado; migrar a storage/API después |
| Calendario, GA4, Metricool | APIs externas | endpoints existentes | Opcional; muestran estado DEMO si faltan credenciales |

## Reglas de seguridad

1. `SUPABASE_SERVICE_KEY` solo se usa en Route Handlers del servidor.
2. `SUPABASE_URL` debe venir de entorno; no se fija el proyecto en el código.
3. Las respuestas de datos internos usan `cache: "no-store"`.
4. En producción, si falta `AUTH_SECRET`, `/ops` y las APIs internas responden 503 en vez de quedar abiertas.
5. La landing pública no debe leer proyectos, entidades, pagos ni reportes internos.

La autorización es centralizada en `src/lib/auth.ts` (`apiAllowed`) y aplicada
por `middleware.ts`. Ver `docs/AUDITORIA_2026-09-11.md` para la matriz de
permisos por rol (público / secretario / ops) y su verificación en producción.

## Pendiente de integración

- Confirmar que las tablas `projects`, `entities` y `demos` son el esquema canónico de RR. (Hecho: verificadas en el proyecto `ntgtvtzbjwotuwkiflar`.)
- Agregar validación de respuesta (por ejemplo, Zod) antes de mostrar datos en producción.
- ~~Reemplazar el registro estático de `src/data/clients.ts` por una vista derivada de `entities`~~ Hecho en `src/lib/liveClients.ts`; `clients.ts` queda como metadatos editoriales (enlaces, tags, notas).
- Añadir pruebas de contrato para respuestas Supabase.
- ~~pruebas de autorización para cada endpoint~~ Cubierto a nivel de matriz de roles en `src/lib/auth.test.ts`.
- Migrar `supabase/migrations/20260911_supervisor_events.sql` y `20260911_operation_proposals.sql` (hoy las tablas devuelven 404).
