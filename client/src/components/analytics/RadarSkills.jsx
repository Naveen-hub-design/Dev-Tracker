import Card from '../ui/Card';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

function RadarSkeleton() {
  return (
    <Card>
      <Skeleton className="h-5 w-36 mb-4" />
      <Skeleton className="h-[280px] w-full rounded-lg" />
    </Card>
  );
}

export default function RadarSkills({ skills = [], loading }) {
  if (loading) return <RadarSkeleton />;

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Developer Skills</h3>
      <p className="text-xs text-slate-500 mb-4">Skill distribution across domains</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: '#94A3B8' }}
              tickCount={5}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(val) => [`${val}%`, 'Skill Level']}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
