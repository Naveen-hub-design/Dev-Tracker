import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import { Target, RefreshCw } from 'lucide-react';

const getRingColor = (score) => {
  if (score >= 70) return '#10B981';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
};

const getGradient = (score) => {
  if (score >= 70) return 'from-emerald-500 to-teal-500';
  if (score >= 40) return 'from-amber-500 to-orange-500';
  return 'from-red-500 to-rose-500';
};

const getLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Developing';
  return 'Getting Started';
};

function JobMatchHero({ jobMatch, loading }) {
  const score = jobMatch?.totalScore || 0;
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getRingColor(score);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAyMGgyMjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
      <div className="relative flex flex-col lg:flex-row items-center gap-8">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums">
              <AnimatedNumber value={score} duration={1200} />
            </span>
            <span className="text-xs text-slate-300 mt-1">{getLabel(score)}</span>
          </div>
        </div>
        <div className="text-center lg:text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Job Readiness Score</h1>
              <p className="text-sm text-slate-300">How ready you are for your dream role</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-4 max-w-md">
            Based on your GitHub contributions, LeetCode performance, project diversity, and coding consistency.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 justify-center lg:justify-start">
            <div className="text-center">
              <p className="text-2xl font-bold">{jobMatch?.breakdown?.leetcodeSolved || 0}</p>
              <p className="text-[11px] text-slate-400">LC Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{(jobMatch?.breakdown?.githubRepos || 0) + (jobMatch?.breakdown?.githubCommits || 0)}</p>
              <p className="text-[11px] text-slate-400">GitHub Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{jobMatch?.breakdown?.projects || 0}</p>
              <p className="text-[11px] text-slate-400">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{jobMatch?.breakdown?.streak || 0}</p>
              <p className="text-[11px] text-slate-400">Streak</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(JobMatchHero);
