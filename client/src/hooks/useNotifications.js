import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchUpcomingContests } from '../api/contests';
import { fetchDailyChallenge } from '../api/dailyChallenge';

const NOTIFICATION_TYPES = {
  GITHUB_SYNCED: 'github_synced',
  LEETCODE_SYNCED: 'leetcode_synced',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  GOAL_COMPLETED: 'goal_completed',
  WEEKLY_REMINDER: 'weekly_reminder',
  SYSTEM_MESSAGE: 'system_message',
  ERROR: 'error',
  CONTEST_ALERT: 'contest_alert',
  STREAK_ALERT: 'streak_alert',
};

const TYPE_META = {
  [NOTIFICATION_TYPES.GITHUB_SYNCED]: { icon: 'Github', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', label: 'GitHub' },
  [NOTIFICATION_TYPES.LEETCODE_SYNCED]: { icon: 'Code2', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', label: 'LeetCode' },
  [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED]: { icon: 'Trophy', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', label: 'Achievement' },
  [NOTIFICATION_TYPES.GOAL_COMPLETED]: { icon: 'Target', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', label: 'Goal' },
  [NOTIFICATION_TYPES.WEEKLY_REMINDER]: { icon: 'Clock', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', label: 'Reminder' },
  [NOTIFICATION_TYPES.SYSTEM_MESSAGE]: { icon: 'Info', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', label: 'System' },
  [NOTIFICATION_TYPES.ERROR]: { icon: 'AlertTriangle', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', label: 'Error' },
  [NOTIFICATION_TYPES.CONTEST_ALERT]: { icon: 'Calendar', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/30', label: 'Contest' },
  [NOTIFICATION_TYPES.STREAK_ALERT]: { icon: 'Flame', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', label: 'Streak' },
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

/**
 * Play a gentle synthesized chime via Web Audio API
 */
export function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // AudioContext blocked or not supported
  }
}

const STORAGE_KEY = 'devtrack_notifications';
const ACTIVITIES_KEY = 'devtrack_activities';
const DESKTOP_PERM_KEY = 'devtrack_desktop_alerts_enabled';

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
    description: 'Successfully synced your latest commits and repository contributions.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: 'n_seed_2',
    type: NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED,
    title: 'Achievement Unlocked',
    description: 'You earned the "Consistency Champion" badge for regular commits.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
];

const SEED_ACTIVITIES = [
  { id: 'a_seed_1', type: 'github', title: 'Pushed commits', description: 'Updated project repositories', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'a_seed_2', type: 'leetcode', title: 'Daily Challenge', description: 'Completed daily coding challenge', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
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
  const [desktopEnabled, setDesktopEnabled] = useState(() => {
    return localStorage.getItem(DESKTOP_PERM_KEY) === 'true' && typeof Notification !== 'undefined' && Notification.permission === 'granted';
  });

  const checkedLiveRef = useRef(false);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(ACTIVITIES_KEY, activities);
  }, [activities]);

  const sendDesktopAlert = useCallback((title, body) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
        playNotificationChime();
      } catch {
        // Notification failed
      }
    }
  }, []);

  const requestDesktopPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return false;
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setDesktopEnabled(true);
        localStorage.setItem(DESKTOP_PERM_KEY, 'true');
        sendDesktopAlert('DevTrack Alerts Enabled', 'You will now receive notifications for upcoming contests and daily streaks!');
        return true;
      }
    } catch {
      // Permission request error
    }
    return false;
  }, [sendDesktopAlert]);

  // Live polling for upcoming contests & LeetCode streak reminders
  useEffect(() => {
    if (checkedLiveRef.current) return;
    checkedLiveRef.current = true;

    async function checkLiveAlerts() {
      try {
        // 1. Check Contests
        const contestData = await fetchUpcomingContests('all');
        const upcoming = (contestData.contests || []).slice(0, 10);
        const now = Date.now();
        const savedAlerts = (() => {
          try {
            return JSON.parse(localStorage.getItem('devtrack_saved_contest_alerts') || '[]');
          } catch {
            return [];
          }
        })();

        upcoming.forEach((c) => {
          const diffMs = new Date(c.startTime).getTime() - now;
          const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
          const isUserSubscribed = savedAlerts.includes(c.id);

          // If contest starts in less than 36 hours or is explicitly subscribed by user
          if (diffMs > 0 && (diffHrs <= 36 || isUserSubscribed)) {
            const contestNoticeId = `contest_${c.id}`;
            setNotifications((prev) => {
              if (prev.some((n) => n.id === contestNoticeId)) return prev;
              const title = `Contest in ${diffHrs}h: ${c.name}`;
              const description = `Live on ${c.platform.toUpperCase()} in ${diffHrs} hour${diffHrs > 1 ? 's' : ''}. Don't forget to register!`;

              if (desktopEnabled && (diffHrs <= 2 || isUserSubscribed)) {
                sendDesktopAlert(`[CONTEST ALERT] ${c.name}`, `Starting on ${c.platform.toUpperCase()} in ${diffHrs}h!`);
              }

              return [
                {
                  id: contestNoticeId,
                  type: NOTIFICATION_TYPES.CONTEST_ALERT,
                  title,
                  description,
                  timestamp: new Date().toISOString(),
                  read: false,
                },
                ...prev,
              ];
            });
          }
        });

        // 2. Check LeetCode Daily Challenge
        const dailyData = await fetchDailyChallenge();
        if (dailyData?.problem && dailyData.streak && !dailyData.streak.solvedToday) {
          const streakNoticeId = `streak_${dailyData.problem.date}`;
          setNotifications((prev) => {
            if (prev.some((n) => n.id === streakNoticeId)) return prev;
            return [
              {
                id: streakNoticeId,
                type: NOTIFICATION_TYPES.STREAK_ALERT,
                title: '🔥 Daily Challenge Streak at Risk',
                description: `Today's problem: "${dailyData.problem.title}" (${dailyData.problem.difficulty}). Solve it today to keep your streak alive!`,
                timestamp: new Date().toISOString(),
                read: false,
              },
              ...prev,
            ];
          });
        }
      } catch {
        // Live alert check failed silently
      }
    }

    checkLiveAlerts();
  }, [desktopEnabled, sendDesktopAlert]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter((n) => {
        if (filter === 'github') return n.type === NOTIFICATION_TYPES.GITHUB_SYNCED;
        if (filter === 'leetcode') return n.type === NOTIFICATION_TYPES.LEETCODE_SYNCED;
        if (filter === 'contests') return n.type === NOTIFICATION_TYPES.CONTEST_ALERT;
        if (filter === 'achievements') return n.type === NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED;
        if (filter === 'goals') return n.type === NOTIFICATION_TYPES.GOAL_COMPLETED;
        if (filter === 'system') {
          return (
            n.type === NOTIFICATION_TYPES.SYSTEM_MESSAGE ||
            n.type === NOTIFICATION_TYPES.WEEKLY_REMINDER ||
            n.type === NOTIFICATION_TYPES.STREAK_ALERT ||
            n.type === NOTIFICATION_TYPES.ERROR
          );
        }
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

  return {
    notifications,
    filteredNotifications,
    activities,
    filteredActivities,
    unreadCount,
    filter,
    setFilter,
    desktopEnabled,
    requestDesktopPermission,
    markAsRead,
    markAllRead,
    deleteNotification,
    clearAll,
    addNotification,
    timeAgo,
    NOTIFICATION_TYPES,
    TYPE_META,
  };
}
