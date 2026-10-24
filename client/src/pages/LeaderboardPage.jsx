import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Search,
  RefreshCw,
  ExternalLink,
  Code2,
  Github,
  Binary,
  Sparkles,
  TrendingUp,
  User,
  Shield,
  Layers,
} from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useLeaderboard } from '../hooks/useLeaderboard';

const CATEGORIES = [
  { id: 'overall', label: 'All-Round Score', icon: Trophy, desc: 'Overall Developer Score' },
  { id: 'algorithms', label: 'Algorithms & CP', icon: Code2, desc: 'LeetCode & Codeforces' },
  { id: 'opensource', label: 'Open Source', icon: Github, desc: 'Commits & Stars' },
  { id: 'consistency', label: 'Daily Streak', icon: Flame, desc: 'Active Daily Solves' },
];

function getRankBadge(rank) {
  if (rank === 1) {
    return {
      label: '1st',
      icon: Trophy,
      bg: 'bg-amber-500/20 text-amber-500 border-amber-500/40 ring-2 ring-amber-500/30',
      podiumBg: 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/40',
      glow: 'shadow-lg shadow-amber-500/20',
      color: 'text-amber-500',
    };
  }
  if (rank === 2) {
    return {
      label: '2nd',
      icon: Medal,
      bg: 'bg-slate-300/20 text-slate-300 border-slate-300/40',
      podiumBg: 'from-slate-400/20 via-slate-400/10 to-transparent border-slate-400/40',
      glow: 'shadow-md shadow-slate-400/10',
      color: 'text-slate-300',
    };
  }
  if (rank === 3) {
    return {
      label: '3rd',
      icon: Award,
      bg: 'bg-amber-700/20 text-amber-600 dark:text-amber-400 border-amber-700/40',
      podiumBg: 'from-amber-700/20 via-orange-700/10 to-transparent border-amber-700/40',
      glow: 'shadow-md shadow-amber-700/10',
      color: 'text-amber-600 dark:text-amber-400',
    };
  }
  return {
    label: `#${rank}`,
    icon: null,
    bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    podiumBg: '',
    glow: '',
    color: 'text-slate-500',
  };
}

export default function LeaderboardPage() {
  const {
    category,
    setCategory,
    rankings,
    top3,
    currentUserRank,
    totalDevelopers,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    refetch,
  } = useLeaderboard();

  return (
    <PageContainer
      title="Developer Leaderboard"
      subtitle="Global developer rankings based on unified placement score, algorithmic mastery, and habit consistency."
    >
      <div className="space-y-6">
        {/* Top Podium for Top 3 (if 3 or more developers) */}
        {!loading && top3.length >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 pb-4">
            {/* 2nd Place */}
            {top3[1] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="order-2 md:order-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100/60 to-white dark:from-slate-800/40 dark:to-slate-900 p-5 flex flex-col items-center text-center shadow-sm relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-slate-300/30 text-slate-400 font-bold text-xs flex items-center justify-center mb-2">
                  2
                </div>
                <img
                  src={top3[1].avatar}
                  alt={top3[1].name}
                  className="w-16 h-16 rounded-full border-2 border-slate-300 shadow-md mb-2 object-cover"
                />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                  {top3[1].name}
                </h3>
                <span className="text-xs text-slate-400 mb-2">
                  Top {top3[1].percentile}%
                </span>
                <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">Score</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{top3[1].developerScore}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Solved</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{top3[1].totalProblems}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1st Place (Center, Elevated) */}
            {top3[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="order-1 md:order-2 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-white dark:to-slate-900 p-6 flex flex-col items-center text-center shadow-lg shadow-amber-500/10 relative overflow-hidden md:-mt-2"
              >
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    <Trophy className="w-3 h-3" />
                    RANK #1
                  </span>
                </div>
                <div className="relative mb-2">
                  <img
                    src={top3[0].avatar}
                    alt={top3[0].name}
                    className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-xl object-cover"
                  />
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                  {top3[0].name}
                </h3>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">
                  Top 1% • {top3[0].tier}
                </span>

                <div className="w-full pt-3 border-t border-amber-500/20 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">Dev Score</span>
                    <p className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">{top3[0].developerScore}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Solved</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{top3[0].totalProblems}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Streak</span>
                    <p className="font-bold text-orange-500 text-sm">🔥 {top3[0].dailyStreakCount}d</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="order-3 md:order-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-amber-900/10 to-white dark:from-slate-800/40 dark:to-slate-900 p-5 flex flex-col items-center text-center shadow-sm relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 font-bold text-xs flex items-center justify-center mb-2">
                  3
                </div>
                <img
                  src={top3[2].avatar}
                  alt={top3[2].name}
                  className="w-16 h-16 rounded-full border-2 border-amber-700/40 shadow-md mb-2 object-cover"
                />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                  {top3[2].name}
                </h3>
                <span className="text-xs text-slate-400 mb-2">
                  Top {top3[2].percentile}%
                </span>
                <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">Score</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{top3[2].developerScore}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Solved</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{top3[2].totalProblems}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search developer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="rounded-xl flex items-center gap-1 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Current User Rank Ribbon (if logged in) */}
        {currentUserRank && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                #{currentUserRank.rank}
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                You are ranked <strong>#{currentUserRank.rank}</strong> out of {totalDevelopers} developers (Top {currentUserRank.percentile}%).
              </span>
            </div>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              Developer Score: {currentUserRank.developerScore}
            </span>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Developer</th>
                  <th className="py-3 px-4 text-center">Dev Score</th>
                  <th className="py-3 px-4 text-center">Solved</th>
                  <th className="py-3 px-4 text-center">Commits</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                  <th className="py-3 px-4 text-right">Showcase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rankings.map((dev) => {
                  const badge = getRankBadge(dev.rank);
                  return (
                    <tr
                      key={dev.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        dev.isCurrentUser ? 'bg-blue-50/40 dark:bg-blue-950/20 font-medium' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Developer Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dev.avatar}
                            alt={dev.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-slate-100">{dev.name}</span>
                              {dev.isCurrentUser && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              {dev.githubUsername && <span>@{dev.githubUsername}</span>}
                              {dev.cfRank && (
                                <span className="px-1.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                                  {dev.cfRank}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dev Score */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {dev.developerScore}
                        </span>
                      </td>

                      {/* Problems Solved */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {dev.totalProblems}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          LC: {dev.lcSolved} • CF: {dev.cfSolved}
                        </span>
                      </td>

                      {/* Commits */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {dev.commits}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ⭐ {dev.stars}
                        </span>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-4 text-center">
                        {dev.dailyStreakCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            <Flame className="w-3 h-3 fill-current" />
                            {dev.dailyStreakCount}d
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">—</span>
                        )}
                      </td>

                      {/* Public Showcase Link */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/u/${dev.githubUsername || dev.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span>Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {rankings.length === 0 && !loading && (
            <div className="p-8 text-center text-xs text-slate-400">
              No developers match "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
