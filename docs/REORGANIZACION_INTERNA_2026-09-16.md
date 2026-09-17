# Reorganizacion interna del Mega Dashboard

Fecha: 2026-09-16

## Decision

La landing publica del Mega Dashboard se mantiene como esta por ahora. El apartado interno (`/ops`) se rehace como centro de mando para organizar los desarrollos de RR por funcion operativa, no por orden historico de creacion.

## Desarrollos que quedan dentro del interno

| Desarrollo | Rol | Decision |
|---|---|---|
| RR Finanzas | Core financiero | Fuente principal de caja, cuentas de cobro, documentos y contabilidad. |
| RR Kotizador | Comercial | Entra al flujo interno como modulo comercial; no debe quedar como link suelto. |
| RR Finanzas Dashboard | Legacy financiero | Se conserva temporalmente solo para auditar si tiene datos unicos. |
| chatbot/finanzas_app | Legacy financiero | Sus funciones utiles deben pasar a RR Finanzas; luego se archiva. |
| RR Content Hub | Core contenido | Sigue separado por su dominio y datos `rr_hub_*`, pero se opera desde el Mega Dashboard. |
| RR Precontratos | Core documentos | Sigue separado por estabilidad de artefactos publicados. |
| RR Commander Bot | Core automatizacion | Sigue como servicio separado; Mega Dashboard debe mostrar estado, comandos y bitacora. |

## Desarrollos que salen del interno

| Desarrollo | Motivo | Reemplazo |
|---|---|---|
| RR Skills Hub | Duplica capacidades que deben vivir dentro del Mega Dashboard. | Seccion interna de capacidades/automatizacion. |
| Primer Contacto Web | Parte el pipeline comercial. | Modulo comercial del Mega Dashboard + RR Kotizador. |

## Regla de organizacion

- **Core:** se opera todos los dias y queda visible.
- **Consolidar:** se mantiene visible solo mientras entra al flujo del Mega Dashboard.
- **Retirar:** se audita, se extrae lo util y se archiva.
- **Eliminar infraestructura:** no se hace desde esta reorganizacion sin confirmacion humana explicita.

## Implementacion inicial

- `src/data/developments.ts` conserva `DEVELOPMENTS` para la landing publica.
- `src/data/developments.ts` agrega `OPS_DEVELOPMENTS` y `REMOVED_FROM_INTERNAL` para el interno.
- `/ops` se convierte en centro de mando de los desarrollos internos.
- `/ops/desarrollos` se convierte en matriz de decision con datos, fuente, estado y siguiente paso.
