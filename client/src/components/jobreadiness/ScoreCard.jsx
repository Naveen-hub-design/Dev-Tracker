import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function AnimatedNumber({ target, duration = 1200 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{value}</span>;
}

function ProgressRing({ score, size = 180, strokeWidth = 10, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorMap = {
    emerald: { stroke: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    blue: { stroke: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    amber: { stroke: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    slate: { stroke: '#64748b', bg: 'rgba(100,116,139,0.1)' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={c.bg} strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={c.stroke} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          <AnimatedNumber target={score} />
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">out of 100</span>
      </div>
    </div>
  );
}

export default function ScoreCard({ overallScore, placementLevel }) {
  const levelColors = {
    'Placement Ready': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Advanced': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Intermediate': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Beginner': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Overall Readiness</h3>
      <ProgressRing score={overallScore} color={placementLevel.color} />
      <div className="mt-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${levelColors[placementLevel.level] || levelColors.Beginner}`}>
          {placementLevel.level}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-[240px] leading-relaxed">
        {placementLevel.description}
      </p>
    </div>
  );
}
