"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePresentationMode } from "@/contexts/PresentationModeContext";

export type DashboardRole = "ops" | "pitch" | "client";

interface AuthState {
  loading: boolean;
  openMode: boolean;
  authenticated: boolean;
  role: DashboardRole;
  forcesPitch: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  loading: true,
  openMode: true,
  authenticated: true,
  role: "ops",
  forcesPitch: false,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setPresentationMode } = usePresentationMode();
  const [loading, setLoading] = useState(true);
  const [openMode, setOpenMode] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const [role, setRole] = useState<DashboardRole>("ops");
  const [forcesPitch, setForcesPitch] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const resp = await fetch("/api/auth/me");
      const data = await resp.json();
      if (!resp.ok) {
        setAuthenticated(false);
        setOpenMode(false);
        setLoading(false);
        return;
      }
      setAuthenticated(Boolean(data.authenticated));
      setOpenMode(Boolean(data.openMode));
      setRole((data.role as DashboardRole) || "ops");
      const force = Boolean(data.forcesPitch);
      setForcesPitch(force);
      if (force) setPresentationMode(true);
      try {
        document.body.dataset.rrRole = (data.role as string) || "ops";
      } catch {
        /* ignore */
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setPresentationMode]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{ loading, openMode, authenticated, role, forcesPitch, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
