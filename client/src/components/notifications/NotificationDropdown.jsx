import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Code2, Trophy, Target, Clock, Info, AlertTriangle,
  Check, Trash2, X, Filter
} from 'lucide-react';

const ICON_MAP = { Github, Code2, Trophy, Target, Clock, Info, AlertTriangle };

const TYPE_META = {
  github_synced: { icon: 'Github', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', label: 'GitHub' },
  leetcode_synced: { icon: 'Code2', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', label: 'LeetCode' },
  achievement_unlocked: { icon: 'Trophy', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', label: 'Achievement' },
  goal_completed: { icon: 'Target', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', label: 'Goal' },
  weekly_reminder: { icon: 'Clock', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', label: 'Reminder' },
  system_message: { icon: 'Info', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', label: 'System' },
  error: { icon: 'AlertTriangle', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', label: 'Error' },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'github', label: 'GitHub' },
  { key: 'leetcode', label: 'LeetCode' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'goals', label: 'Goals' },
  { key: 'system', label: 'System' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationDropdown({
  notifications, filter, setFilter, onRead, onReadAll, onDelete, onClearAll, onClose
}) {
  const [activeTab, setActiveTab] = useState(filter || 'all');
  const ref = useRef(null);

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => {
        if (filter === 'github') return n.type === 'github_synced';
        if (filter === 'leetcode') return n.type === 'leetcode_synced';
        if (filter === 'achievements') return n.type === 'achievement_unlocked';
        if (filter === 'goals') return n.type === 'goal_completed';
        if (filter === 'system') return ['system_message', 'weekly_reminder', 'error'].includes(n.type);
        return true;
      });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleTab = (tab) => {
    setActiveTab(tab);
    setFilter(tab);
  };

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl dark:shadow-black/40 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onReadAll}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTab(tab.key)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto px-2 py-2 space-y-0.5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Info className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">All caught up</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No notifications to show</p>
            </motion.div>
          ) : (
            filtered.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.system_message;
              const IconComp = ICON_MAP[meta.icon] || Info;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => !n.read && onRead(n.id)}
                  className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    n.read
                      ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      : 'bg-blue-50/60 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/15'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-3 left-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  )}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
                    <IconComp className={`w-4 h-4 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${n.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{n.title}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">{timeAgo(n.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.description}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                    {!n.read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onRead(n.id); }}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClearAll}
            className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-medium px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            Clear all
          </button>
          <span className="text-[10px] text-slate-300 dark:text-slate-600">{notifications.length} total</span>
        </div>
      )}
    </motion.div>
  );
}
