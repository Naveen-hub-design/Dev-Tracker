import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Code2, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090b11] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none font-sans">
      {/* ================= Atmospheric Ambient Lighting (Warm Sunset Amber & Obsidian) ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-orange-500/[0.16] rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-36 w-[500px] h-[500px] bg-amber-600/[0.12] rounded-full blur-[160px]" />
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[400px] bg-orange-600/[0.08] rounded-full blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, #f97316 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#090b11]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2.5 mb-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-white/20">
                <Code2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">DevTrack</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300">
                  PRO
                </span>
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Create your account</h1>
          <p className="text-xs text-slate-400 mt-1">Start tracking your developer portfolio today</p>
        </div>

        {/* Main Card */}
        <div className="relative rounded-2xl bg-[#0f121a]/85 backdrop-blur-2xl border border-orange-500/20 shadow-[0_0_60px_-15px_rgba(249,115,22,0.22)] p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent pointer-events-none" />

          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090b11]/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-sm transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090b11]/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-sm transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#090b11]/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-sm transition-all font-mono shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090b11]/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-sm transition-all font-mono shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !password || !confirmPassword}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 active:scale-[0.99] transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-orange-400/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign in footer */}
          <p className="text-center text-xs text-slate-400 mt-6 pt-5 border-t border-white/10">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom subtle legal */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-slate-500">
          <span>Protected by DevTrack</span>
          <span>•</span>
          <Link to="/" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link to="/" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
