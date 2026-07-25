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
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/github', label: 'GitHub', icon: Github },
  { path: '/leetcode', label: 'LeetCode', icon: Code2 },
  { path: '/hackerrank', label: 'HackerRank', icon: Shield },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/jobmatch', label: 'Job Match', icon: Briefcase },
  { path: '/jobreadiness', label: 'Job Readiness', icon: ClipboardCheck },
  { path: '/resume', label: 'Resume', icon: FileText },
  { path: '/portfolio', label: 'Portfolio', icon: Globe },
  { path: '/certificates', label: 'Certificates', icon: Award },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/career', label: 'AI Assistant', icon: Sparkles },
  { path: '/admin', label: 'Admin', icon: ShieldCheck },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
];

function SidebarLink({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg transition-all duration-150
        ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
        ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
        }`
      }
    >
      <item.icon className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && (
        <span className="text-[13px] truncate">{item.label}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-400"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          w-[260px]
        `.trim()}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center h-[60px] border-b border-slate-100 dark:border-slate-800 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
            {collapsed ? (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">DevTrack</span>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
            {navItems.map((item) => (
              <SidebarLink key={item.path} item={item} collapsed={collapsed} />
            ))}
          </nav>

          <div className="border-t border-slate-100 dark:border-slate-800 py-3 px-3 space-y-0.5">
            {bottomItems.map((item) => (
              <SidebarLink key={item.path} item={item} collapsed={collapsed} />
            ))}

            <button
              onClick={onToggle}
              className="hidden lg:flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-[18px] h-[18px]" />
              ) : (
                <>
                  <ChevronLeft className="w-[18px] h-[18px]" />
                  <span className="text-[13px]">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
