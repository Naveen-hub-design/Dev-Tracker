import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Github,
  Code2,
  Trophy,
  FolderKanban,
  Briefcase,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/github', label: 'GitHub', icon: Github },
  { path: '/leetcode', label: 'LeetCode', icon: Code2 },
  { path: '/codeforces', label: 'Codeforces', icon: Trophy },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/jobmatch', label: 'Job Match', icon: Briefcase },
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
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          w-[260px]
        `.trim()}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center h-[60px] border-b border-slate-100 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
            {collapsed ? (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-bold text-slate-900 tracking-tight">DevTrack</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
            {navItems.map((item) => (
              <SidebarLink key={item.path} item={item} collapsed={collapsed} />
            ))}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-slate-100 py-3 px-3 space-y-0.5">
            {bottomItems.map((item) => (
              <SidebarLink key={item.path} item={item} collapsed={collapsed} />
            ))}

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={onToggle}
              className="hidden lg:flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
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
