import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Send,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layout,
  Server,
  Layers,
  Code2,
  Cpu,
  Users,
  Trophy,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { useMockInterview } from '../../hooks/useMockInterview';
import Button from '../ui/Button';

const ROLE_OPTIONS = [
  { id: 'frontend', label: 'Frontend Engineer', icon: Layout, desc: 'React, DOM, Web Performance & State Architecture', color: 'from-blue-500 to-cyan-500' },
  { id: 'backend', label: 'Backend Engineer', icon: Server, desc: 'Node.js, Databases, ACID, Rate Limiting & Auth', color: 'from-emerald-500 to-teal-500' },
  { id: 'fullstack', label: 'Full Stack Engineer', icon: Layers, desc: 'End-to-End Request Lifecycle, WebSockets & Security', color: 'from-indigo-500 to-purple-500' },
  { id: 'dsa', label: 'Data Structures & Algorithms', icon: Code2, desc: 'Graphs, Sliding Window, DP, Tries & Complexity', color: 'from-amber-500 to-orange-500' },
  { id: 'system_design', label: 'System Design', icon: Cpu, desc: 'Distributed Caching, URL Shortener, Chat & Sharding', color: 'from-rose-500 to-pink-500' },
  { id: 'behavioral', label: 'Behavioral & Leadership', icon: Users, desc: 'STAR Method, Conflict Resolution & Tech Debt', color: 'from-violet-500 to-indigo-500' },
];

const LEVEL_OPTIONS = [
  { id: 'junior', label: 'Junior / SDE-1', exp: '0–2 yrs' },
  { id: 'mid', label: 'Mid-Level / SDE-2', exp: '2–5 yrs' },
  { id: 'senior', label: 'Senior / Lead', exp: '5+ yrs' },
];

export default function MockInterviewSimulator() {
  const {
    stage,
    role,
    level,
    setRole,
    setLevel,
    questionData,
    candidateAnswer,
    setCandidateAnswer,
    isEvaluating,
    currentEvaluation,
    exchanges,
    finalReport,
    error,
    start,
    submitAnswer,
    proceedToNext,
    reset,
  } = useMockInterview();

  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Setup Stage
  if (stage === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 py-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI Interview Simulator
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Practice Real FAANG Technical Interviews
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Experience realistic 5-question technical rounds with instant AI evaluation, scorecards, feedback rubrics, and ideal model answers.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Role Selector Grid */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Select Target Engineering Domain
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = role === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setRole(opt.id)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                    active
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-white shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{opt.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            2. Select Experience Tier
          </label>
          <div className="grid grid-cols-3 gap-3">
            {LEVEL_OPTIONS.map((lvl) => {
              const active = level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    active
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20 font-bold text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-sm font-semibold">{lvl.label}</p>
                  <p className="text-[11px] text-slate-400">{lvl.exp}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => start(role, level)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Begin Mock Interview Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Interview Live Room
  if (stage === 'interview') {
    const qNum = questionData?.questionNumber || 1;
    const totalQ = questionData?.totalQuestions || 5;
    const progressPercent = ((qNum - 1) / totalQ) * 100;
    const wordCount = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress Header */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              Q{qNum}
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {role.toUpperCase()} • {level.toUpperCase()}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{questionData?.topic}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Question {qNum} of {totalQ}
              </span>
              <div className="w-28 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((qNum) / totalQ) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={reset}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
              title="Exit Interview"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Prompt Card */}
        <div className="p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-white to-purple-500/5 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Interviewer Prompt
              </span>
              <p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {questionData?.question}
              </p>
            </div>
          </div>
        </div>

        {/* If Answer Not Yet Evaluated: Answer Input Box */}
        {!currentEvaluation && (
          <div className="space-y-4">
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
              <textarea
                rows={6}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Structure your response clearly. Mention key algorithms, runtime trade-offs, and edge cases..."
                className="w-full p-4 text-sm text-slate-800 dark:text-slate-200 bg-transparent border-none focus:outline-none resize-none leading-relaxed"
              />
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
                <span>{wordCount} words {wordCount < 40 ? '(aim for 50+ words)' : '✓ good length'}</span>
                <span>Press Submit when finished</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Tip: Use STAR structure for behavioral; mention Time/Space complexity for technical.
              </span>
              <button
                onClick={() => submitAnswer(candidateAnswer)}
                disabled={isEvaluating || wordCount < 5}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                {isEvaluating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Evaluating Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* If Evaluated: Evaluation Rubric & Model Answer */}
        {currentEvaluation && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Scorecard Dials */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Evaluation Scorecard
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Overall Score: {currentEvaluation.overallScore}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400 font-medium">Technical Accuracy</span>
                  <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {currentEvaluation.accuracyScore} / 10
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400 font-medium">Depth & Reasoning</span>
                  <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                    {currentEvaluation.depthScore} / 10
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400 font-medium">Communication Clarity</span>
                  <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
                    {currentEvaluation.clarityScore} / 10
                  </p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> What was strong:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {currentEvaluation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Room for growth:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {currentEvaluation.improvements.map((im, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{im}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reveal Ideal Model Answer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showModelAnswer ? 'Hide Model Answer' : 'Reveal FAANG Ideal Model Answer'}</span>
                  {showModelAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showModelAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono"
                  >
                    {currentEvaluation.modelAnswer}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Next Action Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={proceedToNext}
                disabled={isEvaluating}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <span>{qNum >= 5 ? 'View Final Assessment Report' : `Proceed to Question ${qNum + 1}`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Stage 3: Final Assessment Report
  if (stage === 'report' && finalReport) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero Final Score Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-300 border border-white/20">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Interview Completed
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Assessment: {finalReport.decision}
            </h2>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/40 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md shadow-inner">
                <span className="text-3xl font-black text-indigo-400 font-mono">
                  {finalReport.averageScore}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Average</span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-300">
              Candidate completed all 5 technical interview questions in <strong>{role.toUpperCase()}</strong> at the <strong>{level.toUpperCase()}</strong> tier.
            </p>
          </div>
        </div>

        {/* Strengths & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
            </span>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {finalReport.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Next Steps & Practice Areas
            </span>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {finalReport.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Review */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Question-by-Question Breakdown
          </h3>

          <div className="space-y-3">
            {exchanges.map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Question {idx + 1} • {ex.topic}
                  </span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                    {ex.question}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                    {ex.evaluation?.overallScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Interview</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
