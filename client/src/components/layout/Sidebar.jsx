import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Github,
  Code2,
  Shield,
  FolderKanban,
  Briefcase,
  ClipboardCheck,
  BarChart3,
  FileText,
  Globe,
  Award,
  Target,
  Sparkles,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Binary,
  Calendar,
  Trophy,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    title: 'Core',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'Live' },
    ],
  },
  {
    title: 'Platforms',
    items: [
      { path: '/leetcode', label: 'LeetCode', icon: Code2 },
      { path: '/github', label: 'GitHub', icon: Github },
      { path: '/codeforces', label: 'Codeforces', icon: Binary },
      { path: '/hackerrank', label: 'HackerRank', icon: Shield },
      { path: '/contests', label: 'Contest Calendar', icon: Calendar },
    ],
  },
  {
    title: 'Dev Tools',
    items: [
      { path: '/playground', label: 'DSA Playground', icon: Terminal, badge: 'AI' },
      { path: '/projects', label: 'Projects', icon: FolderKanban },
      { path: '/goals', label: 'Goals & Streaks', icon: Target },
    ],
  },
  {
    title: 'Career & Jobs',
    items: [
      { path: '/applications', label: 'Job Applications', icon: Briefcase, badge: 'New' },
      { path: '/career', label: 'AI Assistant', icon: Sparkles },
      { path: '/jobmatch', label: 'Job Match', icon: FileText },
      { path: '/jobreadiness', label: 'Job Readiness', icon: ClipboardCheck },
      { path: '/resume', label: 'Resume Builder', icon: FileText },
      { path: '/portfolio', label: 'Portfolio', icon: Globe },
      { path: '/certificates', label: 'Certificates', icon: Award },
    ],
  },
];

function SidebarLink({ item, collapsed }) {
  const IconComp = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl transition-all duration-150 text-xs font-semibold
        ${collapsed ? 'justify-center p-2.5 my-0.5' : 'px-3 py-2 my-0.5'}
        ${
          isActive
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/25 dark:text-blue-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
          )}
          <IconComp
            className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          />
          {!collapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    item.badge === 'Live'
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      : item.badge === 'AI'
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-4 z-50 lg:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 z-40
          transition-all duration-300 ease-in-out flex flex-col justify-between
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          w-[260px] shadow-sm
        `.trim()}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Logo Header */}
          <div
            className={`flex items-center h-[64px] border-b border-slate-100 dark:border-slate-800/80 shrink-0 ${
              collapsed ? 'justify-center px-2' : 'px-5 justify-between'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              {!collapsed && (
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    DevTrack
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    PRO
                  </span>
                </div>
              )}
            </div>

            {/* Collapse / Expand Toggle Button on Desktop */}
            {!collapsed && (
              <button
                onClick={onToggle}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Grouped Navigation List */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                {!collapsed && (
                  <p className="px-3 mb-1 text-[10px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                    {group.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <SidebarLink key={item.path} item={item} collapsed={collapsed} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Settings & User Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0 space-y-1">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl transition-colors text-xs font-semibold
                ${collapsed ? 'justify-center p-2.5' : 'px-3 py-2'}
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`
              }
              title="Settings"
            >
              <Settings className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" />
              {!collapsed && <span>Settings & Sync</span>}
            </NavLink>

            {collapsed && (
              <button
                onClick={onToggle}
                className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
