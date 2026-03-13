import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { useStore } from '../store';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { users, addUser } = useStore();



  const login = (email: string, role: Role) => {
    const foundUser = users.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      toast.success(`Logged in as ${foundUser.name}`);
    } else {
      toast.error('Invalid credentials or role');
    }
  };

  const register = (newUser: User) => {
    const exists = users.find(u => u.email === newUser.email);
    if (exists) {
      toast.error('Email already in use');
      return;
    }
    addUser(newUser);
    setUser(newUser);
    toast.success('Account created successfully');
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
