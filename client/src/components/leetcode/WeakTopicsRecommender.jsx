import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  Target,
  Flame,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useWeakTopics } from '../../hooks/useWeakTopics';
import { playNotificationChime } from '../../hooks/useNotifications';
import Button from '../ui/Button';

function getDifficultyBadge(diff = '') {
  const d = diff.toLowerCase();
  if (d === 'easy') {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  }
  if (d === 'hard') {
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  }
  return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
}

function getStatusBadge(status) {
  if (status === 'deficient') {
    return {
      label: 'Critical Gap',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      bar: 'bg-rose-500',
    };
  }
  if (status === 'developing') {
    return {
      label: 'Developing',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      bar: 'bg-amber-500',
    };
  }
  return {
    label: 'Proficient',
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    bar: 'bg-emerald-500',
  };
}

export default function WeakTopicsRecommender({ username = '', compact = false }) {
  const {
    analysis,
    loading,
    error,
    refetch,
    categories,
    filteredProblems,
    selectedCategory,
    setSelectedCategory,
    difficultyFilter,
    setDifficultyFilter,
    practicedMap,
    toggleProblemPracticed,
  } = useWeakTopics(username);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-52 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return null;
  }

  const { overallDsaScore, weakCount, proficientCount, urgentProblems } = analysis;

  const handleToggle = (id) => {
    const isNowPracticed = !practicedMap[id];
    toggleProblemPracticed(id);
    if (isNowPracticed) {
      playNotificationChime();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 dark:border-indigo-500/15 bg-gradient-to-br from-indigo-50/20 via-white to-purple-50/20 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20 p-6 md:p-8 shadow-sm space-y-6">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header & Overall Metric */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Brain className="w-3.5 h-3.5 text-indigo-500" />
              DSA Interview Readiness Engine
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              • Technical Interview Benchmarks
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Weak-Topic DSA Analyzer &amp; Practice Recommender</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            We evaluate your problem history against 8 core technical interview pillars to isolate blindspots and recommend highest-yield practice questions.
          </p>
        </div>

        {/* Readiness Score Stat Badge */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DSA Pillar Coverage
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {overallDsaScore}%
              </span>
              <span className="text-xs text-slate-400">ready</span>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex flex-col gap-1 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {weakCount} Gap{weakCount !== 1 ? 's' : ''} to Focus
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {proficientCount} Strong Topic{proficientCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Urgent Recommended Next Problems */}
      {urgentProblems?.length > 0 && (
        <div className="relative z-10 p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-indigo-500/10 border border-rose-500/20 dark:border-rose-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Top Priority Target Problems (Bridge Your Gaps First)
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Curated for immediate round preparation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentProblems.map((prob) => {
              const isPracticed = practicedMap[prob.id];
              return (
                <div
                  key={prob.id}
                  className="flex flex-col justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40 truncate">
                        {prob.topicName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                          prob.difficulty
                        )}`}
                      >
                        {prob.difficulty}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                      {prob.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {prob.concept}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleToggle(prob.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                        isPracticed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {isPracticed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5" />
                      )}
                      <span>{isPracticed ? 'Practiced' : 'Mark Done'}</span>
                    </button>

                    <a
                      href={prob.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Solve on LeetCode</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8 Core Categories Grid */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Core Topic Mastery Grid
          </span>
          <span className="text-[11px] text-slate-400">Click a topic to filter problems</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categories.map((cat) => {
            const badge = getStatusBadge(cat.status);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)
                }
                className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : badge.bg
                    }`}
                  >
                    {badge.label}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold line-clamp-1 mt-1 ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                  }`}
                  title={cat.name}
                >
                  {cat.shortName}
                </span>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-indigo-100' : 'text-slate-400'}>
                      {cat.solvedCount}/{cat.target}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat.progressPercent}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-1.5 rounded-full overflow-hidden ${
                      isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${
                        isSelected ? 'bg-white' : badge.bar
                      }`}
                      style={{ width: `${cat.progressPercent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Problem Directory with Filters */}
      <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Curated Interview Questions
            </h4>
            <span className="text-xs text-slate-400">
              ({filteredProblems.length} available)
            </span>
          </div>

          {/* Difficulty and Topic Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1"
              >
                <span>Reset Topic</span>
                <RotateCcw className="w-3 h-3" />
              </button>
            )}

            <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              {['all', 'easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    difficultyFilter === diff
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems List Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredProblems.map((p) => {
            const isPracticed = practicedMap[p.id];

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                  isPracticed
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(p.id)}
                    className={`shrink-0 transition-transform active:scale-90 ${
                      isPracticed
                        ? 'text-emerald-500 hover:text-emerald-600'
                        : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                    }`}
                    title={isPracticed ? 'Mark as unsolved' : 'Mark as practiced'}
                  >
                    {isPracticed ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-normal">
                        #{p.id}
                      </span>
                      <h5
                        className={`text-sm font-bold truncate ${
                          isPracticed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {p.title}
                      </h5>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {p.categoryName}
                      </span>
                      <span>•</span>
                      <span>{p.concept}</span>
                      <span>•</span>
                      <span>Acceptance: {p.acceptance}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                      p.difficulty
                    )}`}
                  >
                    {p.difficulty}
                  </span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:text-slate-300 dark:hover:text-indigo-300 transition-colors"
                    title="Open on LeetCode"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
