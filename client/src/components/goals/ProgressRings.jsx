import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

function ProgressRing({ progress, size = 80, strokeWidth = 6, color = '#F97316', label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(1, progress) * circumference);
  const pct = Math.round(progress * 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">{sublabel}</p>
      </div>
    </div>
  );
}

function ProgressRings({ ringProgress }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Goal Progress</h3>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Today</p>
            <div className="flex justify-around">
              <ProgressRing progress={ringProgress.daily.commits} color="#F97316" label="Commits" sublabel="Daily" />
              <ProgressRing progress={ringProgress.daily.problems} color="#10b981" label="Problems" sublabel="Daily" />
              <ProgressRing progress={ringProgress.daily.hours} color="#FB923C" label="Hours" sublabel="Daily" />
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">This Week</p>
            <div className="flex justify-around">
              <ProgressRing progress={ringProgress.weekly.commits} color="#F97316" label="Commits" sublabel="Weekly" size={70} strokeWidth={5} />
              <ProgressRing progress={ringProgress.weekly.problems} color="#10b981" label="Problems" sublabel="Weekly" size={70} strokeWidth={5} />
              <ProgressRing progress={ringProgress.weekly.hours} color="#FB923C" label="Hours" sublabel="Weekly" size={70} strokeWidth={5} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(ProgressRings);
