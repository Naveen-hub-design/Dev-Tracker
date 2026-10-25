import React from 'react';
import Card from '../ui/Card';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Trophy, ChefHat, Award, Star, Flame, Target, TrendingUp, ExternalLink } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

function SectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Skeleton className="h-6 w-6 rounded-lg" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function CompetitiveProgrammingAnalytics({ data, loading }) {
  if (loading) return <SectionSkeleton />;

  const cf = data?.codeforces || {};
  const cc = data?.codechef || {};

  const cfRating = cf?.profile?.rating || cf?.rating || 0;
  const cfMaxRating = cf?.profile?.maxRating || cf?.maxRating || cfRating;
  const cfRank = cf?.profile?.rank || cf?.rank || 'Unrated';
  const cfSolved = cf?.stats?.totalSolved || cf?.solved || 0;
  const cfContests = cf?.stats?.contestsCount || cf?.contests || 0;

  const ccRating = cc?.currentRating || cc?.rating || 0;
  const ccMaxRating = cc?.highestRating || cc?.maxRating || ccRating;
  const ccStars = cc?.stars || '1★';
  const ccDivision = cc?.division || 'Div 4';
  const ccSolved = cc?.totalSolved || cc?.fullySolved || cc?.solved || 0;
  const ccGlobalRank = cc?.globalRank || null;

  const comparisonData = [
    { platform: 'Codeforces', current: cfRating, peak: cfMaxRating, solved: cfSolved, color: '#3b82f6' },
    { platform: 'CodeChef', current: ccRating, peak: ccMaxRating, solved: ccSolved, color: '#f97316' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Competitive Programming Intelligence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contest ratings, global divisions, and problem-solving metrics across CodeChef &amp; Codeforces
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Codeforces CP Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Codeforces CP</h3>
                  <p className="text-[11px] text-slate-400 capitalize">{cfRank}</p>
                </div>
              </div>
              {cfRating > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                  {cfRating}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{cfRating || '—'}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Current Rating</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">{cfMaxRating || '—'}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Peak Rating</p>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Contest Solves</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{cfSolved} problems</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Contests Participated</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{cfContests} rounds</span>
              </div>
            </div>
          </div>
        </div>

        {/* CodeChef CP Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">CodeChef CP</h3>
                  <p className="text-[11px] text-slate-400">{ccStars} · {ccDivision}</p>
                </div>
              </div>
              {ccRating > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/40">
                  {ccRating}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{ccRating || '—'}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Starters Rating</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xl font-black text-orange-600 dark:text-orange-400">{ccMaxRating || '—'}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Highest Rating</p>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Fully Solved</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{ccSolved} problems</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Global Rank</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {ccGlobalRank ? `#${ccGlobalRank.toLocaleString()}` : 'Top Tier'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual CP Rating Comparison Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Contest Rating Comparison
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Current vs Peak ratings across competitive coding profiles
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} domain={[0, 'dataMax + 200']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="current" name="Current Rating" fill="#f97316" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="peak" name="Peak Rating" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" /> CodeChef
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Codeforces
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
