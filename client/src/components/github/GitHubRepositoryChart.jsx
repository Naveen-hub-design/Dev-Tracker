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
          Stars: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function GitHubRepositoryChart({ repos, loading }) {
  const chartData = useMemo(() => {
    if (!repos?.length) return [];
    return [...repos]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 5)
      .map((r) => ({ name: r.name.length > 16 ? r.name.slice(0, 14) + '...' : r.name, stars: r.stars || 0 }));
  }, [repos]);

  if (loading) {
    return (
      <ChartCard title="Top Repositories" subtitle="By stars">
        <Skeleton className="w-full" style={{ height: 220 }} />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Top Repositories" subtitle="By stars">
      <div className="h-[220px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="stars" name="Stars" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">No repository data</p>
        )}
      </div>
    </ChartCard>
  );
}

export default React.memo(GitHubRepositoryChart);
