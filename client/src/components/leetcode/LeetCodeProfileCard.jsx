import Card from '../ui/Card';
import StatBadge from '../ui/StatBadge';

export default function LeetCodeProfileCard({ data }) {
  if (!data) return null;

  const hardPct = data.total > 0 ? Math.round((data.hard / data.total) * 100) : 0;

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-amber-600">
            {data.username?.charAt(0)?.toUpperCase() || 'L'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900 truncate">{data.username}</h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <StatBadge label={`${data.total} solved`} color="blue" dot />
            <StatBadge label={`${hardPct}% hard`} color="red" dot />
            <StatBadge label={`${data.topics?.length || 0} topics`} color="purple" dot />
          </div>
        </div>
      </div>
    </Card>
  );
}
