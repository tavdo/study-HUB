import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch, getToken, setToken } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return null;
    }
    const data = await apiFetch("/api/auth/me");
    setUser(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (getToken()) await refreshUser();
        else setUser(null);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ email, password, name }) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const updateAccountName = useCallback(async (name) => {
    const data = await apiFetch("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      updateAccountName,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
    }),
    [user, loading, login, register, logout, refreshUser, updateAccountName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
