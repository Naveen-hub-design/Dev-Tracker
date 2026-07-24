import React, { useMemo } from 'react';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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

function TopicStrengthChart({ topics, loading }) {
  const chartData = useMemo(() => {
    if (!topics?.length) return [];
    return [...topics]
      .sort((a, b) => b.solved - a.solved)
      .map((t) => ({
        name: t.name.length > 14 ? t.name.slice(0, 12) + '...' : t.name,
        solved: t.solved,
      }));
  }, [topics]);

  if (loading) {
    return (
      <ChartCard title="Topic Strength" subtitle="Problems solved by topic">
        <Skeleton className="w-full" style={{ height: 240 }} />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Topic Strength" subtitle="Problems solved by topic">
      <div className="h-[240px]" role="img" aria-label="Topic strength bar chart">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} width={90} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="solved" name="Solved" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={18} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">No topic data</p>
        )}
      </div>
    </ChartCard>
  );
}

export default React.memo(TopicStrengthChart);
