"use client";

import { useState, useCallback, FormEvent, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Inline login modal triggered from the header lock icon (public/elevator mode).
 * - Rate-limited: 3 attempts per 60s (local state)
 * - On success: switches theme to "partners" and reloads auth
 * - On error: shake animation + error message
 */
interface AttemptLog {
  count: number;
  resetAt: number;
}

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60_000;
const STORAGE_KEY = "rr-login-attempts";

function loadAttempts(): AttemptLog {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AttemptLog;
      if (Date.now() < parsed.resetAt) return parsed;
    }
  } catch {
    /* ignore */
  }
  return { count: 0, resetAt: Date.now() + WINDOW_MS };
}

function saveAttempts(attempts: AttemptLog) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch {
    /* ignore */
  }
}

export default function PartnerAccessModal() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState<AttemptLog>(loadAttempts);
  const inputRef = useRef<HTMLInputElement>(null);

  const isElevator = theme === "elevator";

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay for animation to settle
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Rate-limit reset
  useEffect(() => {
    if (attempts.count === 0) return;
    const remaining = attempts.resetAt - Date.now();
    if (remaining <= 0) {
      setAttempts({ count: 0, resetAt: Date.now() + WINDOW_MS });
      return;
    }
    const t = setTimeout(() => {
      setAttempts({ count: 0, resetAt: Date.now() + WINDOW_MS });
    }, remaining);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempts.resetAt]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (busy) return;

      // Rate-limit check
      if (Date.now() < attempts.resetAt && attempts.count >= MAX_ATTEMPTS) {
        const remaining = Math.ceil((attempts.resetAt - Date.now()) / 1000);
        setError(`Demasiados intentos. Espera ${remaining}s.`);
        triggerShake();
        return;
      }

      setBusy(true);
      setError(null);

      try {
        const resp = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = await resp.json();

        if (!resp.ok || !data.ok) {
          throw new Error(data.error || "Clave incorrecta");
        }

        // Success — set theme to partners before reload to avoid flash
        try {
          localStorage.setItem("rr-theme", "partners");
        } catch {
          /* ignore */
        }
        const newAttempts = { count: 0, resetAt: Date.now() + WINDOW_MS };
        setAttempts(newAttempts);
        saveAttempts(newAttempts);
        setOpen(false);
        setPassword("");

        // Force a refresh: the page will re-fetch auth + theme adjusts automatically
        window.location.reload();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error";
        setError(msg);
        triggerShake();

        const updated: AttemptLog = {
          count: attempts.count + 1,
          resetAt: attempts.resetAt,
        };
        setAttempts(updated);
        saveAttempts(updated);
      } finally {
        setBusy(false);
      }
    },
    [password, busy, attempts]
  );

  if (!isElevator) return null;

  return (
    <>
      {/* Lock icon trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-lg transition-all"
        style={{
          width: 32,
          height: 32,
          background: "var(--void-30)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: 16,
          cursor: "pointer",
        }}
        title="Acceso socios — inicia sesión para ver datos internos"
        aria-label="Abrir acceso de socios"
      >
        🔒
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Acceso de socios"
          aria-describedby="partner-access-desc"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-dark)",
            padding: "2rem",
            width: 320,
            maxWidth: "90vw",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 20 }}>🔒</span>
            <span className="font-mono-label" style={{ color: "var(--ember)" }}>
              RR ALIADOS
            </span>
          </div>
          <h2
            className="font-display text-xl tracking-wide mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            ACCESO SOCIOS
          </h2>
          <p
            className="text-xs mb-4"
            id="partner-access-desc"
            style={{ color: "var(--text-muted)" }}
          >
            Ingresa tu clave para ver datos internos de operación.
          </p>

          <form onSubmit={onSubmit}>
            <label
              className="block text-xs mb-1"
              htmlFor="partner-password"
              style={{ color: "var(--text-secondary)" }}
            >
              Clave
            </label>
            <input
              ref={inputRef}
              id="partner-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3 py-2 rounded-lg text-sm mb-3"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              required
              disabled={busy}
            />

            <div style={{ minHeight: 24 }}>
              {error && (
                <p
                  className={`text-xs mb-2 ${shake ? "animate-shake" : ""}`}
                  style={{ color: "var(--ember)" }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2 rounded-lg text-sm font-medium transition-opacity"
              style={{
                background: "var(--ember)",
                color: "#fff",
                opacity: busy ? 0.7 : 1,
                border: "none",
                cursor: "pointer",
              }}
            >
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <div className="flex justify-between mt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs btn-ghost !py-1 !px-2"
            >
              Cancelar
            </button>
            {attempts.count > 0 && (
              <span
                className="text-[10px] font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                {MAX_ATTEMPTS - attempts.count} intento
                {MAX_ATTEMPTS - attempts.count !== 1 ? "s" : ""} restante
                {MAX_ATTEMPTS - attempts.count !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}