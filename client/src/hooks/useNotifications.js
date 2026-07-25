import { useState, useCallback, useEffect } from 'react';

const NOTIFICATION_TYPES = {
  GITHUB_SYNCED: 'github_synced',
  LEETCODE_SYNCED: 'leetcode_synced',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  GOAL_COMPLETED: 'goal_completed',
  WEEKLY_REMINDER: 'weekly_reminder',
  SYSTEM_MESSAGE: 'system_message',
  ERROR: 'error',
};

const TYPE_META = {
  [NOTIFICATION_TYPES.GITHUB_SYNCED]: { icon: 'Github', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', label: 'GitHub' },
  [NOTIFICATION_TYPES.LEETCODE_SYNCED]: { icon: 'Code2', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', label: 'LeetCode' },
  [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED]: { icon: 'Trophy', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', label: 'Achievement' },
  [NOTIFICATION_TYPES.GOAL_COMPLETED]: { icon: 'Target', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', label: 'Goal' },
  [NOTIFICATION_TYPES.WEEKLY_REMINDER]: { icon: 'Clock', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', label: 'Reminder' },
  [NOTIFICATION_TYPES.SYSTEM_MESSAGE]: { icon: 'Info', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', label: 'System' },
  [NOTIFICATION_TYPES.ERROR]: { icon: 'AlertTriangle', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', label: 'Error' },
};

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

const STORAGE_KEY = 'devtrack_notifications';
const ACTIVITIES_KEY = 'devtrack_activities';

function generateId() {
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateActivityId() {
  return `a_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

const SEED_NOTIFICATIONS = [
  {
    id: 'n_seed_1',
    type: NOTIFICATION_TYPES.GITHUB_SYNCED,
    title: 'GitHub Synced',
    description: 'Successfully synced 12 new commits from devtracker repo.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: 'n_seed_2',
    type: NOTIFICATION_TYPES.LEETCODE_SYNCED,
    title: 'LeetCode Synced',
    description: '3 new problems solved this week. Keep it up!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: 'n_seed_3',
    type: NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED,
    title: 'Achievement Unlocked',
    description: 'You earned the "7-Day Streak" badge for consistent activity.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: 'n_seed_4',
    type: NOTIFICATION_TYPES.GOAL_COMPLETED,
    title: 'Goal Completed',
    description: 'Weekly target of 10 problems has been achieved.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
  },
  {
    id: 'n_seed_5',
    type: NOTIFICATION_TYPES.WEEKLY_REMINDER,
    title: 'Weekly Reminder',
    description: 'Your weekly activity report is ready. Check your dashboard for insights.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
  },
  {
    id: 'n_seed_6',
    type: NOTIFICATION_TYPES.SYSTEM_MESSAGE,
    title: 'System Update',
    description: 'DevTrack has been upgraded to v2.1. New portfolio export feature available.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: 'n_seed_7',
    type: NOTIFICATION_TYPES.GITHUB_SYNCED,
    title: 'GitHub Synced',
    description: 'Pull request #42 merged into main branch.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
  },
  {
    id: 'n_seed_8',
    type: NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED,
    title: 'Achievement Unlocked',
    description: 'You earned the "Code Warrior" badge for solving 100+ problems.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
];

const SEED_ACTIVITIES = [
  { id: 'a_seed_1', type: 'github', title: 'Pushed 3 commits', description: 'feat: add dark mode toggle to settings', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'a_seed_2', type: 'leetcode', title: 'Solved: Two Sum', description: 'Completed in 12 minutes — Python3', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { id: 'a_seed_3', type: 'github', title: 'Opened PR #45', description: 'Refactor: unified data layer', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'a_seed_4', type: 'project', title: 'Project updated', description: 'DevTrack — added certificate management module', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'a_seed_5', type: 'achievement', title: 'Badge earned: 7-Day Streak', description: 'Maintained consistent activity for 7 consecutive days', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: 'a_seed_6', type: 'leetcode', title: 'Solved: Valid Parentheses', description: 'Completed in 8 minutes — Python3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'a_seed_7', type: 'project', title: 'Created project', description: 'DevTracker — developer productivity dashboard', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { id: 'a_seed_8', type: 'github', title: 'Merged PR #42', description: 'Fix: resolve authentication token refresh issue', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'a_seed_9', type: 'achievement', title: 'Badge earned: Code Warrior', description: 'Solved 100+ LeetCode problems total', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'a_seed_10', type: 'leetcode', title: 'Solved: Merge Two Sorted Lists', description: 'Completed in 6 minutes — Python3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

export default function useNotifications() {
  const [notifications, setNotifications] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEY, null);
    if (stored && stored.length > 0) return stored;
    return SEED_NOTIFICATIONS;
  });

  const [activities, setActivities] = useState(() => {
    const stored = loadFromStorage(ACTIVITIES_KEY, null);
    if (stored && stored.length > 0) return stored;
    return SEED_ACTIVITIES;
  });

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    saveToStorage(STORAGE_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(ACTIVITIES_KEY, activities);
  }, [activities]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter((n) => {
        if (filter === 'github') return n.type === NOTIFICATION_TYPES.GITHUB_SYNCED;
        if (filter === 'leetcode') return n.type === NOTIFICATION_TYPES.LEETCODE_SYNCED;
        if (filter === 'achievements') return n.type === NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED;
        if (filter === 'goals') return n.type === NOTIFICATION_TYPES.GOAL_COMPLETED;
        if (filter === 'system') return n.type === NOTIFICATION_TYPES.SYSTEM_MESSAGE || n.type === NOTIFICATION_TYPES.WEEKLY_REMINDER || n.type === NOTIFICATION_TYPES.ERROR;
        return true;
      });

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter((a) => {
        if (filter === 'github') return a.type === 'github';
        if (filter === 'leetcode') return a.type === 'leetcode';
        if (filter === 'projects') return a.type === 'project';
        if (filter === 'achievements') return a.type === 'achievement';
        return false;
      });

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((type, title, description) => {
    setNotifications((prev) => [
      {
        id: generateId(),
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const addActivity = useCallback((type, title, description) => {
    setActivities((prev) => [
      {
        id: generateActivityId(),
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  return {
    notifications,
    filteredNotifications,
    activities,
    filteredActivities,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllRead,
    deleteNotification,
    clearAll,
    addNotification,
    addActivity,
    timeAgo,
    NOTIFICATION_TYPES,
    TYPE_META,
  };
}
