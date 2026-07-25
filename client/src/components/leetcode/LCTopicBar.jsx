import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

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

function LCTopicBar({ topics, loading }) {
  const chartData = useMemo(() => {
    if (!topics?.length) return [];
    return [...topics]
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 8)
      .map((t) => ({
        name: t.name.length > 14 ? t.name.slice(0, 12) + '…' : t.name,
        solved: t.solved,
      }));
  }, [topics]);

  if (loading) {
    return (
      <ChartCard title="Topic Strength" subtitle="Problems solved by topic">
        <Skeleton className="w-full" style={{ height: 260 }} />
      </ChartCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
      <ChartCard title="Topic Strength" subtitle="Problems solved by topic">
        <div className="h-[260px]" role="img" aria-label="Topic strength bar chart">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} width={90} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="solved" name="Solved" radius={[0, 6, 6, 0]} barSize={20} animationDuration={1000}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-16">No topic data</p>
          )}
        </div>
      </ChartCard>
    </motion.div>
  );
}

export default React.memo(LCTopicBar);
