import ChartCard from '../ui/ChartCard';
import Card from '../ui/Card';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const DIFF_COLORS = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Skeleton className="h-6 w-6 rounded-lg" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </div>
      </div>
    </div>
  );
}

export default function LeetCodeAnalytics({ data, loading }) {
  if (loading) return <SectionSkeleton />;

  const lc = data?.leetcode || {};
  const easy = lc.easy || 0;
  const medium = lc.medium || 0;
  const hard = lc.hard || 0;
  const total = lc.solved || easy + medium + hard;

  const difficultyData = [
    { name: 'Easy', value: easy, fill: DIFF_COLORS.Easy },
    { name: 'Medium', value: medium, fill: DIFF_COLORS.Medium },
    { name: 'Hard', value: hard, fill: DIFF_COLORS.Hard },
  ];

  const weeklyProgress = data?.leetcode?._raw?.weeklyProgress || [8, 12, 10, 15, 9, 14, 11, 13];
  const weeklyData = weeklyProgress.map((v, i) => ({
    week: `W${i + 1}`,
    problems: v,
  }));

  const acceptanceRate = lc.acceptanceRate || (total > 0 ? Math.round((total / (total + 50)) * 100) : 0);
  const acceptanceData = [
    { name: 'Accepted', value: acceptanceRate },
    { name: 'Remaining', value: 100 - acceptanceRate },
  ];

  const topicData = (data?.leetcode?._raw?.topTopics || [
    { name: 'Arrays', solved: 42 },
    { name: 'Strings', solved: 38 },
    { name: 'Stack', solved: 35 },
    { name: 'DP', solved: 28 },
    { name: 'Trees', solved: 25 },
    { name: 'Graphs', solved: 19 },
  ]).map((t) => ({ topic: t.name, count: t.solved }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">LeetCode Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Solved by Difficulty" subtitle={`${total} problems total`}>
          <div className="h-[220px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {difficultyData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} problems`, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(val) => <span className="text-slate-600">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Acceptance Rate" subtitle={`${acceptanceRate}% correct`}>
          <div className="h-[220px] flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={acceptanceRate >= 70 ? '#10B981' : acceptanceRate >= 50 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(acceptanceRate / 100) * 314} 314`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{acceptanceRate}%</span>
                <span className="text-xs text-slate-500">Accuracy</span>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Topic Distribution" subtitle="Problems by topic">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="topic" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} width={60} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Solved" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Weekly Problems" subtitle="Problems solved per week">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="problems" name="Problems" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
