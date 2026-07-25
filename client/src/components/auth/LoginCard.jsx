import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, BarChart3, CheckCircle2 } from 'lucide-react';
import SocialLoginButtons from './SocialLoginButtons';
import SecurityBadges from './SecurityBadges';

function CapsLockIndicator({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/15 rounded-lg px-3 py-1.5 border border-amber-100 dark:border-amber-800/20">
            <AlertCircle className="w-3 h-3 shrink-0" />
            Caps Lock is on
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ErrorBanner({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/15 border border-red-100 dark:border-red-800/20 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-3"
          >
            Welcome back!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LoginCard({ onSubmit, onSocialLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (error) setShakeKey((k) => k + 1);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onSubmit({ email, password });
  };

  const handleKeyDown = (e) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  const isValid = email.includes('@') && password.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[400px] mx-auto relative"
    >
      {/* Glass card */}
      <div className="relative bg-white/70 dark:bg-white/[0.025] backdrop-blur-2xl rounded-3xl border border-slate-200/50 dark:border-white/[0.07] shadow-2xl shadow-slate-200/40 dark:shadow-black/50 p-7 sm:p-8">
        {/* Gradient border glow */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-blue-500/[0.08] via-transparent to-purple-500/[0.08] pointer-events-none" />

        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-2.5 mb-5"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">DevTrack</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-0.5">Welcome back</h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400">Continue your developer journey.</p>
          </motion.div>

          {/* Error */}
          <ErrorBanner message={error} />

          {/* Form */}
          <motion.div
            key={shakeKey}
            animate={error ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
            transition={{ duration: 0.45 }}
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.4 }}>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-[13px]
                    bg-slate-50 dark:bg-white/[0.04]
                    border border-slate-200 dark:border-white/[0.08]
                    text-slate-900 dark:text-slate-100
                    placeholder-slate-400 dark:placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                    dark:focus:ring-blue-500/15 dark:focus:border-blue-500/30
                    transition-all duration-200"
                />
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <button type="button" className="text-[11px] text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors" tabIndex={-1}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-[13px]
                      bg-slate-50 dark:bg-white/[0.04]
                      border border-slate-200 dark:border-white/[0.08]
                      text-slate-900 dark:text-slate-100
                      placeholder-slate-400 dark:placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                      dark:focus:ring-blue-500/15 dark:focus:border-blue-500/30
                      transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Caps Lock */}
              <CapsLockIndicator show={capsLock} />

              {/* Remember me */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.3 }} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-blue-500 focus:ring-blue-500/30 bg-white dark:bg-white/5 cursor-pointer"
                />
                <label htmlFor="remember" className="text-[12px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">Remember me</label>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || !isValid}
                whileHover={loading ? {} : { scale: 1.01 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                  bg-gradient-to-r from-blue-500 to-indigo-600
                  hover:from-blue-600 hover:to-indigo-700
                  text-white shadow-lg shadow-blue-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
                  transition-all duration-200"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in...</span></>
                ) : (
                  <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Divider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.3 }} className="relative flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.06]" />
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest shrink-0">or continue with</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.06]" />
          </motion.div>

          {/* Social */}
          <SocialLoginButtons loading={loading} onSocialLogin={onSocialLogin} />

          {/* Security */}
          <div className="mt-5">
            <SecurityBadges />
          </div>
        </div>

        <SuccessOverlay show={success} />
      </div>
    </motion.div>
  );
}
