import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '@/types';
import { getStudentById, defaultLibrarian, defaultAdmin } from '@/data/mockData';

interface AuthState {
  user: User | null;
  login: (role: UserRole, id?: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, id?: string): boolean => {
    if (role === 'student') {
      if (!id) return false;
      // Validate student ID format
      const pattern = /^y23(cs|cm|ec|ee|ce|it|me|cb|co|ba|ms|ma)\d{3}$/;
      if (!pattern.test(id)) return false;
      const rollNum = parseInt(id.slice(5));
      if (rollNum < 0 || rollNum > 198) return false;
      const student = getStudentById(id);
      if (student) {
        setUser(student);
        return true;
      }
      return false;
    }
    if (role === 'librarian') {
      setUser(defaultLibrarian);
      return true;
    }
    if (role === 'admin') {
      setUser(defaultAdmin);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
