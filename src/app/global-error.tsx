"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: "#0f0f0f", color: "#f5e6d3", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ maxWidth: 560, padding: 32, border: "1px solid #CE3D1F", borderRadius: 16 }}>
            <p style={{ color: "#CE3D1F", letterSpacing: ".12em", fontSize: 12 }}>RR ALIADOS · ERROR GLOBAL</p>
            <h1>La aplicación necesita reintentar</h1>
            <p>El fallo fue aislado a nivel global. Reintenta para recuperar la sesión.</p>
            <button onClick={() => reset()} style={{ padding: "10px 16px", border: 0, borderRadius: 8, background: "#CE3D1F", color: "white", cursor: "pointer" }}>
              Reintentar
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
