import { Zap, Flame, Calendar } from 'lucide-react';

export default function StreakTracker({ data, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="skeleton w-6 h-6 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const days = data?.days || generateDemoDays();
  const stats = data?.stats || { currentStreak: 5, longestStreak: 12, totalActive: 21 };
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="card">
      <h3 className="section-title">Streak Tracker (28 Days)</h3>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekLabels.map((label) => (
          <div key={label} className="text-center text-[10px] text-slate-400 font-medium">
            {label}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`w-full aspect-square rounded-md transition-colors ${
              day.active ? getDayColor(day.count) : 'bg-slate-100'
            }`}
            title={`${day.date}: ${day.count} contributions`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-lg font-bold text-slate-900">{stats.currentStreak}</span>
          </div>
          <p className="text-[10px] text-slate-500">Current Streak</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-purple-500 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-lg font-bold text-slate-900">{stats.longestStreak}</span>
          </div>
          <p className="text-[10px] text-slate-500">Longest</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-lg font-bold text-slate-900">{stats.totalActive}</span>
          </div>
          <p className="text-[10px] text-slate-500">Active Days</p>
        </div>
      </div>
    </div>
  );
}

function getDayColor(count) {
  if (count <= 2) return 'bg-green-200';
  if (count <= 5) return 'bg-green-400';
  if (count <= 8) return 'bg-green-500';
  return 'bg-green-600';
}

function generateDemoDays() {
  const days = [];
  const today = new Date();
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const active = Math.random() > 0.3;
    days.push({
      date: date.toISOString().slice(0, 10),
      count: active ? Math.floor(Math.random() * 10) + 1 : 0,
      active,
    });
  }
  return days;
}
