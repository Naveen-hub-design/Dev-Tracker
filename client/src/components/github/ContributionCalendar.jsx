import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';

function getCellColor(count) {
  if (count === 0) return 'bg-slate-50';
  if (count <= 3) return 'bg-emerald-100';
  if (count <= 7) return 'bg-emerald-200';
  if (count <= 15) return 'bg-emerald-400';
  return 'bg-emerald-600';
}

function ContributionCalendar({ commitActivity }) {
  const cells = useMemo(() => {
    if (!commitActivity?.length) return [];
    return commitActivity.slice(-180).map((count, i) => ({
      index: i,
      count,
    }));
  }, [commitActivity]);

  const total = useMemo(() => {
    if (!commitActivity?.length) return 0;
    return commitActivity.reduce((a, b) => a + b, 0);
  }, [commitActivity]);

  const activeDays = useMemo(() => cells.filter((c) => c.count > 0).length, [cells]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Contribution Calendar" subtitle="Daily activity over 6 months" />
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span><span className="font-bold text-slate-900">{activeDays}</span> active days</span>
            <span className="text-slate-300">|</span>
            <span><span className="font-bold text-slate-900">{total}</span> total commits</span>
          </div>
        </div>
        {cells.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1">
              {cells.map((cell) => (
                <div
                  key={cell.index}
                  className={`w-7 h-7 rounded-[5px] ${getCellColor(cell.count)} transition-all duration-150 hover:ring-2 hover:ring-amber-400 cursor-default`}
                  title={`${cell.count} commits`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
              <span>Less</span>
              {[0, 2, 5, 10, 16].map((count) => (
                <div key={count} className={`w-3.5 h-3.5 rounded ${getCellColor(count)}`} />
              ))}
              <span>More</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">No contribution data</p>
        )}
      </Card>
    </motion.div>
  );
}

export default React.memo(ContributionCalendar);
