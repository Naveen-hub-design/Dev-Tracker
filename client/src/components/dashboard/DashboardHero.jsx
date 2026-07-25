import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import AnimatedNumber from './AnimatedNumber';
import { RefreshCw } from 'lucide-react';

function getLevel(score) {
  if (score >= 80) return { label: 'Master', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 ring-emerald-600/10' };
  if (score >= 60) return { label: 'Expert', dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50 ring-blue-600/10' };
  if (score >= 40) return { label: 'Advanced', dot: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50 ring-purple-600/10' };
  if (score >= 20) return { label: 'Intermediate', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 ring-amber-600/10' };
  return { label: 'Beginner', dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50 ring-slate-500/10' };
}

function getMotivation(score) {
  if (score >= 80) return "Outstanding! You're ready for top product companies.";
  if (score >= 60) return "Excellent work! You're approaching elite level.";
  if (score >= 40) return "Great progress! Keep building your skills.";
  if (score >= 20) return "Good start! Consistency is the key to improvement.";
  return "Connect your accounts to start tracking your developer progress.";
}

function formatSyncTime() {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function DashboardHero({ score = 0, loading }) {
  const { user } = useAuth();
  const level = useMemo(() => getLevel(score), [score]);
  const motivation = useMemo(() => getMotivation(score), [score]);

  return (
    <FadeIn>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 dark:from-blue-900/20 dark:via-slate-900 dark:to-indigo-900/20 pointer-events-none" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {user?.name || 'Developer'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ring-inset ${level.bg} ${level.text}`}>
                <span className={`w-2 h-2 rounded-full ${level.dot}`} />
                {level.label}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                Synced {formatSyncTime()}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Developer Score</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {loading ? '—' : <><AnimatedNumber value={score} duration={1200} />/100</>}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{
                  width: loading ? '0%' : `${score}%`,
                  transition: 'width 1s ease-out',
                }}
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic">{motivation}</p>
        </div>
      </Card>
    </FadeIn>
  );
}
