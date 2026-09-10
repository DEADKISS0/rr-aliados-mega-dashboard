"use client";
import { useState, useEffect } from "react";

export interface AuditEntry {
  timestamp: string;
  role: string;
  action: "login" | "logout";
}

export default function AuditLogWidget() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/audit_log.json")
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card p-4 animate-in">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🛡️</span>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Auditoría de Acceso</h3>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cargando…</p>
      </div>
    );
  }

  const recent = entries.slice(0, 20);

  return (
    <div className="card p-4 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🛡️</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Auditoría de Acceso</h3>
        <span className="skill-badge active">{entries.length} eventos</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Sin eventos registrados.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <th className="text-left py-1" style={{ color: "var(--text-muted)" }}>Timestamp</th>
                <th className="text-left py-1" style={{ color: "var(--text-muted)" }}>Rol</th>
                <th className="text-left py-1" style={{ color: "var(--text-muted)" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((e, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="py-1.5" style={{ color: "var(--text-primary)" }}>
                    {new Date(e.timestamp).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="py-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded" style={{
                      background: e.role === "ops" ? "rgba(139,92,246,0.2)" : e.role === "pitch" ? "rgba(59,130,246,0.2)" : "rgba(100,116,139,0.2)",
                      color: e.role === "ops" ? "#a78bfa" : e.role === "pitch" ? "#60a5fa" : "#94a3b8"
                    }}>{e.role}</span>
                  </td>
                  <td className="py-1.5">
                    <span style={{ color: e.action === "login" ? "var(--success)" : "var(--text-muted)" }}>
                      {e.action === "login" ? "🔓 login" : "🔒 logout"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}