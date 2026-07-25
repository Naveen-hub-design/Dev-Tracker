import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../ui/ChartCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          Projects: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function TechStackChart({ projects }) {
  const chartData = useMemo(() => {
    if (!projects?.length) return [];
    const counts = {};
    projects.forEach((p) => {
      p.techStack?.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [projects]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <ChartCard title="Technology Usage" subtitle="Most used technologies across projects">
        <div className="h-[280px] flex items-center" role="img" aria-label="Technology usage pie chart">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(val) => <span className="text-slate-600">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center w-full">No technology data</p>
          )}
        </div>
      </ChartCard>
    </motion.div>
  );
}

export default React.memo(TechStackChart);
