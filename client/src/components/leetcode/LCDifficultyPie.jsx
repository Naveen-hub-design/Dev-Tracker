import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          {entry.name}: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function LCDifficultyPie({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Easy', value: data.easy || 0 },
      { name: 'Medium', value: data.medium || 0 },
      { name: 'Hard', value: data.hard || 0 },
    ].filter((d) => d.value > 0);
  }, [data]);

  if (loading) {
    return (
      <ChartCard title="Difficulty Breakdown" subtitle="Problem distribution">
        <Skeleton className="w-full" style={{ height: 260 }} />
      </ChartCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <ChartCard title="Difficulty Breakdown" subtitle="Problem distribution by difficulty">
        <div className="h-[260px] flex items-center" role="img" aria-label="Difficulty breakdown pie chart">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} problems`, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(val) => <span className="text-slate-600">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center w-full">No difficulty data</p>
          )}
        </div>
      </ChartCard>
    </motion.div>
  );
}

export default React.memo(LCDifficultyPie);
