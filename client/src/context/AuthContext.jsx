import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { http } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("taskflow_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((payload) => {
    if (!payload?.token || !payload?.user) {
      return;
    }

    localStorage.setItem("taskflow_token", payload.token);
    localStorage.setItem("taskflow_user", JSON.stringify(payload.user));
    setUser(payload.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");

    if (!token) {
      setLoading(false);
      return;
    }

    http
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("taskflow_user", JSON.stringify(data.user));
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      loading,
      saveSession,
      logout,
    }),
    [user, loading, saveSession, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
