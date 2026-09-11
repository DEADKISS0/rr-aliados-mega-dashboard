# Auditoría del Mega Dashboard — 2026-09-11

Auditoría integral del centro operativo (`/` público + `/ops` interno) tras la
integración de RR Finanzas. Cubre seguridad, arquitectura de datos, cobertura de
APIs y calidad de código. Los hallazgos 🔴/🟡 fueron corregidos en los commits
`d6d14e0` y `7fb0b54`; los hallazgos ⚪ quedan documentados como backlog.

## Resumen ejecutivo

| Área | Estado inicial | Estado tras auditoría |
|---|---|---|
| Secretos hardcodeados en código | ✅ limpio | ✅ limpio |
| Autorización por rol (APIs) | 🔴 permisiva | ✅ verificada en producción |
| Endpoint `/api/documentos` | 🔴 inexistente (404) | ✅ creado |
| Parseo de JSON en rutas de escritura | 🟡 sin guard | ✅ `.catch` seguro |
| Tests automatizados | 🔴 0 | ✅ 6 (matriz de autorización) |
| Bypasses del middleware | 🔴 3 rutas internas | ✅ eliminados |
| Build + typecheck | ✅ | ✅ |

## 1. Seguridad

### 🔴 APIs internas accesibles al rol secretario (corregido)

El middleware clasificaba como ops-only solo un subconjunto de las rutas
financieras. El rol **secretario** (`client`/`pitch`) podía leer:

- `/api/ops/proposals` — **escribe** en `cash_movements` (contenido financiero).
- `/api/calendar` — calendario operativo interno.
- `/api/action-proposals` — ledger de acciones internas.
- `/api/optimizacion-index` — reportes estratégicos.
- `/api/dashweb/overview` — tareas internas del CRM.

**Corrección:** `src/lib/auth.ts` amplía `OPS_ONLY_API_PREFIXES` con
`/api/ops`, `/api/dashweb`, `/api/calendar`, `/api/action-proposals` y
`/api/optimizacion-index`.

**Verificación en producción local** (`next start`, cookies firmadas reales):

```
ENDPOINT                    ops  client  anon
/api/projects               200   403    401
/api/db/financial           200   403    401
/api/cuentas-cobro          200   403    401
/api/personas-cobro         200   403    401
/api/documentos             200   403    401
/api/supervisor             200   403    401
/api/ops/briefing           200   403    401
/api/dashweb/overview       200   403    401
/api/calendar               200   403    401
/api/action-proposals       200   403    401
/api/optimizacion-index     200   403    401
/api/pipeline               200   403    401
/api/analytics              200   200    200   (público)
/api/news                   200   200    200   (público)
```

`/ops` sin sesión → `307 /login?next=/ops`; con rol client → `307 /`.

### 🔴 Bypasses públicos del middleware (corregido)

`middleware.ts` eximía de autenticación `/api/reports-index`,
`/api/report-file` y `/api/optimizacion-index`. Las dos primeras **no existen**
como rutas; la tercera es interna. Se eliminaron los tres bypasses.

### Deuda técnica registrada

- `getSupabaseServer()` usa `SUPABASE_SERVICE_KEY` con fallback a
  `SUPABASE_ANON_KEY`. El fallback silencioso puede enmascarar una mala
  configuración. Recomendado: fallar explícito en producción si falta la
  service key (`⚪ backlog`).
- `RR_ADMIN_TOKEN` no está definido en Vercel; los guardas `requireAdmin` de
  cuentas-cobro/personas-cobro/contabilidad quedan inactivos (`return true`).
  La protección real hoy es el middleware por rol, suficiente, pero conviene
  fijar el token para defensa en profundidad (`⚪ backlog`).

## 2. Arquitectura de datos

### 🔴 `/api/documentos` inexistente (corregido)

La página `/ops/finanzas/documentos` llamaba a `/api/documentos` (GET/POST), pero
la ruta no existía → 404 silencioso. Creada con:

- `GET` — lista documentos (tabla `public.documentos`, verificada en Supabase).
- `POST` — valida `titulo` requerido, `tipo` y `estado` contra allowlists.
- `DELETE` — borrado real por `id`; el frontend ahora elimina en BD, no solo en
  la vista.

### Vista viva de clientes (`7fb0b54`)

- `src/lib/liveClients.ts` fusiona entidades + proyectos de Supabase con los
  metadatos editoriales (enlaces, tags, notas, `drivePath`).
- `/ops/clientes` pasó de 17 fichas estáticas a **27 entidades vivas**.
- Degrada al registro editorial si Supabase no está configurado.

## 3. Calidad de código

- **Tests:** `src/lib/auth.test.ts` cubre la matriz de autorización (público,
  ops, secretario) con 6 casos. `npm test` usa el runner nativo de Node
  (`node --test`), sin dependencias nuevas.
- **Parseo seguro:** `request.json().catch(() => null)` en cuentas-cobro, pdf,
  personas-cobro y contabilidad. Un body inválido devuelve 400, no 500.
- **Código muerto detectado** (`⚪ backlog`): `DashboardShell.tsx` (~24 widgets)
  ya no se monta en ninguna ruta; `roleForcesPitch` solo se usa para el header.
  Se conserva en el historial por decisión de arquitectura (`INTEGRACION_MEGA_FINANZAS.md`).

## 4. Backlog recomendado

1. Fallar explícito si falta `SUPABASE_SERVICE_KEY` en producción.
2. Definir `RR_ADMIN_TOKEN` en Vercel (defensa en profundidad).
3. Migrar `supabase/migrations/20260911_supervisor_events.sql` y
   `20260911_operation_proposals.sql` a Supabase (hoy dan 404 de tabla).
4. Validación de esquema con Zod en las rutas de escritura.
5. Tests de contrato para las respuestas de Supabase.
6. Retirar o archivar formalmente `DashboardShell` y sus widgets muertos.
