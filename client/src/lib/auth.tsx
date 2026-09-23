/**
 * JDM LEGENDS — Ngữ cảnh tài khoản & Garage
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  addToGarage,
  apiLogin,
  apiMe,
  apiRegister,
  fetchGarage,
  getToken,
  removeFromGarage,
  setToken,
} from "./api";
import type { AuthUser } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  favorites: string[];
  isFavorite: (carId: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleFavorite: (carId: string) => Promise<void>;
  refreshGarage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const refreshGarage = useCallback(async () => {
    if (!getToken()) {
      setFavorites([]);
      return;
    }
    try {
      const data = await fetchGarage();
      setFavorites(data.carIds);
    } catch {
      setFavorites([]);
    }
  }, []);

  /* Khôi phục phiên đăng nhập khi tải trang */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) {
        setReady(true);
        return;
      }
      try {
        const { user: me } = await apiMe();
        if (cancelled) return;
        setUser(me);
        await refreshGarage();
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshGarage]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiLogin(email, password);
      setToken(data.token);
      setUser(data.user);
      await refreshGarage();
    },
    [refreshGarage],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiRegister(name, email, password);
      setToken(data.token);
      setUser(data.user);
      setFavorites([]);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setFavorites([]);
  }, []);

  const toggleFavorite = useCallback(
    async (carId: string) => {
      const has = favorites.includes(carId);
      // Cập nhật lạc quan để giao diện phản hồi ngay
      setFavorites((prev) => (has ? prev.filter((id) => id !== carId) : [carId, ...prev]));
      try {
        const data = has ? await removeFromGarage(carId) : await addToGarage(carId);
        setFavorites(data.carIds);
      } catch (err) {
        setFavorites((prev) => (has ? [carId, ...prev] : prev.filter((id) => id !== carId)));
        throw err;
      }
    },
    [favorites],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      favorites,
      isFavorite: (carId: string) => favorites.includes(carId),
      login,
      register,
      logout,
      toggleFavorite,
      refreshGarage,
    }),
    [user, ready, favorites, login, register, logout, toggleFavorite, refreshGarage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>.");
  return ctx;
}
