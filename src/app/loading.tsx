export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center">
        <div
          className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4"
          style={{
            borderColor: "var(--border-subtle)",
            borderTopColor: "var(--accent)",
          }}
        />
        <p className="text-sm opacity-60">Cargando dashboard…</p>
      </div>
    </div>
  );
}
