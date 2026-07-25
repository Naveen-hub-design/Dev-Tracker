import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import AnimatedBackground from '../components/auth/AnimatedBackground';
import HeroSection from '../components/auth/HeroSection';
import LoginCard from '../components/auth/LoginCard';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { login } = useAuth();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleSubmit = useCallback(async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  const handleSocialLogin = useCallback((provider) => {
    setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is coming soon.`);
  }, []);

  return (
    <div
      ref={pageRef}
      className="h-screen w-screen overflow-hidden bg-slate-950 flex flex-col lg:flex-row"
    >
      {/* Theme toggle — fixed */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ============ LEFT HERO (60%) ============ */}
      <div className="hidden lg:flex lg:w-[60%] h-full relative">
        <AnimatedBackground mouseX={mousePos.x} mouseY={mousePos.y} />
        <HeroSection mouseX={mousePos.x} mouseY={mousePos.y} />
      </div>

      {/* ============ RIGHT LOGIN (40%) ============ */}
      <div className="flex-1 lg:w-[40%] h-full relative flex flex-col">
        {/* Login side background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0c1021] dark:via-slate-950 dark:to-[#0c1021]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/[0.03] rounded-full blur-[60px] pointer-events-none" />
        </div>

        {/* Mobile hero */}
        <div className="lg:hidden relative z-10 shrink-0">
          <div className="relative overflow-hidden py-10 px-6 text-center bg-gradient-to-br from-slate-900 via-[#0c1021] to-slate-900">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-6 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-[50px]" />
              <div className="absolute bottom-4 right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-[40px]" />
            </div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white tracking-tight">DevTrack</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-0.5">
                Your Developer <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Productivity Hub</span>
              </h2>
              <p className="text-xs text-slate-400">Track code. Build projects. Get hired.</p>
            </motion.div>
          </div>
        </div>

        {/* Login form container */}
        <div className="flex-1 relative z-10 flex items-center justify-center px-6 py-8 lg:py-0">
          <div className="w-full max-w-[400px]">
            <LoginCard
              onSubmit={handleSubmit}
              onSocialLogin={handleSocialLogin}
              loading={loading}
              error={error}
            />

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Create Account
                </Link>
              </p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <button className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</button>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <button className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms</button>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <button className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Support</button>
              </div>
              <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-2">Version 1.0</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
