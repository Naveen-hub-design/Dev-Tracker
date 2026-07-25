import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function SkillRadarChart({ data }) {
  const chartData = useMemo(() => {
    return (data || []).map((d) => ({
      ...d,
      fullMark: 100,
    }));
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Skill Radar</h3>
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: 'currentColor', className: 'text-slate-500 dark:text-slate-400' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: 'currentColor', className: 'text-slate-400 dark:text-slate-500' }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(15 23 42)',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#e2e8f0',
              }}
              formatter={(value) => [`${value}/100`, 'Score']}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
