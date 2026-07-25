import React, { useMemo } from 'react';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          {entry.name}: <span className="font-medium text-slate-900">{entry.value}%</span>
        </p>
      ))}
    </div>
  );
}

function LanguageChart({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data?.languages?.length) return [];
    return data.languages
      .slice(0, 8)
      .map((lang) => ({
        name: lang.name,
        percentage: lang.percentage || 0,
      }));
  }, [data]);

  if (loading) {
    return (
      <ChartCard title="Language Distribution" subtitle="Usage breakdown">
        <Skeleton className="w-full" style={{ height: 240 }} />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Language Distribution" subtitle="Usage breakdown">
      <div className="h-[240px]" role="img" aria-label="Language distribution bar chart">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="percentage" name="Usage" radius={[0, 4, 4, 0]} barSize={18} animationDuration={800}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">No language data</p>
        )}
      </div>
    </ChartCard>
  );
}

export default React.memo(LanguageChart);
