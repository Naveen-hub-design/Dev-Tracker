import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'devtrack_goals';
const HISTORY_KEY = 'devtrack_goals_history';

const DEFAULT_GOALS = {
  daily: { commits: 3, problems: 2, hours: 2 },
  weekly: { commits: 15, problems: 10, hours: 14 },
  monthly: { commits: 60, problems: 40, hours: 60 },
};

function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_GOALS;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveGoals(goals) { localStorage.setItem(STORAGE_KEY, JSON.stringify(goals)); }
function saveHistory(hist) { localStorage.setItem(HISTORY_KEY, JSON.stringify(hist)); }

function todayKey() { return new Date().toISOString().slice(0, 10); }

function generateDemoHistory() {
  const hist = {};
  const now = new Date();
  for (let i = 0; i < 180; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (Math.random() > 0.25) {
      hist[key] = {
        commits: Math.floor(Math.random() * 8),
        problems: Math.floor(Math.random() * 5),
        hours: Math.round(Math.random() * 5 * 10) / 10,
      };
    }
  }
  return hist;
}

const ACHIEVEMENTS = [
  { id: 'first-day', name: 'First Day', desc: 'Complete your first day of coding', icon: '🌱', threshold: 1, type: 'streak' },
  { id: 'week-warrior', name: 'Week Warrior', desc: 'Maintain a 7-day streak', icon: '⚔️', threshold: 7, type: 'streak' },
  { id: 'fortnight', name: 'Fortnight Force', desc: '14-day coding streak', icon: '💪', threshold: 14, type: 'streak' },
  { id: 'month-master', name: 'Month Master', desc: '30-day coding streak', icon: '👑', threshold: 30, type: 'streak' },
  { id: 'centurion', name: 'Centurion', desc: '100-day coding streak', icon: '🏆', threshold: 100, type: 'streak' },
  { id: 'century-problems', name: 'Problem Crusher', desc: 'Solve 100 problems total', icon: '🧠', threshold: 100, type: 'problems' },
  { id: 'five-hundred', name: 'Code Marathon', desc: '500 total problems solved', icon: '🔥', threshold: 500, type: 'problems' },
  { id: 'night-owl', name: 'Night Owl', desc: 'Code past midnight', icon: '🦉', threshold: 1, type: 'special' },
  { id: 'early-bird', name: 'Early Bird', desc: 'Code before 7 AM', icon: '🐦', threshold: 1, type: 'special' },
  { id: 'five-star', name: 'Five Star', desc: 'Complete all daily goals 5 days in a row', icon: '⭐', threshold: 5, type: 'perfect' },
];

const REMINDERS = [
  { title: 'Stay Consistent', desc: 'Even 30 minutes of daily coding builds powerful habits over time.', color: 'from-blue-500 to-indigo-600' },
  { title: 'Break It Down', desc: 'Split large goals into smaller, achievable milestones for better progress.', color: 'from-emerald-500 to-teal-600' },
  { title: 'Review Weekly', desc: 'Analyze your weekly patterns to find your most productive coding windows.', color: 'from-violet-500 to-purple-600' },
  { title: 'Celebrate Wins', desc: 'Acknowledge each achievement — every badge earned marks real growth.', color: 'from-amber-500 to-orange-600' },
  { title: 'Rest Matters', desc: 'Sustainable progress beats burnout. Take breaks when needed.', color: 'from-rose-500 to-pink-600' },
];

function calcStreaks(history) {
  const sorted = Object.keys(history).sort().reverse();
  if (!sorted.length) return { current: 0, longest: 0 };
  let current = 0, longest = 0, temp = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (history[key]) {
      temp++;
      if (i === current || i === 0) current = temp;
    } else {
      if (temp > longest) longest = temp;
      temp = 0;
    }
  }
  if (temp > longest) longest = temp;
  return { current, longest };
}

export function useGoals() {
  const [goals, setGoals] = useState(loadGoals);
  const [history, setHistory] = useState(() => {
    const h = loadHistory();
    if (Object.keys(h).length === 0) return generateDemoHistory();
    return h;
  });
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => { saveGoals(goals); }, [goals]);
  useEffect(() => { saveHistory(history); }, [history]);

  const todayActivity = useMemo(() => history[todayKey()] || { commits: 0, problems: 0, hours: 0 }, [history]);

  const streaks = useMemo(() => calcStreaks(history), [history]);

  const achievements = useMemo(() => {
    return ACHIEVEMENTS.map((a) => {
      let unlocked = false;
      if (a.type === 'streak') unlocked = streaks.longest >= a.threshold;
      else if (a.type === 'problems') {
        const totalProblems = Object.values(history).reduce((s, d) => s + (d.problems || 0), 0);
        unlocked = totalProblems >= a.threshold;
      } else if (a.type === 'special') {
        unlocked = streaks.current >= a.threshold;
      } else if (a.type === 'perfect') {
        unlocked = streaks.current >= a.threshold;
      }
      return { ...a, unlocked };
    });
  }, [history, streaks]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    return days.map((label, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - ((now.getDay() - i + 7) % 7));
      const key = d.toISOString().slice(0, 10);
      const dayData = history[key] || { commits: 0, problems: 0, hours: 0 };
      return { name: label, ...dayData };
    });
  }, [history]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }).map((_, i) => {
      const month = new Date(now.getFullYear(), i, 1);
      const label = month.toLocaleString('en-US', { month: 'short' });
      let commits = 0, problems = 0, hours = 0;
      Object.entries(history).forEach(([key, val]) => {
        const d = new Date(key);
        if (d.getMonth() === i && d.getFullYear() === now.getFullYear()) {
          commits += val.commits || 0;
          problems += val.problems || 0;
          hours += val.hours || 0;
        }
      });
      return { name: label, commits, problems, hours };
    });
  }, [history]);

  const heatmapData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const day = history[key];
      const total = day ? (day.commits || 0) + (day.problems || 0) : 0;
      data.push({ date: key, count: total, level: total === 0 ? 0 : total <= 2 ? 1 : total <= 4 ? 2 : total <= 6 ? 3 : 4 });
    }
    return data.reverse();
  }, [history]);

  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, key, data: history[key] || null, isToday: key === todayKey() });
    }
    return cells;
  }, [history]);

  const ringProgress = useMemo(() => ({
    daily: {
      commits: Math.min(1, (todayActivity.commits || 0) / Math.max(1, goals.daily.commits)),
      problems: Math.min(1, (todayActivity.problems || 0) / Math.max(1, goals.daily.problems)),
      hours: Math.min(1, (todayActivity.hours || 0) / Math.max(1, goals.daily.hours)),
    },
    weekly: {
      commits: Math.min(1, (weeklyData.reduce((s, d) => s + d.commits, 0)) / Math.max(1, goals.weekly.commits)),
      problems: Math.min(1, (weeklyData.reduce((s, d) => s + d.problems, 0)) / Math.max(1, goals.weekly.problems)),
      hours: Math.min(1, (weeklyData.reduce((s, d) => s + d.hours, 0)) / Math.max(1, goals.weekly.hours)),
    },
  }), [todayActivity, goals, weeklyData]);

  const updateGoal = useCallback((period, field, value) => {
    setGoals((prev) => ({ ...prev, [period]: { ...prev[period], [field]: Math.max(0, parseInt(value) || 0) } }));
  }, []);

  const logToday = useCallback((data) => {
    const key = todayKey();
    setHistory((prev) => ({ ...prev, [key]: { ...prev[key], ...data } }));
  }, []);

  return {
    goals, history, todayActivity, streaks, achievements, weeklyData,
    monthlyData, heatmapData, calendarData, ringProgress, showEditor,
    setShowEditor, updateGoal, logToday, REMINDERS,
  };
}
