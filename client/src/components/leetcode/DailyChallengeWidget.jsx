import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  CheckCircle2,
  Circle,
  ExternalLink,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Calendar,
  Layers,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';

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

export default function DailyChallengeWidget({ compact = false }) {
  const { problem, streak, loading, toggling, error, toggleSolve, refetch } = useDailyChallenge();
  const [showHints, setShowHints] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-7 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    );
  }

  if (error || !problem) {
    return null;
  }

  const { solvedToday, currentStreak, longestStreak, totalSolved, last14Days } = streak;
  const diffClass = getDifficultyBadge(problem.difficulty);

  const handleToggle = async () => {
    try {
      await toggleSolve(notes);
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 dark:border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-white to-orange-500/5 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/20 p-5 md:p-6 shadow-sm">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            LeetCode Daily Challenge
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {problem.date}
          </span>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-transform ${
              currentStreak > 0
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'fill-current animate-bounce' : ''}`} />
            <span>{currentStreak} Day{currentStreak !== 1 ? 's' : ''} Streak</span>
          </div>
          {longestStreak > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Trophy className="w-3 h-3 text-amber-500" />
              Best: {longestStreak}d
            </span>
          )}
        </div>
      </div>

      {/* Main Problem Information */}
      <div className="relative z-10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diffClass}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Acceptance: {problem.acRate}
              </span>
              <span className="text-xs text-slate-400">
                • {problem.totalAccepted} solved
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-sm font-normal">
                #{problem.problemId}
              </span>
              <span>{problem.title}</span>
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
            >
              Solve on LeetCode
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                solvedToday
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
              }`}
            >
              {toggling ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : solvedToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Solved Today!</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Mark as Solved</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Topic Tags */}
        {problem.topicTags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {problem.topicTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 14-Day Interactive Streak Timeline Strip */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              14-Day Streak Matrix
            </span>
            <span className="text-[11px] text-slate-400">
              {totalSolved} challenge{totalSolved !== 1 ? 's' : ''} completed
            </span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
            {last14Days.map((day) => (
              <div
                key={day.date}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-center transition-all ${
                  day.solved
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : day.isToday
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500'
                }`}
                title={`${day.date}: ${day.solved ? 'Solved' : 'Unsolved'}`}
              >
                <span className="text-[9px] font-medium uppercase">{day.dayName}</span>
                <span className="text-xs font-bold mt-0.5">{day.dayNum}</span>
                <div className="mt-1">
                  {day.solved ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hints Expandable Accordion */}
        {problem.hints?.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHints ? 'Hide Hints' : `Show Hints (${problem.hints.length})`}</span>
              {showHints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2 overflow-hidden"
                >
                  {problem.hints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-200"
                    >
                      <strong className="font-semibold mr-1">Hint {idx + 1}:</strong>
                      {hint}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
