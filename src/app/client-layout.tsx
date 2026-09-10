"use client";

import { Component, type ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PresentationModeProvider } from "@/contexts/PresentationModeContext";
import { AuthProvider } from "@/contexts/AuthContext";

class SafeBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Reportar el error
    fetch("/api/__debug", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: error?.message,
        stack: error?.stack,
        href: window.location.href,
      }),
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="text-center max-w-md px-6">
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(234,179,8,0.1)" }}
            >
              ⚠️
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Error inesperado
            </h1>
            <p className="text-sm mb-4 opacity-70" style={{ color: "var(--text-secondary)" }}>
              Algo salió mal al cargar esta página.
            </p>
            <p className="text-xs font-mono mb-4" style={{ color: "var(--text-muted)" }}>
              {this.state.error.message}
            </p>
            <button
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SafeBoundary>
      <AuthProvider>
        <PresentationModeProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </PresentationModeProvider>
      </AuthProvider>
    </SafeBoundary>
  );
}
