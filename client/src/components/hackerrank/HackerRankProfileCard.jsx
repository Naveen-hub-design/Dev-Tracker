import Card from '../ui/Card';
import StatBadge from '../ui/StatBadge';

export default function HackerRankProfileCard({ data }) {
  if (!data) return null;

  return (
    <Card>
      <div className="flex items-center gap-4">
        {data.avatar ? (
          <img
            src={data.avatar}
            alt={data.username}
            className="w-14 h-14 rounded-full border-2 border-slate-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-green-600">
              {data.username?.charAt(0)?.toUpperCase() || 'H'}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900 truncate">
            {data.username}
          </h2>
          {data.name && data.name !== data.username && (
            <p className="text-xs text-slate-500 truncate">{data.name}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <StatBadge label={`${data.totalSolved} solved`} color="blue" dot />
            <StatBadge
              label={data.hackerBadge}
              color={
                ['DIAMOND', 'PLATINUM'].includes(data.hackerBadge)
                  ? 'purple'
                  : data.hackerBadge === 'GOLD'
                  ? 'amber'
                  : 'slate'
              }
              dot
            />
            {data.country && (
              <StatBadge label={data.country} color="slate" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
