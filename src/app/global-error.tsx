"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#ededed",
            fontFamily: "system-ui, sans-serif",
            margin: 0,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 24px",
                borderRadius: 16,
                background: "rgba(234,179,8,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              ⚠️
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              Error del servidor
            </h1>
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24, lineHeight: 1.5 }}>
              El dashboard no pudo cargarse. Esto es un error temporal.
              <br />
              Presiona el botón para reintentar.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                background: "#ededed",
                color: "#0a0a0a",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
            {error?.digest && (
              <p style={{ marginTop: 16, fontSize: 11, opacity: 0.3 }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
