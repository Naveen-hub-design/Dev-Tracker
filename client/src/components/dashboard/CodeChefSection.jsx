import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import AnimatedNumber from './AnimatedNumber';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { ChefHat, Trophy, Award, TrendingUp, ExternalLink, ArrowRight } from 'lucide-react';

function SectionSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-36 mb-5" />
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[1, 2].map((i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton className="h-7 w-14 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    </Card>
  );
}

export default function CodeChefSection({ data, loading }) {
  if (loading) return <SectionSkeleton />;

  if (!data || (!data.currentRating && !data.solved && !data.username)) {
    return (
      <Card>
        <EmptyState
          icon={ChefHat}
          title="No CodeChef data"
          description="Connect your CodeChef account in Settings to track contest ratings and rankings."
          action={
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors"
            >
              Connect CodeChef
            </Link>
          }
        />
      </Card>
    );
  }

  const rating = data.currentRating || data.rating || 0;
  const maxRating = data.highestRating || data.maxRating || rating;
  const stars = data.stars || '1★';
  const solved = data.totalSolved || data.solved || data.fullySolved || 0;
  const contests = data.contestCount || (data.ratingHistory ? data.ratingHistory.length : 0);

  return (
    <FadeIn>
      <Card className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">CodeChef Analytics</h3>
                <p className="text-[11px] text-slate-400">Competitive Programming</p>
              </div>
            </div>
            {data.stars && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {data.stars} {data.division ? `(${data.division})` : ''}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                <AnimatedNumber value={rating} />
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Rating (Max {maxRating})</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                <AnimatedNumber value={solved} />
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Problems Solved</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500">Contests</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{contests}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500">Global Rank</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {data.globalRank ? `#${data.globalRank.toLocaleString()}` : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link
            to="/codechef"
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1"
          >
            Full Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {data.username && (
            <a
              href={`https://www.codechef.com/users/${encodeURIComponent(data.username)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1"
            >
              Profile <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </Card>
    </FadeIn>
  );
}
