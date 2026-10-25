import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Trophy,
  Flame,
  Binary,
  Code2,
  Shield,
  Layers,
  Sparkles,
  CalendarPlus,
  Radio,
  ChevronRight,
  Info,
  ChefHat,
  LayoutGrid,
  List,
} from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useContests, getTimeRemaining, formatDuration } from '../hooks/useContests';
import { generateGoogleCalendarUrl } from '../api/contests';

const PLATFORM_CONFIG = {
  codeforces: {
    name: 'Codeforces',
    color: 'from-rose-500/20 to-red-600/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: Binary,
    brandColor: '#ef4444',
  },
  leetcode: {
    name: 'LeetCode',
    color: 'from-amber-500/20 to-orange-600/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: Code2,
    brandColor: '#f59e0b',
  },
  codechef: {
    name: 'CodeChef',
    color: 'from-orange-600/20 to-amber-700/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
    badge: 'bg-orange-600/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    icon: ChefHat,
    brandColor: '#ea580c',
  },
  atcoder: {
    name: 'AtCoder',
    color: 'from-cyan-500/20 to-blue-600/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    icon: Layers,
    brandColor: '#06b6d4',
  },
  hackerrank: {
    name: 'HackerRank',
    color: 'from-emerald-500/20 to-teal-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: Shield,
    brandColor: '#10b981',
  },
  all: {
    name: 'All Platforms',
    color: 'from-blue-500/20 to-indigo-600/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: CalendarIcon,
    brandColor: '#3b82f6',
  },
};

function formatStartTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function HeroCountdown({ contest }) {
  if (!contest) return null;
  const remaining = getTimeRemaining(contest.startTime);
  const cfg = PLATFORM_CONFIG[contest.platform] || PLATFORM_CONFIG.all;
  const Icon = cfg.icon;
  const gcalUrl = generateGoogleCalendarUrl(contest);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-6 md:p-8 shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              NEXT LIVE ROUND
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.badge} bg-white/10 text-white`}>
              <Icon className="w-3.5 h-3.5" />
              {cfg.name}
            </span>
            {contest.division && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {contest.division}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            {contest.name}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              {formatStartTime(contest.startTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              {formatDuration(contest.durationSeconds)}
            </span>
            <span className="text-slate-400 text-xs">
              Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CalendarPlus className="w-4 h-4" />
              Add to Google Calendar
            </a>
            <a
              href={contest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-[1.02]"
            >
              <ExternalLink className="w-4 h-4" />
              Open Contest Page
            </a>
          </div>
        </div>

        {/* Big Live Countdown Clock */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-inner">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {remaining.isLive ? 'Round Started' : 'Starts In'}
          </span>
          {remaining.isLive ? (
            <div className="px-6 py-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xl animate-pulse">
              CONTEST IS LIVE NOW!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 md:gap-3 text-center">
              <div className="flex flex-col p-2.5 md:p-3 rounded-xl bg-slate-900/90 border border-slate-700 min-w-[56px] md:min-w-[64px]">
                <span className="text-2xl md:text-3xl font-extrabold text-blue-400 font-mono">
                  {String(remaining.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Days</span>
              </div>
              <div className="flex flex-col p-2.5 md:p-3 rounded-xl bg-slate-900/90 border border-slate-700 min-w-[56px] md:min-w-[64px]">
                <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                  {String(remaining.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Hours</span>
              </div>
              <div className="flex flex-col p-2.5 md:p-3 rounded-xl bg-slate-900/90 border border-slate-700 min-w-[56px] md:min-w-[64px]">
                <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                  {String(remaining.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Mins</span>
              </div>
              <div className="flex flex-col p-2.5 md:p-3 rounded-xl bg-slate-900/90 border border-slate-700 min-w-[56px] md:min-w-[64px]">
                <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">
                  {String(remaining.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Secs</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContestCard({ contest }) {
  const cfg = PLATFORM_CONFIG[contest.platform] || PLATFORM_CONFIG.all;
  const Icon = cfg.icon;
  const remaining = getTimeRemaining(contest.startTime);
  const gcalUrl = generateGoogleCalendarUrl(contest);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      <div>
        {/* Top platform bar & status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.badge}`}>
            <Icon className="w-3.5 h-3.5" />
            {cfg.name}
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              remaining.isLive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {remaining.formatted}
          </span>
        </div>

        {/* Contest Name */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {contest.name}
        </h3>

        {/* Division tag if present */}
        {contest.division && (
          <div className="mb-3">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {contest.division}
            </span>
          </div>
        )}

        {/* Time & Duration */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatStartTime(contest.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Duration: {formatDuration(contest.durationSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 dark:bg-slate-800 dark:hover:bg-blue-900/30 dark:text-slate-300 dark:hover:text-blue-300 transition-colors"
          title="Add to Google Calendar"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-blue-500" />
          Add to GCal
        </a>
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm shadow-blue-600/20"
        >
          Register
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

function TimelineContestRow({ contest }) {
  const cfg = PLATFORM_CONFIG[contest.platform] || PLATFORM_CONFIG.all;
  const Icon = cfg.icon;
  const remaining = getTimeRemaining(contest.startTime);
  const gcalUrl = generateGoogleCalendarUrl(contest);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-sm">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div className={`p-2.5 rounded-xl border ${cfg.badge} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
              {contest.name}
            </h4>
            {contest.division && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {contest.division}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {new Date(contest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>•</span>
            <span>{formatDuration(contest.durationSeconds)}</span>
            <span>•</span>
            <span className={remaining.isLive ? 'text-emerald-500 font-semibold animate-pulse' : ''}>
              {remaining.formatted}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-900/30 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 transition-all"
          title="Add to Google Calendar"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-blue-500" />
          <span>Add to GCal</span>
        </a>
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20 transition-all"
        >
          <span>Register</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default function ContestCalendarPage() {
  const {
    contests,
    nextContest,
    platformFilter,
    setPlatformFilter,
    platformCounts,
    loading,
    error,
    refetch,
  } = useContests();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'timeline'

  const filteredContests = useMemo(() => {
    return contests.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.division && c.division.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [contests, searchQuery]);

  // Group contests by day for timeline view
  const groupedByDate = useMemo(() => {
    const groups = {};
    filteredContests.forEach((c) => {
      const dayKey = new Date(c.startTime).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(c);
    });
    return groups;
  }, [filteredContests]);

  const platformTabs = [
    { key: 'all', label: 'All', icon: CalendarIcon },
    { key: 'codeforces', label: 'Codeforces', icon: Binary },
    { key: 'leetcode', label: 'LeetCode', icon: Code2 },
    { key: 'codechef', label: 'CodeChef', icon: Trophy },
    { key: 'atcoder', label: 'AtCoder', icon: Layers },
    { key: 'hackerrank', label: 'HackerRank', icon: Shield },
  ];

  return (
    <PageContainer
      title="Contest Calendar"
      description="Track upcoming competitive programming contests across Codeforces, LeetCode, CodeChef, and AtCoder with live countdowns and Google Calendar sync."
    >
      <div className="space-y-6">
        {/* Next Live Round Hero Banner */}
        {nextContest && <HeroCountdown contest={nextContest} />}

        {/* Filter and Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {/* Platform Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {platformTabs.map((tab) => {
              const TabIcon = tab.icon;
              const count = platformCounts[tab.key] || 0;
              const active = platformFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setPlatformFilter(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
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
                placeholder="Search round or div..."
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
              className="rounded-xl flex items-center gap-1.5 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Timeline Schedule"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        )}

        {/* Contest Cards Grid View */}
        {!loading && filteredContests.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Timeline Schedule View */}
        {!loading && filteredContests.length > 0 && viewMode === 'timeline' && (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([dateLabel, dayContests]) => (
              <div key={dateLabel} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{dateLabel}</span>
                  <span className="text-[11px] font-normal lowercase text-slate-400">
                    ({dayContests.length} {dayContests.length === 1 ? 'round' : 'rounds'})
                  </span>
                </div>
                <div className="space-y-2">
                  {dayContests.map((c) => (
                    <TimelineContestRow key={c.id} contest={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredContests.length === 0 && (
          <EmptyState
            icon={CalendarIcon}
            title="No upcoming contests found"
            description={
              searchQuery
                ? `No contests match "${searchQuery}". Try a different keyword.`
                : 'There are currently no scheduled contests for this platform.'
            }
            action={
              searchQuery ? (
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={refetch}>
                  Refresh Schedule
                </Button>
              )
            }
          />
        )}

        {/* Quick Sync & Tips Footnote */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-100 dark:border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Contests are auto-synchronized with official platform APIs and updated every 15 minutes.
              Clicking <strong>Add to GCal</strong> automatically pre-fills contest start, end time, and platform links in your local timezone.
            </span>
          </div>
          <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">
            {filteredContests.length} rounds scheduled
          </span>
        </div>
      </div>
    </PageContainer>
  );
}
