import React, { useMemo } from 'react';
import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

function BadgeBreakdown({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data?.problemsSolved) return [];
    const { easy, medium, hard } = data.problemsSolved;
    return [
      { name: 'Easy', value: easy || 0 },
      { name: 'Medium', value: medium || 0 },
      { name: 'Hard', value: hard || 0 },
    ].filter((d) => d.value > 0);
  }, [data]);

  if (loading) {
    return (
      <ChartCard title="Problem Breakdown" subtitle="Solved by difficulty">
        <Skeleton className="w-full" style={{ height: 240 }} />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Problem Breakdown" subtitle="Solved by difficulty">
      <div className="h-[240px] flex items-center" role="img" aria-label="Problem breakdown pie chart">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val} problems`, name]}
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
          <p className="text-sm text-slate-400 text-center w-full">No difficulty data</p>
        )}
      </div>
    </ChartCard>
  );
}

export default React.memo(BadgeBreakdown);
