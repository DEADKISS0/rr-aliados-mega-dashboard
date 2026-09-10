"use client";
import Image from "next/image";
import { STATS } from "@/data/skillsCatalog";
import ThemeToggle from "./ThemeToggle";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";
import { usePresentationMode } from "@/contexts/PresentationModeContext";
import { useAuth } from "@/contexts/AuthContext";
import PitchPackButton from "@/components/ui/PitchPackButton";

interface HeaderProps {
  onMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarCollapseToggle?: () => void;
}

export default function Header({
  onMenuToggle,
  sidebarCollapsed = false,
  onSidebarCollapseToggle,
}: HeaderProps) {
  const { isPresentationMode, togglePresentationMode } = usePresentationMode();
  const { role, forcesPitch, openMode, logout } = useAuth();

  const onPitchClick = () => {
    if (forcesPitch && isPresentationMode) {
      logout();
      return;
    }
    togglePresentationMode();
  };

  return (
    <>
      <header
        className="flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl"
        style={{
          height: "var(--header-height)",
          paddingLeft: "var(--page-x)",
          paddingRight: "var(--page-x)",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-glass)",
          boxShadow: "var(--shadow-inset)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="md:hidden btn-ghost !p-2 !text-base"
              aria-label="Abrir menú de navegación"
            >
              ☰
            </button>
          )}
          {onSidebarCollapseToggle && (
            <button
              onClick={onSidebarCollapseToggle}
              className="hidden md:inline-flex btn-ghost !p-2 !text-sm"
              aria-label={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
              title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {sidebarCollapsed ? "»" : "«"}
            </button>
          )}
          <div
            className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
            style={{ border: "1px solid var(--border-accent)", boxShadow: "var(--shadow-ember-sm)" }}
          >
            <Image
              src="/brand/logo.svg"
              alt="RR ALIADOS"
              width={40}
              height={40}
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1
              className="font-display text-base sm:text-lg tracking-widest leading-none truncate"
              style={{ color: "var(--text-primary)" }}
            >
              MEGA DASHBOARD
            </h1>
            <p className="font-mono-label mt-1 truncate hidden sm:block" style={{ color: "var(--text-muted)" }}>
              RR ALIADOS · Con las manos en el fuego
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <GlobalSearch />
          <span
            className="hidden md:inline-flex font-mono-label px-2 py-1 rounded text-[10px]"
            style={{
              background: "var(--void-30)",
              border: "1px solid var(--border)",
              color: "var(--ember-light)",
            }}
            title={
              openMode
                ? "Modo abierto: AUTH_SECRET no está en Vercel. Vista Ops completa sin login."
                : `Sesión activa · rol ${role}. Cambia con login (/login).`
            }
            aria-label={openMode ? "Modo open/ops sin autenticación" : `Rol ${role}`}
          >
            {openMode ? "OPEN/OPS" : String(role).toUpperCase()}
          </span>
          {!forcesPitch && (
            <button
              onClick={onPitchClick}
              className="btn-ghost !py-1.5 !px-2.5 hidden sm:inline-flex"
              title="Oculta tools internas para presentar a cliente/inversor (atajo P). Genera Pack Pitch desde la barra."
              aria-pressed={isPresentationMode}
            >
              {isPresentationMode ? "Salir del Pitch" : "Modo Pitch"}
            </button>
          )}
          {!openMode && (
            <button onClick={logout} className="btn-ghost !py-1 !px-2 text-[10px] hidden sm:inline-flex" title="Cerrar sesión">
              Salir
            </button>
          )}
          <NotificationCenter />
          <ThemeToggle />
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
            title="Skills instaladas — ir al catálogo"
            aria-label={`${STATS.installed} skills activas`}
            onClick={() => {
              const el = document.getElementById("skills-catalog");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <div className="pulse-dot" />
            <span className="font-mono-label" style={{ color: "var(--success)" }}>
              {STATS.installed} activas
            </span>
          </button>
          <div
            className="hidden lg:flex items-center font-mono-label px-3 py-1.5 rounded-lg"
            style={{ background: "var(--void-30)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
            title="Total de skills en el catálogo"
          >
            {STATS.total} total
          </div>
        </div>
      </header>

      {isPresentationMode && (
        <div
          className="sticky z-20 flex items-center justify-between gap-3 px-4 py-2"
          style={{
            top: "var(--header-height)",
            background: "var(--ember-20)",
            borderBottom: "1px solid var(--ember-30)",
            color: "var(--parchment)",
          }}
        >
          <p className="text-xs sm:text-sm font-light min-w-0">
            <span className="font-mono-label" style={{ color: "var(--ember-light)" }}>
              {forcesPitch ? `Rol ${role}` : "Modo Pitch"}
            </span>
            {" — "}vista para cliente/inversor. Se ocultan tools internas.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <PitchPackButton label="⬇ Pack Pitch" compact />
            <button onClick={onPitchClick} className="btn-ghost !py-1 !px-2 text-xs">
              {forcesPitch ? "Logout" : "Salir"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
