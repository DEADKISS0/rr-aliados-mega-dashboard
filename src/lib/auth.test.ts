import { test } from "node:test";
import assert from "node:assert/strict";
import { apiAllowed, tierForRole, type AccessRole } from "./auth.ts";

/**
 * Matriz de autorización de APIs. Es la barrera que decide qué ve cada rol,
 * así que se prueba explícitamente para que un cambio accidental no abra
 * datos internos a visitantes o roles de secretario.
 */

const PUBLIC_ALLOWED = [
  "/api/analytics",
  "/api/news",
  "/api/ecosystem",
  "/api/ecosystem/embed-check",
  "/api/automation",
];

const PUBLIC_DENIED = [
  "/api/projects",
  "/api/entities",
  "/api/demos",
  "/api/client/wuundeer",
  "/api/db/projects",
  "/api/cuentas-cobro",
  "/api/personas-cobro",
  "/api/documentos",
  "/api/supervisor",
  "/api/ops/briefing",
  "/api/ops/proposals",
  "/api/dashweb/overview",
  "/api/calendar",
  "/api/action-proposals",
  "/api/optimizacion-index",
];

const OPS_ONLY = [
  "/api/ops",
  "/api/ops/briefing",
  "/api/ops/proposals",
  "/api/dashweb/overview",
  "/api/pipeline",
  "/api/chat",
  "/api/regenerate",
  "/api/metricool",
  "/api/generate-pdf",
  "/api/projects",
  "/api/entities",
  "/api/demos",
  "/api/client/boga",
  "/api/db/financial",
  "/api/cuentas-cobro",
  "/api/personas-cobro",
  "/api/documentos",
  "/api/supervisor",
  "/api/calendar",
  "/api/action-proposals",
  "/api/optimizacion-index",
];

test("visitante público solo accede a las APIs del showcase", () => {
  for (const path of PUBLIC_ALLOWED) {
    assert.equal(apiAllowed("public", path), true, `public debería acceder a ${path}`);
  }
  for (const path of PUBLIC_DENIED) {
    assert.equal(apiAllowed("public", path), false, `public NO debería acceder a ${path}`);
  }
});

test("rol ops accede a todo", () => {
  for (const path of [...PUBLIC_ALLOWED, ...OPS_ONLY, "/api/cualquier/cosa"]) {
    assert.equal(apiAllowed("ops", path), true, `ops debería acceder a ${path}`);
  }
});

test("secretario (client/pitch) no accede a APIs ops-only", () => {
  for (const role of ["client", "pitch"] as AccessRole[]) {
    for (const path of OPS_ONLY) {
      assert.equal(apiAllowed(role, path), false, `${role} NO debería acceder a ${path}`);
    }
  }
});

test("secretario conserva acceso a APIs no sensibles", () => {
  for (const role of ["client", "pitch"] as AccessRole[]) {
    assert.equal(apiAllowed(role, "/api/analytics"), true);
    assert.equal(apiAllowed(role, "/api/news"), true);
  }
});

test("rutas no-API siempre permitidas", () => {
  assert.equal(apiAllowed("public", "/ops"), true);
  assert.equal(apiAllowed("public", "/algo"), true);
});

test("tierForRole clasifica los tres niveles", () => {
  assert.equal(tierForRole("ops"), "ops");
  assert.equal(tierForRole("public"), "public");
  assert.equal(tierForRole("client"), "auth");
  assert.equal(tierForRole("pitch"), "auth");
});
