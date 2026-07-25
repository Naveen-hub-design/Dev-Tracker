import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext(undefined);

const STORAGE_KEY = 'devtrack_theme';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'system';
  } catch {
    return 'system';
  }
}

function resolveTheme(mode) {
  if (mode === 'system') return getSystemTheme();
  return mode;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getStoredTheme);
  const [resolved, setResolved] = useState(() => resolveTheme(getStoredTheme()));

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (mode === 'system') {
        setResolved(mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  useEffect(() => {
    setResolved(resolveTheme(mode));
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  }, [resolved]);

  const setTheme = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  const value = useMemo(() => ({
    mode,
    theme: resolved,
    isDark: resolved === 'dark',
    setTheme,
  }), [mode, resolved, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
