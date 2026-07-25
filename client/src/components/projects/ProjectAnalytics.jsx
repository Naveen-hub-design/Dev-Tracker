import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../ui/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          Repositories: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function ProjectAnalytics({ projects }) {
  const langData = useMemo(() => {
    if (!projects?.length) return [];
    const counts = {};
    projects.forEach((p) => {
      p.techStack?.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name: name.length > 10 ? name.slice(0, 8) + '…' : name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [projects]);

  const statusData = useMemo(() => {
    if (!projects?.length) return [];
    const counts = {};
    projects.forEach((p) => {
      const s = p.status?.replace('_', ' ') || 'unknown';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <ChartCard title="Framework Usage" subtitle="Technologies used across projects">
        <div className="h-[280px]" role="img" aria-label="Framework usage bar chart">
          {langData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Projects" radius={[0, 6, 6, 0]} barSize={18} animationDuration={1000}>
                  {langData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-16">No data</p>
          )}
        </div>
      </ChartCard>
    </motion.div>
  );
}

export default React.memo(ProjectAnalytics);
