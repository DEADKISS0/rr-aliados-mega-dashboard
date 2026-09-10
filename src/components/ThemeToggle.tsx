"use client";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="text-sm px-2 py-1 rounded transition-colors hover:bg-white/10"
      style={{ color: "var(--ash)", background: "var(--void-30)", border: "1px solid var(--border)" }}
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label="Alternar tema claro/oscuro"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
