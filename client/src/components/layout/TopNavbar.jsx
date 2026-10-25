import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  RefreshCw,
  LogOut,
  Settings,
  ChevronDown,
  Terminal,
  Code2,
  Github,
  Trophy,
  Briefcase,
  Sparkles,
  Command,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import ThemeToggle from '../ui/ThemeToggle';

const QUICK_COMMANDS = [
  { name: 'Dashboard', path: '/', icon: Trophy, category: 'Core' },
  { name: 'LeetCode Analytics & Daily', path: '/leetcode', icon: Code2, category: 'Platforms' },
  { name: 'GitHub Deep Analytics', path: '/github', icon: Github, category: 'Platforms' },
  { name: 'DSA Code Playground', path: '/playground', icon: Terminal, category: 'Tools' },
  { name: 'Job Application Pipeline', path: '/applications', icon: Briefcase, category: 'Career' },
  { name: 'AI Career Assistant & ATS', path: '/career', icon: Sparkles, category: 'Career' },
  { name: 'Global & Campus Leaderboard', path: '/leaderboard', icon: Trophy, category: 'Core' },
  { name: 'Settings & Token Sync', path: '/settings', icon: Settings, category: 'Settings' },
];

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredCommands = QUICK_COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="h-[64px] bg-white/70 dark:bg-[#0c0e15]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
        {/* Mobile menu spacer */}
        <div className="w-8 lg:hidden" />

        {/* Global Search Bar Trigger */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-3 px-3.5 py-1.5 text-xs rounded-xl bg-slate-100/80 dark:bg-[#111420] border border-slate-200/60 dark:border-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all w-64 justify-between group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 group-hover:text-orange-500 transition-colors" />
              <span>Search or jump to...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#1a1f30] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-orange-300/80 shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Live System Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DevTrack Live</span>
          </div>

          {/* Theme toggle */}
          <ThemeToggle compact />

          {/* Notifications Center */}
          <NotificationBell />

          {/* Vertical Divider */}
          <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/70 dark:hover:bg-[#161a26] transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-orange-500/25">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-orange-600 dark:text-orange-300 leading-tight font-medium">Pro Developer</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#0f121a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl z-50 py-2 overflow-hidden"
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => { navigate('/settings'); setShowProfile(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161a26] rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings & Credentials
                    </button>
                    <button
                      onClick={() => { navigate('/applications'); setShowProfile(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161a26] rounded-xl transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      Job Pipeline
                    </button>
                  </div>

                  <div className="p-1 border-t border-slate-100 dark:border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Interactive Command Palette Modal (Ctrl+K) */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCommandOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0f121a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-white/10">
                <Search className="w-4 h-4 text-orange-500 mr-2.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a page or command to navigate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => setCommandOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => {
                    const CmdIcon = cmd.icon;
                    return (
                      <button
                        key={cmd.path}
                        onClick={() => {
                          navigate(cmd.path);
                          setCommandOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/50 dark:hover:bg-orange-500/10 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#161a26] group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-slate-500 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                            <CmdIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">{cmd.name}</p>
                            <p className="text-[10px] text-slate-400">{cmd.path}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {cmd.category}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No matching pages found.</p>
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-[#0c0e15] text-[11px] text-slate-400 flex items-center justify-between">
                <span>Use arrows to navigate</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#161a26] border border-slate-200 dark:border-white/10 font-mono text-[10px]">
                  ESC to close
                </kbd>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
