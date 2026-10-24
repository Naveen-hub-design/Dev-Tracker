import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Code2,
  Flame,
  Award,
  Zap,
} from 'lucide-react';

const CLI_TABS = [
  {
    id: 'sync',
    label: 'devtrack sync',
    command: 'devtrack sync --platforms=all',
    lines: [
      { text: '→ Initializing DevTrack multi-platform adapter v2.4.0...', color: 'text-slate-400' },
      { text: '✔ Connected to GitHub REST API (@johndoe) — 24 repos, 1,420 commits', color: 'text-emerald-400' },
      { text: '✔ Synced LeetCode GraphQL — 480 solved (Top 8.4% globally)', color: 'text-cyan-400' },
      { text: '✔ Codeforces Rating verified — 1642 (Division 2 Expert)', color: 'text-blue-400' },
      { text: '✔ HackerRank badges parsed — Problem Solving (5★)', color: 'text-amber-400' },
      { text: '★ Overall Developer Score calculated: 885 / 1000 (Top 2%)', color: 'text-emerald-300 font-semibold' },
    ],
  },
  {
    id: 'ats',
    label: 'ats-readiness',
    command: 'devtrack placement-match --role="SDE-2 FullStack"',
    lines: [
      { text: '→ Analyzing 48 technical skills against Tier-1 FAANG rubric...', color: 'text-slate-400' },
      { text: '✔ Data Structures & Algorithms: 94% (Hard/Medium mastery verified)', color: 'text-emerald-400' },
      { text: '✔ System Design & Architecture: 88% (Microservices, Redis, SQLite)', color: 'text-cyan-400' },
      { text: '✔ Production Git Cadence: 96% (Daily streaks, PR reviews)', color: 'text-purple-400' },
      { text: '★ Hiring Probability: HIGH — Qualified for Senior Placement Tiers', color: 'text-emerald-300 font-semibold' },
    ],
  },
  {
    id: 'ai',
    label: 'ai-reviewer',
    command: 'devtrack ai-review --file=DynamicProgramming.cpp',
    lines: [
      { text: '→ Sending AST to DevTrack Gemini 2.0 Flash Code Reviewer...', color: 'text-slate-400' },
      { text: '✔ Time Complexity: O(N) linear scan with memoization cache', color: 'text-emerald-400' },
      { text: '✔ Space Complexity: O(N) optimized with state compression', color: 'text-cyan-400' },
      { text: '✔ Security & Edge Cases: 0 buffer overflows · Zero memory leaks', color: 'text-emerald-400' },
      { text: '★ Clean Code Score: 98/100 — Production Grade Implementation', color: 'text-emerald-300 font-semibold' },
    ],
  },
];

const PLATFORMS = [
  { name: 'GitHub', metric: '1,420 Commits', status: 'Live Sync', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { name: 'LeetCode', metric: '480 Solved', status: 'Top 8.4%', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { name: 'Codeforces', metric: '1642 Expert', status: 'Div 2', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { name: 'HackerRank', metric: '5-Star Gold', status: 'Verified', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
];

export default function DeveloperShowcasePanel() {
  const [activeTab, setActiveTab] = useState('sync');
  const currentTab = CLI_TABS.find((t) => t.id === activeTab) || CLI_TABS[0];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Header / Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/25 border border-white/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">DevTrack</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300">
                v2.4 Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Developer Analytics & Career Intelligence</p>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight mb-3"
        >
          One Command Center for Your{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-primary-300 to-purple-400 bg-clip-text text-transparent">
            Engineering Career.
          </span>
        </motion.h1>

        <p className="text-sm text-slate-400 leading-relaxed max-w-lg mb-6">
          Unify your GitHub commits, LeetCode ratings, Codeforces contests, and HackerRank badges.
          Simulate AI technical interviews and track your job applications all in one place.
        </p>

        {/* Live Platform Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className={`px-3 py-2 rounded-xl border backdrop-blur-md ${p.color} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between text-[11px] font-medium opacity-80 mb-0.5">
                <span>{p.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              </div>
              <div className="text-xs font-bold text-white font-mono">{p.metric}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{p.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Interactive Terminal Showcase */}
      <div className="relative z-10 my-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Terminal Window Chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[11px] font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-primary-400" />
                bash ~ devtrack-cli
              </span>
            </div>

            {/* CLI Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-white/5">
              {CLI_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600/30 text-primary-300 font-semibold border border-primary-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 font-mono text-xs space-y-2 bg-slate-950/90 min-h-[160px]">
            <div className="flex items-center gap-2 text-slate-300 pb-1 border-b border-white/5">
              <span className="text-emerald-400 font-bold">$</span>
              <span className="text-cyan-300">{currentTab.command}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5 pt-1"
              >
                {currentTab.lines.map((line, idx) => (
                  <div key={idx} className={`${line.color} flex items-start gap-2 leading-relaxed text-[11px]`}>
                    <span>{line.text}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Social Proof & Live Status */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2 overflow-hidden">
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-primary-500 to-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
              JD
            </span>
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-600 text-[10px] font-bold text-white flex items-center justify-center">
              AK
            </span>
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-purple-500 to-pink-600 text-[10px] font-bold text-white flex items-center justify-center">
              SR
            </span>
          </div>
          <span className="text-slate-300 font-medium">
            Trusted by developers tracking placements at FAANG & top tech
          </span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] text-emerald-300 font-mono font-medium">
            System 100% Operational
          </span>
        </div>
      </div>
    </div>
  );
}
