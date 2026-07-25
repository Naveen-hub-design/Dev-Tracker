import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X, Settings, Filter } from 'lucide-react';
import {
  Github, Code2, Trophy, Target, Clock, Info, AlertTriangle
} from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';

const ICON_MAP = {
  Github, Code2, Trophy, Target, Clock, Info, AlertTriangle,
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'github', label: 'GitHub' },
  { key: 'leetcode', label: 'LeetCode' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'goals', label: 'Goals' },
  { key: 'system', label: 'System' },
];

function NotificationItem({ notification, onRead, onDelete, timeAgo, TYPE_META }) {
  const meta = TYPE_META[notification.type] || TYPE_META.system_message;
  const IconComp = ICON_MAP[meta.icon] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => !notification.read && onRead(notification.id)}
      className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
        notification.read
          ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
          : 'bg-blue-50/60 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/15'
      }`}
    >
      {!notification.read && (
        <span className="absolute top-3 left-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
      )}

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
        <IconComp className={`w-4 h-4 ${meta.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium truncate ${notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {notification.title}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
            {timeAgo(notification.timestamp)}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.description}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
        {!notification.read && (
          <button
            onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Delete"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function NotificationBell() {
  const {
    filteredNotifications, unreadCount, filter, setFilter,
    markAsRead, markAllRead, deleteNotification, clearAll, timeAgo, TYPE_META,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setFilter(tab);
  }, [setFilter]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        title="Notifications"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, 15, -15, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Bell className="w-[18px] h-[18px]" />
        </motion.div>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-900"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
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
                    onClick={markAllRead}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
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
                  onClick={() => handleTabChange(tab.key)}
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

            {/* Notification list */}
            <div className="max-h-[400px] overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">All caught up</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No notifications to show</p>
                  </motion.div>
                ) : (
                  filteredNotifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={markAsRead}
                      onDelete={deleteNotification}
                      timeAgo={timeAgo}
                      TYPE_META={TYPE_META}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={clearAll}
                  className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-medium px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  Clear all
                </button>
                <span className="text-[10px] text-slate-300 dark:text-slate-600">
                  {notifications.length} total
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
