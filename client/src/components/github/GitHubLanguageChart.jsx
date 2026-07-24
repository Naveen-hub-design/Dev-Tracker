import React, { useMemo } from 'react';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

function GitHubLanguageChart({ languages, loading }) {
  const langData = useMemo(() => {
    if (!languages) return [];
    return Object.entries(languages)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [languages]);

  if (loading) {
    return (
      <ChartCard title="Languages" subtitle="Usage distribution">
        <Skeleton className="w-full" style={{ height: 220 }} />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Languages" subtitle="Usage distribution">
      <div className="h-[220px] flex items-center">
        {langData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={langData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {langData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`${val}%`, 'Usage']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
                formatter={(val) => <span className="text-slate-600">{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center w-full">No language data</p>
        )}
      </div>
    </ChartCard>
  );
}

export default React.memo(GitHubLanguageChart);
