import React, { createContext, useState, useEffect, useContext } from 'react';
import type { IUser, AuthResponse } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
