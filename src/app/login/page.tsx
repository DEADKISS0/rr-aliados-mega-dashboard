"use client";

import { Suspense, useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/ops";
  const oauthError = search.get("error");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (oauthError) {
      if (oauthError.startsWith("no_autorizado:")) {
        setError(`No autorizado: ${oauthError.split(":")[1] || "correo fuera de lista"}`);
      } else if (oauthError === "access_denied") {
        setError("Acceso denegado. No completaste el login con Google.");
      } else {
        setError("No se pudo completar el login con Google. Intenta de nuevo.");
      }
    }
  }, [oauthError]);

  const onGoogle = () => {
    window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`;
  };

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
        Entra con Google o con la clave de respaldo.
      </p>

      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="w-full py-2.5 rounded-lg text-sm font-medium mb-3 flex items-center justify-center gap-2"
        style={{ background: "#FFFFF3", color: "#070001", opacity: busy ? 0.7 : 1 }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 my-4">
        <span style={{ flex: 1, height: 1, background: "rgba(255,255,243,.15)" }} />
        <span className="text-[10px]" style={{ color: "#968E93" }}>o</span>
        <span style={{ flex: 1, height: 1, background: "rgba(255,255,243,.15)" }} />
      </div>

      <label className="block text-xs mb-1" htmlFor="password" style={{ color: "#FFFFF3" }}>
        Clave de respaldo
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
        className="w-full py-2 rounded-lg text-sm font-medium mb-3"
        style={{ background: "#BE076D", color: "#FFFFF3", opacity: busy ? 0.7 : 1 }}
      >
        {busy ? "Entrando…" : "Entrar con clave"}
      </button>
      <div className="text-center">
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
        <img src={BRAND.symbolFucsia} alt="" width={28} height={28} />
        <span className="font-display tracking-widest" style={{ color: "#FFFFF3" }}>RR ALIADOS</span>
      </Link>
      <Suspense fallback={<p className="text-sm" style={{ color: "#FFFFF3" }}>Cargando…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
