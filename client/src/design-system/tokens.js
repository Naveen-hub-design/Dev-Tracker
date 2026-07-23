export const colors = {
  bg: {
    primary: '#FAFBFC',
    secondary: '#F8FAFC',
    sidebar: '#FFFFFF',
    card: '#FFFFFF',
    hover: '#F1F5F9',
    active: '#EFF6FF',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    brand: '#2563EB',
  },
  border: {
    default: '#E2E8F0',
    light: '#F1F5F9',
    focus: '#3B82F6',
  },
  accent: {
    blue: '#3B82F6',
    blueDark: '#2563EB',
    blueLight: '#EFF6FF',
    emerald: '#10B981',
    emeraldLight: '#ECFDF5',
    amber: '#F59E0B',
    amberLight: '#FFFBEB',
    red: '#EF4444',
    redLight: '#FEF2F2',
    purple: '#8B5CF6',
    purpleLight: '#F5F3FF',
    violet: '#7C3AED',
    violetLight: '#F5F3FF',
    slate: '#64748B',
  },
  status: {
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    error: '#EF4444',
    errorBg: '#FEF2F2',
    info: '#3B82F6',
    infoBg: '#EFF6FF',
  },
};

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
};

export const radius = {
  none: '0px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  sizes: {
    xs: '0.75rem',
    sm: '0.8125rem',
    base: '0.875rem',
    lg: '1rem',
    xl: '1.125rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const sidebar = {
  width: '260px',
  collapsedWidth: '72px',
  topNavbarHeight: '60px',
};
