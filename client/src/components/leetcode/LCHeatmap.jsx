import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';


function getCellColor(count) {
  if (count === 0) return 'bg-slate-50';
  if (count <= 2) return 'bg-emerald-100';
  if (count <= 4) return 'bg-emerald-200';
  if (count <= 7) return 'bg-emerald-400';
  return 'bg-emerald-600';
}

function LCHeatmap({ weeklyProgress, loading }) {
  const cells = useMemo(() => {
    if (!weeklyProgress?.length) return [];
    return weeklyProgress.map((count, i) => ({
      week: i + 1,
      count,
    }));
  }, [weeklyProgress]);

  const total = useMemo(() => {
    if (!weeklyProgress?.length) return 0;
    return weeklyProgress.reduce((a, b) => a + b, 0);
  }, [weeklyProgress]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Activity Heatmap" subtitle="Weekly problem-solving activity" />
          <span className="text-xs text-slate-500 font-medium">{total} total</span>
        </div>
        {cells.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {cells.map((cell) => (
                <div
                  key={cell.week}
                  className={`w-8 h-8 rounded-md ${getCellColor(cell.count)} transition-colors duration-200 hover:ring-2 hover:ring-amber-400 cursor-default`}
                  title={`Week ${cell.week}: ${cell.count} solved`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
              <span>Less</span>
              {[0, 1, 3, 5, 8].map((count) => (
                <div key={count} className={`w-3.5 h-3.5 rounded ${getCellColor(count)}`} />
              ))}
              <span>More</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">No activity data</p>
        )}
      </Card>
    </motion.div>
  );
}

export default React.memo(LCHeatmap);
