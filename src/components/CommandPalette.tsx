"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface Command {
  label: string;
  targetId: string;
}

const COMMANDS: Command[] = [
  { label: "Reporte Estratégico", targetId: "mirofish-reports" },
  { label: "Reporte Optimizaciones", targetId: "estrategia" },
  { label: "Métricas", targetId: "business-metrics" },
  { label: "Pipeline", targetId: "sales-pipeline" },
  { label: "Salud Financiera", targetId: "financial-health" },
  { label: "Apps", targetId: "ecosystem-apps-grid" },
  { label: "Skills", targetId: "skills-catalog" },
];

function fuzzyMatch(query: string, label: string): boolean {
  const q = query.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes(q)) return true;
  // character-by-character fuzzy
  let qi = 0;
  for (let i = 0; i < l.length && qi < q.length; i++) {
    if (l[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? COMMANDS.filter((c) => fuzzyMatch(query, c.label))
    : COMMANDS;

  // Clamp selectedIndex when filtered changes
  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  // Global Ctrl+K listener
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Autofocus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = (key: string, e: React.KeyboardEvent) => {
    if (key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (key === "Enter") {
      const cmd = filtered[selectedIndex];
      if (cmd) execute(cmd);
    }
  };

  const execute = (cmd: Command) => {
    setOpen(false);
    setQuery("");
    const el = document.getElementById(cmd.targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Paleta de comandos"
    >
      <div
        className="rounded-2xl w-full max-w-md mx-4 overflow-hidden"
        style={{
          background: "var(--bg-primary)",
          border: "2px solid var(--ember-30)",
          boxShadow: "0 0 40px rgba(245, 95, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Búsqueda de secciones del dashboard"
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="text-lg" style={{ color: "var(--ember)" }}>
            ⌘
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                navigate(e.key, e);
              }
            }}
            placeholder="Buscar sección..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
            aria-label="Buscar sección del dashboard"
          />
          <kbd
            className="font-mono-label text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: "var(--void-30)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* List */}
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm py-6" style={{ color: "var(--text-muted)" }}>
              Sin resultados
            </p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.targetId}
                onClick={() => execute(cmd)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                  i === selectedIndex ? "" : ""
                }`}
                style={{
                  background: i === selectedIndex ? "var(--ember-20)" : "transparent",
                  color: i === selectedIndex ? "var(--ember-light)" : "var(--text-primary)",
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                aria-label={`Ir a ${cmd.label}`}
              >
                <span className="text-xs font-mono-label opacity-50">#</span>
                <span className="text-sm">{cmd.label}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2 text-[10px] font-mono-label"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <span>↑↓ Navegar</span>
          <span>↵ Ir</span>
          <span>ESC Cerrar</span>
        </div>
      </div>
    </div>
  );
}