import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

const LEVELS = [
  { bg: '#232936', label: 'No activity' },
  { bg: '#FED7AA', label: '1-2' },
  { bg: '#FB923C', label: '3-4' },
  { bg: '#F97316', label: '5-6' },
  { bg: '#EA580C', label: '7+' },
];

function Heatmap({ data }) {
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Activity Heatmap</h3>
          <div className="flex items-center gap-1">
            {LEVELS.map((l, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.bg }} title={l.label} />
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px] min-w-[720px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <motion.div
                    key={day.date}
                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-slate-300 transition-all"
                    style={{ backgroundColor: LEVELS[day.level].bg }}
                    title={`${day.date}: ${day.count} activities`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.001, duration: 0.15 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
          <span>Less</span>
          <span>More</span>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(Heatmap);
