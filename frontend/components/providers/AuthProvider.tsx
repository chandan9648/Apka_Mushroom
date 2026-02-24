"use client";

import * as React from "react";
import { apiFetchJson, ApiError } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  ready: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

const LS_KEY = "fungiverse_auth_v1";

function loadFromStorage(): Partial<AuthState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<AuthState>;
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<AuthState>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    ready: false,
  });

  React.useEffect(() => {
    const saved = loadFromStorage();
    setState((prev) => ({
      user: (saved.user as User) ?? prev.user,
      accessToken: (saved.accessToken as string) ?? prev.accessToken,
      refreshToken: (saved.refreshToken as string) ?? prev.refreshToken,
      ready: true,
    }));
  }, []);

  React.useEffect(() => {
    if (!state.ready) return;
    saveToStorage({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken });
  }, [state.user, state.accessToken, state.refreshToken, state.ready]);

  const login = React.useCallback(async (email: string, password: string) => {
    const res = await apiFetchJson<{ accessToken: string; refreshToken: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setState((prev) => ({ ...prev, user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken }));
  }, []);

  const signup = React.useCallback(async (name: string, email: string, password: string) => {
    await apiFetchJson<{ message: string; user: User }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }, []);

  const verifyEmail = React.useCallback(async (email: string, code: string) => {
    await apiFetchJson<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  }, []);

  const logout = React.useCallback(() => {
    setState((prev) => ({ ...prev, user: null, accessToken: null, refreshToken: null }));
    if (typeof window !== "undefined") window.localStorage.removeItem(LS_KEY);
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    verifyEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function authErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
