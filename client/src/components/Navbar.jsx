import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Code, Github, Briefcase, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Overview', icon: BarChart3 },
  { path: '/leetcode', label: 'LeetCode', icon: Code },
  { path: '/github', label: 'GitHub', icon: Github },
  { path: '/jobmatch', label: 'Job Match', icon: Briefcase },
];

export default function Navbar() {
  const { githubUser, setGithubUser } = useUser();
  const { user, logout } = useAuth();
  const [inputValue, setInputValue] = useState(githubUser);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleConnect = () => {
    if (inputValue.trim()) {
      setGithubUser(inputValue.trim());
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-slate-900">DevTrack</span>
            </NavLink>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="GitHub username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              className="input-field w-36 lg:w-40"
            />
            <button onClick={handleConnect} className="btn-primary text-sm">
              Connect
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 ml-2"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">{user?.name}</span>
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1">
                    <button
                      onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-500'
                }`
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
