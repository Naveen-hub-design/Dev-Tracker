import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import AnimatedNumber from './AnimatedNumber';
import BadgeModal from '../badge/BadgeModal';
import { RefreshCw, Sparkles, ExternalLink, Share2, Terminal, Briefcase, Trophy, Flame } from 'lucide-react';
import Button from '../ui/Button';

function getLevel(score) {
  if (score >= 80) return { label: 'Master Engineer', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30' };
  if (score >= 60) return { label: 'Expert Developer', dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/30' };
  if (score >= 40) return { label: 'Advanced Practitioner', dot: 'bg-purple-500', text: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-500/30' };
  if (score >= 20) return { label: 'Intermediate Coder', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/30' };
  return { label: 'Aspiring Developer', dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700' };
}

function getMotivation(score) {
  if (score >= 80) return "Outstanding! You're performing at the top percentile of full stack engineers.";
  if (score >= 60) return "Excellent pace! Your consistency across DSA and GitHub repos is surging.";
  if (score >= 40) return "Strong momentum! Complete your daily challenge to unlock the Habit Titan badge.";
  if (score >= 20) return "Good progress! Connect Codeforces and track job applications to boost your score.";
  return "Connect your accounts and complete daily habits to begin building your developer score.";
}

export default function DashboardHero({ score = 0, loading }) {
  const { user } = useAuth();
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);

  const level = useMemo(() => getLevel(score), [score]);
  const motivation = useMemo(() => getMotivation(score), [score]);

  const primaryHandle = user?.githubUsername || user?.codeforcesUsername || user?.leetcodeUsername || user?.name || 'developer';

  return (
    <>
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${level.bg} ${level.text}`}>
                    <span className={`w-2 h-2 rounded-full ${level.dot} animate-pulse`} />
                    {level.label}
                  </span>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    Developer Productivity Hub
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Welcome back, {user?.name || 'Developer'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                  {motivation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link to="/playground">
                  <Button variant="secondary" size="sm" className="text-xs font-semibold">
                    <Terminal className="w-3.5 h-3.5 text-blue-500" />
                    Playground
                  </Button>
                </Link>

                <Link to="/applications">
                  <Button variant="secondary" size="sm" className="text-xs font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    Pipeline
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBadgeModalOpen(true)}
                  className="text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Badge
                </Button>

                <Link to={`/u/${encodeURIComponent(primaryHandle)}`}>
                  <Button variant="outline" size="sm" className="text-xs font-semibold">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Public Showcase
                  </Button>
                </Link>
              </div>
            </div>

            {/* Developer Score Progress Strip */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  DevTrack Composite Score
                </span>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {loading ? '—' : <><AnimatedNumber value={score} duration={1200} /> / 100</>}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-sm shadow-blue-500/40"
                  style={{
                    width: loading ? '0%' : `${score}%`,
                    transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <BadgeModal
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        username={primaryHandle}
      />
    </>
  );
}
