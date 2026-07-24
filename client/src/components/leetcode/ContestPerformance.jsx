import React, { useMemo } from 'react';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          Problems: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function ContestPerformance({ weeklyProgress, loading }) {
  const chartData = useMemo(() => {
    if (!weeklyProgress?.length) return [];
    let cumulative = 0;
    return weeklyProgress.map((count, i) => {
      cumulative += count;
      return { week: `W${i + 1}`, total: cumulative };
    });
  }, [weeklyProgress]);

  if (loading) {
    return (
      <ChartCard title="Cumulative Progress" subtitle="Total problems solved over time">
        <Skeleton className="w-full" style={{ height: 240 }} />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Cumulative Progress" subtitle="Total problems solved over time">
      <div className="h-[240px]" role="img" aria-label="Cumulative progress line chart">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="total" name="Total" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} activeDot={{ r: 5 }} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">No progress data</p>
        )}
      </div>
    </ChartCard>
  );
}

export default React.memo(ContestPerformance);
