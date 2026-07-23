import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('devtrack_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const stored = localStorage.getItem('devtrack_user');
    if (!stored) {
      setLoading(false);
      return;
    }
    try {
      const data = await getMe();
      const existingToken = JSON.parse(stored).token;
      const merged = { ...data, token: data.token || existingToken };
      setUser(merged);
      localStorage.setItem('devtrack_user', JSON.stringify(merged));
    } catch {
      localStorage.removeItem('devtrack_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('devtrack_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devtrack_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('devtrack_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
