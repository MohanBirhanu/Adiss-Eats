import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/src/types/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loginCustomer: (name: string, phone: string, area?: string) => void;
  logoutCustomer: () => void;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loginCustomer: () => {},
  logoutCustomer: () => {},
  loginAdmin: () => false,
  logoutAdmin: () => {},
});

const CUSTOMER_SESSION_KEY = 'addis_eats_customer_session';
const ADMIN_SESSION_KEY = 'addis_eats_admin_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOMER_SESSION_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Default demo logged-in user so the user can easily checkout, but can also edit/sign out
    return {
      id: 'cust-demo-1',
      name: 'Nahom Birhanu',
      phone: '0911234567',
      defaultArea: 'Bole',
      role: 'customer',
    };
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const adminSession = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return adminSession === 'true';
    }
    return false;
  });

  const loginCustomer = (name: string, phone: string, area = 'Bole') => {
    const newUser: User = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      defaultArea: area,
      role: 'customer',
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(newUser));
    }
  };

  const logoutCustomer = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
    }
  };

  const loginAdmin = (usernameInput: string, passwordInput: string): boolean => {
    // Demonstration admin credentials as required: admin / admin123
    if (usernameInput.trim() === 'admin' && passwordInput === 'admin123') {
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
