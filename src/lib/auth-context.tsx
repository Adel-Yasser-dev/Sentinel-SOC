"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email?: string, name?: string) => void;
  logout: () => void;
}

const defaultUser: User = {
  name: "Ahmed Samy",
  email: "ahmed.samy@sentinelsoc.io",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for saved auth state
    const saved = localStorage.getItem("sentinel_auth");
    if (saved === "false") {
      queueMicrotask(() => setUser(null));
    } else if (saved === "true") {
      queueMicrotask(() => setUser(defaultUser));
    } else {
      localStorage.setItem("sentinel_auth", "true");
    }
  }, []);

  const login = (email?: string, name?: string) => {
    const newUser: User = {
      ...defaultUser,
      email: email || defaultUser.email,
      name: name || defaultUser.name,
    };
    setUser(newUser);
    localStorage.setItem("sentinel_auth", "true");
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem("sentinel_auth", "false");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
