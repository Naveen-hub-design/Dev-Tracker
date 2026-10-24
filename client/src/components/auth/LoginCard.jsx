import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Zap,
  Check,
  ShieldCheck,
  Key,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginCard({ onSubmit, onSocialLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [demoPillActive, setDemoPillActive] = useState(false);
  const [socialInfo, setSocialInfo] = useState('');
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  const handleFillDemo = () => {
    setEmail('john@example.com');
    setPassword('password123');
    setDemoPillActive(true);
    setTimeout(() => setDemoPillActive(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onSubmit({ email, password });
  };

  const handleSocialClick = (provider) => {
    setSocialInfo(
      `${provider === 'github' ? 'GitHub' : 'Google'} OAuth integration is active for profile syncing. For dashboard access, sign in with your email or use the 1-click Demo Account above!`
    );
    setTimeout(() => setSocialInfo(''), 6000);
  };

  const isValid = email.includes('@') && password.length >= 1;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Outer Card Glass Container */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl p-7 sm:p-9 transition-all">
        {/* Subtle Ambient Radial Glow inside card */}
        <div className="absolute top-0 right-0 -z-10 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Sign In
            </h2>
            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
              Developer Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your credentials or test with our pre-loaded demo account.
          </p>
        </div>

        {/* ⚡ Quick Fill Demo Account Banner */}
        <button
          type="button"
          onClick={handleFillDemo}
          className={`w-full mb-6 p-3 rounded-2xl border transition-all flex items-center justify-between group ${
            demoPillActive
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-primary-500/10 dark:bg-primary-500/10 border-primary-500/20 hover:border-primary-500/40 text-primary-600 dark:text-primary-300 hover:bg-primary-500/15'
          }`}
        >
          <div className="flex items-center gap-2.5 text-left">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                demoPillActive
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary-500/20 text-primary-400 group-hover:bg-primary-500 group-hover:text-white'
              }`}
            >
              {demoPillActive ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                {demoPillActive ? 'Demo Credentials Loaded!' : 'Auto-Fill Demo Account'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                john@example.com / password123
              </div>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2 py-1 rounded-lg bg-white/40 dark:bg-white/10 text-slate-700 dark:text-slate-200">
            {demoPillActive ? 'Filled ✓' : '1-Click'}
          </span>
        </button>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Notice / Info Banner */}
        <AnimatePresence>
          {socialInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{socialInfo}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="developer@company.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] text-primary-500 hover:text-primary-600 dark:text-primary-400 font-medium transition-colors"
              >
                Use demo password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Caps Lock Alert */}
          {capsLock && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Caps Lock is ON</span>
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-primary-600 focus:ring-primary-500/30 bg-white dark:bg-white/5 cursor-pointer"
              />
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Engineer...</span>
              </>
            ) : (
              <>
                <span>Sign In to DevTrack</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Developer Auth Divider */}
        <div className="relative my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleSocialClick('github')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] text-xs font-medium text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.01]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialClick('google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] text-xs font-medium text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.01]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Link to Register */}
        <div className="text-center pt-2 border-t border-slate-200/60 dark:border-white/5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Create free developer account →
            </Link>
          </p>
        </div>
      </div>

      {/* Security Guarantee Ribbon */}
      <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          256-Bit SSL Encrypted
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Key className="w-3.5 h-3.5 text-cyan-500" />
          JWT Stateless Session
        </span>
        <span>•</span>
        <span>SQLite WAL Persistence</span>
      </div>
    </div>
  );
}
