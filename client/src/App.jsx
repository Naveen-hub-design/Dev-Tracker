import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LeetCodePage = lazy(() => import('./pages/LeetCodePage'));
const GitHubPage = lazy(() => import('./pages/GitHubPage'));
const HackerRankPage = lazy(() => import('./pages/HackerRankPage'));
const JobMatchPage = lazy(() => import('./pages/JobMatchPage'));
const JobReadinessPage = lazy(() => import('./pages/JobReadinessPage'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const CareerAssistantPage = lazy(() => import('./pages/CareerAssistantPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading DevTrack...</p>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 rounded bg-blue-500/40" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leetcode" element={<LeetCodePage />} />
              <Route path="/github" element={<GitHubPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/hackerrank" element={<HackerRankPage />} />
              <Route path="/jobmatch" element={<JobMatchPage />} />
              <Route path="/jobreadiness" element={<JobReadinessPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/career" element={<CareerAssistantPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
