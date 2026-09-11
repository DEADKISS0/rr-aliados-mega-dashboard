# Integración Mega Dashboard + RR Finanzas

## Estado

Primera integración completada en la rama `merge/rr-finanzas-core`.

## Decisión de arquitectura

- **Mega Dashboard** conserva la marca, la landing pública, el catálogo de clientes,
  prototipos, Instagram y desarrollos internos.
- **RR Finanzas** pasa a ser el núcleo operativo interno en `/ops/finanzas`.
- `/ops` redirige al núcleo financiero para evitar la navegación saturada del
  dashboard anterior.
- Las herramientas experimentales de Mega permanecen en el historial del repo,
  pero ya no se exponen como menú operativo.

## Módulos incorporados

- Finanzas, gastos, movimientos, pagos, calendario y brechas.
- CRM, proyectos, servicios y talento.
- Contabilidad central.
- Cuentas de cobro y generación privada de PDF.
- Documentos e importación de Excel.
- APIs de Supabase para snapshots, proyectos, movimientos y servicios.
- Firma corporativa `public/firma-rr.png`.

## Seguridad aplicada

Las APIs financieras (`/api/db`, `/api/cuentas-cobro`, `/api/personas-cobro` y
`/api/documentos`) quedaron clasificadas como solo-ops en `src/lib/auth.ts`.
En producción, sin cookie de sesión válida, responden `401`.

## Validación realizada

- `npm run build`: correcto.
- `/ops` → `/ops/finanzas`: correcto.
- `/ops/finanzas` sin sesión en producción: redirección a `/login`.
- `/api/db/financial` sin sesión en producción: `401`.
- Landing pública: `200`.

## Siguiente fase

1. Probar con las variables reales de Vercel y Supabase.
2. Validar login Google y clave de respaldo en preview.
3. Revisar CRUD de contabilidad, cuentas de cobro y documentos con datos reales.
4. Hacer revisión visual responsive.
5. Promover a producción.
6. Mantener `rr-finanzas` como respaldo hasta completar la aceptación.
