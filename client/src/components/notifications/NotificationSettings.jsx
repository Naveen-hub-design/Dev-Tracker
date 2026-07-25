import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock, Mail, Monitor, Smartphone } from 'lucide-react';

const SETTINGS_SECTIONS = [
  {
    id: 'push',
    title: 'Push Notifications',
    description: 'Receive push notifications in your browser',
    icon: Bell,
    defaultEnabled: true,
  },
  {
    id: 'email',
    title: 'Email Notifications',
    description: 'Receive daily digest emails',
    icon: Mail,
    defaultEnabled: false,
  },
  {
    id: 'mobile',
    title: 'Mobile Notifications',
    description: 'Push notifications on mobile devices',
    icon: Smartphone,
    defaultEnabled: false,
  },
];

const CATEGORY_SETTINGS = [
  { id: 'github_synced', label: 'GitHub Sync', description: 'When GitHub data is synced' },
  { id: 'leetcode_synced', label: 'LeetCode Sync', description: 'When LeetCode data is synced' },
  { id: 'achievement_unlocked', label: 'Achievements', description: 'When you unlock badges' },
  { id: 'goal_completed', label: 'Goals', description: 'When you complete a goal' },
  { id: 'weekly_reminder', label: 'Weekly Reminders', description: 'Weekly activity reports' },
  { id: 'system_message', label: 'System Messages', description: 'Updates and announcements' },
  { id: 'error', label: 'Errors', description: 'Sync errors and failures' },
];

export default function NotificationSettings({ onClose }) {
  const [settings, setSettings] = useState(() => {
    const stored = {};
    SETTINGS_SECTIONS.forEach((s) => { stored[s.id] = s.defaultEnabled; });
    CATEGORY_SETTINGS.forEach((c) => { stored[c.id] = true; });
    return stored;
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Choose what notifications you receive</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        )}
      </div>

      {/* Delivery channels */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Delivery Channels</h4>
        <div className="space-y-2">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{section.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{section.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(section.id)}
                  className={`relative w-10 h-[22px] rounded-full transition-colors ${
                    settings[section.id]
                      ? 'bg-blue-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <motion.div
                    className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ left: settings[section.id] ? 21 : 3 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category settings */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Notification Categories</h4>
        <div className="space-y-1">
          {CATEGORY_SETTINGS.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{cat.description}</p>
              </div>
              <button
                onClick={() => toggle(cat.id)}
                className={`relative w-10 h-[22px] rounded-full transition-colors ${
                  settings[cat.id]
                    ? 'bg-blue-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <motion.div
                  className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ left: settings[cat.id] ? 21 : 3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
