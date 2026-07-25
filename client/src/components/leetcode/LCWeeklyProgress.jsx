import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          Solved: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function LCWeeklyProgress({ weeklyProgress, loading }) {
  const chartData = useMemo(() => {
    if (!weeklyProgress?.length) return [];
    return weeklyProgress.map((count, i) => ({
      week: `W${i + 1}`,
      solved: count,
    }));
  }, [weeklyProgress]);

  if (loading) {
    return (
      <ChartCard title="Weekly Progress" subtitle="Problems solved per week">
        <Skeleton className="w-full" style={{ height: 260 }} />
      </ChartCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <ChartCard title="Weekly Progress" subtitle="Problems solved per week">
        <div className="h-[260px]" role="img" aria-label="Weekly progress area chart">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="lcWeekGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="solved" name="Solved" stroke="#3B82F6" fill="url(#lcWeekGrad)" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 3 }} activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-16">No weekly data</p>
          )}
        </div>
      </ChartCard>
    </motion.div>
  );
}

export default React.memo(LCWeeklyProgress);
