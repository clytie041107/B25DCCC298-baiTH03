import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUser(): User | null {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  const login = (username: string, password: string): boolean => {
    if (username.trim() !== "" && password === "123456") {
      const u: User = { username: username.trim() };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return ctx;
}