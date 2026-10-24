import React from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Trophy,
  TrendingUp,
  Award,
  RefreshCw,
  ExternalLink,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useCodeforces } from '../hooks/useCodeforces';
import AnimatedNumber from '../components/dashboard/AnimatedNumber';

function getRankBadgeStyle(rank = '') {
  const r = rank.toLowerCase();
  if (r.includes('legendary') || r.includes('grandmaster')) {
    return { label: rank.toUpperCase(), color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30' };
  }
  if (r.includes('master')) {
    return { label: rank.toUpperCase(), color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' };
  }
  if (r.includes('candidate')) {
    return { label: rank.toUpperCase(), color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30' };
  }
  if (r.includes('expert')) {
    return { label: rank.toUpperCase(), color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30' };
  }
  if (r.includes('specialist')) {
    return { label: rank.toUpperCase(), color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
  }
  if (r.includes('pupil')) {
    return { label: rank.toUpperCase(), color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  }
  return { label: (rank || 'NEWBIE').toUpperCase(), color: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30' };
}

export default function CodeforcesPage() {
  const { data, loading, error, refetch } = useCodeforces();

  if (loading) {
    return (
      <PageContainer title="Codeforces Analytics">
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
      <PageContainer title="Codeforces Analytics">
        <EmptyState
          icon={Code}
          title="Connect your Codeforces handle"
          description="Link your Codeforces profile in Settings to track live contest ratings, solved problems, and global rankings."
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

  const { profile, stats, ratingHistory = [], tagDistribution = [], difficultyDistribution = [], recentSolved = [] } = data;
  const rankStyle = getRankBadgeStyle(profile.rank);

  return (
    <PageContainer
      title=""
      subtitle=""
      actions={
        <Button onClick={refetch} variant="secondary" size="sm" loading={loading}>
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Sync Codeforces
        </Button>
      }
    >
      {/* Profile Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 lg:p-8 text-white shadow-lg border border-slate-800"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.handle}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-2xl shadow-md">
                  {profile.handle.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {profile.handle}
                </h1>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${rankStyle.color}`}
                >
                  {rankStyle.label}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>Max Rating: {profile.maxRating} ({profile.maxRank})</span>
                <span>•</span>
                <a
                  href={`https://codeforces.com/profile/${profile.handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                >
                  Codeforces Profile <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Contest Rating</div>
              <div className="text-3xl font-black text-indigo-400">
                <AnimatedNumber value={profile.rating} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Rating</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={profile.rating} />
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Max Rating</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={profile.maxRating} />
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Solved Problems</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={stats.totalSolved} />
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Contests Attended</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber value={stats.contestsCount} />
            </div>
          </div>
        </Card>
      </div>

      {/* Rating Progression Chart */}
      {ratingHistory.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Official Rating Progression
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {ratingHistory.length} Contests Logged
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ratingHistory}>
                <defs>
                  <linearGradient id="cfRatingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs border border-slate-700">
                          <p className="font-semibold">{item.contestName}</p>
                          <p className="text-indigo-400 mt-1">
                            Rating: {item.newRating} ({item.newRating - item.oldRating >= 0 ? `+${item.newRating - item.oldRating}` : item.newRating - item.oldRating})
                          </p>
                          <p className="text-slate-400">Contest Rank: #{item.rank}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5">{item.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="newRating"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cfRatingGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Two Column Grid: Tags & Difficulty */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Solved by Tag */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Problem Distribution by Topic
            </h3>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tagDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis
                  dataKey="tag"
                  type="category"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  width={110}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Difficulty Distribution */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Solved by Difficulty Rating
            </h3>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Solved Problems Table */}
      {recentSolved.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Recently Solved Codeforces Problems
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentSolved.map((prob, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {prob.name}
                  </span>
                  <div className="flex gap-1.5 mt-0.5">
                    {prob.tags.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {prob.rating}
                  </span>
                  <span className="text-emerald-500 font-semibold">
                    ✓ Solved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
