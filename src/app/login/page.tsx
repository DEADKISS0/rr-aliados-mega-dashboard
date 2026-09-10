"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        throw new Error(data.error || "Login falló");
      }
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm p-6 rounded-xl"
      style={{ background: "rgba(15,15,15,0.85)", border: "1px solid rgba(206,61,31,0.35)" }}
    >
      <p className="font-mono-label text-[10px] tracking-widest mb-2" style={{ color: "#CE3D1F" }}>
        RR ALIADOS
      </p>
      <h1 className="font-display text-2xl tracking-wide mb-1">MEGA DASHBOARD</h1>
      <p className="text-xs mb-5" style={{ color: "#968E93" }}>
        Roles: ops · pitch · client. Ingresa la clave de tu rol.
      </p>
      <label className="block text-xs mb-1" htmlFor="password">
        Clave
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3"
        style={{ background: "#1a1a1a", border: "1px solid #3F0035", color: "#F5E6D3" }}
        required
      />
      {error && (
        <p className="text-xs mb-3" style={{ color: "#CE3D1F" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full py-2 rounded-lg text-sm font-medium"
        style={{ background: "#CE3D1F", color: "#F5E6D3", opacity: busy ? 0.7 : 1 }}
      >
        {busy ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(145deg, #0F0F0F, #3F0035)",
        color: "#F5E6D3",
      }}
    >
      <Suspense fallback={<p className="text-sm">Cargando…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
