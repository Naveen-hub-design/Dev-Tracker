import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left spacer for mobile menu button */}
      <div className="w-8 lg:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Search"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Sync */}
        <button
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Sync data"
        >
          <RefreshCw className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Profile menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{user?.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1.5">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
