import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../ui/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      <p className="text-slate-600">
        Commits: <span className="font-medium text-slate-900">{payload[0].value}</span>
      </p>
    </div>
  );
}

function CommitChart({ commitActivity }) {
  const chartData = useMemo(() => {
    if (!commitActivity?.length) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return commitActivity.slice(-12).map((count, i) => ({
      month: months[(new Date().getMonth() - (commitActivity.length - 1 - i) + 12) % 12],
      commits: count,
    }));
  }, [commitActivity]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <ChartCard title="Monthly Commits" subtitle="Commit activity over the past year">
        <div className="h-[280px]" role="img" aria-label="Monthly commit bar chart">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="commits" fill="url(#commitGrad)" radius={[6, 6, 0, 0]} barSize={28} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-16">No commit data</p>
          )}
        </div>
      </ChartCard>
    </motion.div>
  );
}

export default React.memo(CommitChart);
