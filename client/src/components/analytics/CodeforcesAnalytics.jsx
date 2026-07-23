import ChartCard from '../ui/ChartCard';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

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

function getRankColor(rating) {
  if (rating >= 2100) return '#EF4444';
  if (rating >= 1900) return '#F97316';
  if (rating >= 1600) return '#A855F7';
  if (rating >= 1400) return '#3B82F6';
  if (rating >= 1200) return '#10B981';
  return '#94A3B8';
}

export default function CodeforcesAnalytics({ data, cfHistory, loading }) {
  if (loading) return <SectionSkeleton />;

  const cf = data?.codeforces || {};
  const history = cfHistory || [];

  const rankBuckets = [
    { rank: 'Newbie', min: 0, max: 1199, count: 0 },
    { rank: 'Pupil', min: 1200, max: 1399, count: 0 },
    { rank: 'Specialist', min: 1400, max: 1599, count: 0 },
    { rank: 'Expert', min: 1600, max: 1899, count: 0 },
    { rank: 'Candidate Master', min: 1900, max: 2099, count: 0 },
    { rank: 'Master', min: 2100, max: 9999, count: 0 },
  ];

  history.forEach((h) => {
    const bucket = rankBuckets.find((b) => h.rating >= b.min && h.rating <= b.max);
    if (bucket) bucket.count++;
  });

  const currentRank = rankBuckets.find((b) => (cf.rating || 0) >= b.min && (cf.rating || 0) <= b.max);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Codeforces Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Rating History"
          subtitle={`Current: ${cf.rating || 0} (${currentRank?.rank || 'Unrated'})`}
        >
          <div className="h-[220px]">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="contest" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={1200} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Pupil', position: 'right', fontSize: 10, fill: '#10B981' }} />
                  <ReferenceLine y={1400} stroke="#3B82F6" strokeDasharray="3 3" label={{ value: 'Specialist', position: 'right', fontSize: 10, fill: '#3B82F6' }} />
                  <Line type="monotone" dataKey="rating" name="Rating" stroke={getRankColor(cf.rating || 0)} strokeWidth={2.5} dot={{ r: 3, fill: getRankColor(cf.rating || 0) }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No contest history available
              </div>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Contest Performance" subtitle={`${cf.contests || 0} contests participated`}>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankBuckets.filter((b) => b.count > 0)} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="rank" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Contests" fill="#F97316" radius={[4, 4, 0, 0]}>
                  {rankBuckets.filter((b) => b.count > 0).map((entry, i) => (
                    <Cell key={i} fill={getRankColor(entry.min)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Rank Distribution" subtitle="Rating distribution across contests" className="md:col-span-2">
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankBuckets} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="rank" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Contests" radius={[4, 4, 0, 0]}>
                  {rankBuckets.map((entry, i) => (
                    <Cell key={i} fill={entry.rank === currentRank?.rank ? getRankColor(entry.min) : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
