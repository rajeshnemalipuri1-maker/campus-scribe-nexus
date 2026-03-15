import React, { createContext, useContext, useState } from "react";
import { User, UserRole } from "@/types";
import { getStudentById, defaultAdmin, defaultLibrarian } from "@/data/mockData";

interface AuthState {
  user: User | null;
  login: (role: UserRole, id?: string, password?: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, id?: string, password?: string): boolean => {

    /* normalize inputs for ALL roles */

    const cleanId = id?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    /* ---------- STUDENT LOGIN ---------- */

    if (role === "student") {

      if (!cleanId || !cleanPassword) return false;

      const student = getStudentById(cleanId);

      if (student && cleanPassword === "student123") {
        setUser(student);
        return true;
      }

      return false;
    }

    /* ---------- LIBRARIAN LOGIN ---------- */

    if (role === "librarian") {

      if (cleanId === "librarian01" && cleanPassword === "lib123") {
        setUser(defaultLibrarian);
        return true;
      }

      return false;
    }

    /* ---------- ADMIN LOGIN ---------- */

    if (role === "admin") {

      if (cleanId === "admin01" && cleanPassword === "admin123") {
        setUser(defaultAdmin);
        return true;
      }

      return false;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
