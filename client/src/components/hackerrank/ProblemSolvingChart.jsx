import React, { useMemo } from 'react';
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

function ProblemSolvingChart({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data?.languages?.length) return [];
    return data.languages.map((lang) => ({
      name: lang.name.length > 12 ? lang.name.slice(0, 10) + '...' : lang.name,
      solved: lang.count || 0,
    }));
  }, [data]);

  if (loading) {
    return (
      <ChartCard title="Problems by Language" subtitle="Challenge distribution">
        <Skeleton className="w-full" style={{ height: 240 }} />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Problems by Language" subtitle="Challenge distribution">
      <div className="h-[240px]" role="img" aria-label="Problems solved by language area chart">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="hrTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="solved" name="Solved" stroke="#10B981" fill="url(#hrTrendGrad)" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} activeDot={{ r: 5 }} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">No language data</p>
        )}
      </div>
    </ChartCard>
  );
}

export default React.memo(ProblemSolvingChart);
