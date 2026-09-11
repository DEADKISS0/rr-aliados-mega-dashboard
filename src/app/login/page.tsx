"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/ops";
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
      style={{ background: "rgba(7,0,1,0.9)", border: "1px solid rgba(190,7,109,0.4)", boxShadow: "10px 10px 0 rgba(222,209,22,0.18)" }}
    >
      <p className="font-mono-label text-[10px] tracking-widest mb-2" style={{ color: "#DED116" }}>
        RR ALIADOS
      </p>
      <h1 className="font-display text-2xl tracking-wide mb-1" style={{ color: "#FFFFF3" }}>
        ACCESO INTERNO
      </h1>
      <p className="text-xs mb-5" style={{ color: "#968E93" }}>
        Ingresa la clave de tu rol para entrar al centro de operaciones.
      </p>
      <label className="block text-xs mb-1" htmlFor="password" style={{ color: "#FFFFF3" }}>
        Clave
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3"
        style={{ background: "#12040e", border: "1px solid #3F0035", color: "#FFFFF3" }}
        required
      />
      {error && (
        <p className="text-xs mb-3" style={{ color: "#E43A92" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full py-2 rounded-lg text-sm font-medium"
        style={{ background: "#BE076D", color: "#FFFFF3", opacity: busy ? 0.7 : 1 }}
      >
        {busy ? "Entrando…" : "Entrar"}
      </button>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-xs underline"
          style={{ color: "#968E93" }}
        >
          ← Volver al inicio
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(145deg, #070001, #300924, #190612)",
        color: "#FFFFF3",
      }}
    >
      <Link href="/" className="mb-6 inline-flex items-center gap-2" style={{ color: "#FFFFF3", textDecoration: "none" }}>
        <img src="/brand/rr/simbolo_transparent_fucsia.png" alt="" width={28} height={28} />
        <span className="font-display tracking-widest" style={{ color: "#FFFFF3" }}>RR ALIADOS</span>
      </Link>
      <Suspense fallback={<p className="text-sm" style={{ color: "#FFFFF3" }}>Cargando…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
