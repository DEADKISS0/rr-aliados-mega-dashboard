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

## Pendiente de integración

- Confirmar que las tablas `projects`, `entities` y `demos` son el esquema canónico de RR.
- Agregar validación de respuesta (por ejemplo, Zod) antes de mostrar datos en producción.
- Reemplazar el registro estático de `src/data/clients.ts` por una vista derivada de `entities`, conservando allí solo metadatos editoriales y enlaces públicos.
- Añadir pruebas de contrato para respuestas Supabase y pruebas de autorización para cada endpoint.
