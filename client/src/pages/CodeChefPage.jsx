import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Trophy,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe,
  Flag,
  ChefHat,
  Star,
  Check,
  Calendar,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useCodeChef } from '../hooks/useCodeChef';
import AnimatedNumber from '../components/dashboard/AnimatedNumber';

function getStarsBadgeStyle(stars = '') {
  const s = String(stars).trim();
  if (s.includes('7')) {
    return {
      label: '7★ Grandmaster',
      badge: '7★',
      color: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30',
      gradient: 'from-red-600 to-rose-700',
    };
  }
  if (s.includes('6')) {
    return {
      label: '6★ Master',
      badge: '6★',
      color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30',
      gradient: 'from-orange-600 to-amber-600',
    };
  }
  if (s.includes('5')) {
    return {
      label: '5★ Candidate Master',
      badge: '5★',
      color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      gradient: 'from-yellow-600 to-amber-500',
    };
  }
  if (s.includes('4')) {
    return {
      label: '4★ Expert',
      badge: '4★',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30',
      gradient: 'from-purple-600 to-indigo-600',
    };
  }
  if (s.includes('3')) {
    return {
      label: '3★ Specialist',
      badge: '3★',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30',
      gradient: 'from-blue-600 to-cyan-600',
    };
  }
  if (s.includes('2')) {
    return {
      label: '2★ Pupil',
      badge: '2★',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      gradient: 'from-emerald-600 to-teal-600',
    };
  }
  if (s.includes('1')) {
    return {
      label: '1★ Newbie',
      badge: '1★',
      color: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30',
      gradient: 'from-slate-600 to-slate-700',
    };
  }
  return {
    label: s ? `${s} Rated` : 'Unrated',
    badge: s || 'Unrated',
    color: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30',
    gradient: 'from-slate-700 to-slate-800',
  };
}

function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1">
      <p className="font-bold text-amber-400">{item.name || item.code}</p>
      <p className="text-slate-300">Rating: <span className="font-extrabold text-white">{item.rating}</span></p>
      {item.rank && <p className="text-slate-400">Rank: #{item.rank}</p>}
      {item.date && <p className="text-slate-500 text-[10px]">{item.date}</p>}
    </div>
  );
}

export default function CodeChefPage() {
  const { data, loading, error, refetch } = useCodeChef();

  if (loading) {
    return (
      <PageContainer title="CodeChef Analytics">
        <div className="space-y-6 animate-pulse">
          <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer title="CodeChef Analytics">
        <EmptyState
          icon={ChefHat}
          title="Connect your CodeChef username"
          description="Link your CodeChef profile in Settings to track contest ratings, star divisions, solved problems, and global rankings."
          action={
            <Button
              onClick={() => (window.location.href = '/settings')}
              variant="primary"
              size="sm"
            >
              Go to Settings
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const {
    username,
    name,
    country,
    currentRating = 0,
    highestRating = 0,
    stars = '',
    division = '',
    globalRank = null,
    countryRank = null,
    totalSolved = 0,
    fullySolved = 0,
    partiallySolved = 0,
    contestCount = 0,
    ratingHistory = [],
    profileUrl,
  } = data;

  const starStyle = getStarsBadgeStyle(stars);
  const externalLink = profileUrl || `https://www.codechef.com/users/${encodeURIComponent(username)}`;

  return (
    <PageContainer
      title=""
      subtitle=""
      actions={
        <Button onClick={refetch} variant="secondary" size="sm" loading={loading}>
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Sync CodeChef
        </Button>
      }
    >
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={refetch} variant="ghost" size="sm" className="h-7 text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Profile Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#1c1917] to-slate-900 p-6 lg:p-8 text-white shadow-lg border border-slate-800"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center font-extrabold text-2xl shadow-md ring-2 ring-amber-500/40">
                <ChefHat className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {username}
                </h1>
                {name && (
                  <span className="text-sm text-slate-300 font-medium">({name})</span>
                )}
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${starStyle.color}`}
                >
                  {starStyle.badge}
                </span>
                {division && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    {division}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-300 mt-1.5 flex items-center gap-3 flex-wrap">
                {country && (
                  <span className="inline-flex items-center gap-1 text-slate-300">
                    <Globe className="w-3 h-3 text-amber-400" /> {country}
                  </span>
                )}
                <span>•</span>
                <span>Max Rating: <strong className="text-white">{highestRating}</strong></span>
                <span>•</span>
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium"
                >
                  CodeChef Profile <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Contest Rating</div>
              <div className="text-3xl font-black text-amber-400">
                <AnimatedNumber value={currentRating} />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {starStyle.label}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Current Rating</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={currentRating} />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{starStyle.badge} Division</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Highest Rating</span>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={highestRating} />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">All-time Peak</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={totalSolved || fullySolved} />
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              {fullySolved} fully solved
            </p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Contests</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={contestCount || ratingHistory.length} />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Rated Contests</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Global Rank</span>
            <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {globalRank ? `#${globalRank.toLocaleString()}` : '—'}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Worldwide</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Country Rank</span>
            <Flag className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {countryRank ? `#${countryRank.toLocaleString()}` : '—'}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{country || 'National'}</p>
          </div>
        </Card>
      </div>

      {/* Rating Progression Chart */}
      {ratingHistory.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Contest Rating History
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {ratingHistory.length} Contests Logged
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ratingHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="ccRatingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 100', 'dataMax + 100']}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#ccRatingGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Solved Problems Breakdown & Recent Contests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problems Solved Breakdown */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Problems Solved
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-4 text-center">
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
                <AnimatedNumber value={totalSolved || fullySolved} />
              </p>
              <p className="text-xs text-slate-500 mt-1">Total Solved Problems</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Fully Solved</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{fullySolved}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${totalSolved ? Math.min(100, Math.round((fullySolved / totalSolved) * 100)) : 100}%`,
                    }}
                  />
                </div>
              </div>

              {partiallySolved > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className="text-amber-600 dark:text-amber-400">Partially Solved</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{partiallySolved}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${totalSolved ? Math.min(100, Math.round((partiallySolved / totalSolved) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              href={externalLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              View problem submissions on CodeChef <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>

        {/* Recent Contests Table */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recent Contests History
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Showing {Math.min(ratingHistory.length, 6)} most recent
            </span>
          </div>

          {ratingHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">Contest</th>
                    <th className="pb-2 font-medium">Code</th>
                    <th className="pb-2 font-medium text-right">Rating</th>
                    <th className="pb-2 font-medium text-right">Rank</th>
                    <th className="pb-2 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {ratingHistory
                    .slice(-6)
                    .reverse()
                    .map((c, idx) => (
                      <tr key={c.code || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 font-medium text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                          {c.name || c.code}
                        </td>
                        <td className="py-2.5 text-slate-500 font-mono text-[11px]">
                          {c.code}
                        </td>
                        <td className="py-2.5 text-right font-bold text-amber-600 dark:text-amber-400">
                          {c.rating}
                        </td>
                        <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">
                          {c.rank ? `#${c.rank}` : '—'}
                        </td>
                        <td className="py-2.5 text-right text-slate-400 text-[11px]">
                          {c.date || '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              No contest history found for this account.
            </p>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
