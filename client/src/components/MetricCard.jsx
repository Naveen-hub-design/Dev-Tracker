import { getScoreColor } from '../utils/helpers';

export default function MetricCard({ label, value, icon: Icon, color = 'text-blue-500', badge, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-20 mb-2" />
        <div className="skeleton h-8 w-16 mb-2" />
        <div className="skeleton h-4 w-24" />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">{label}</p>
          <p className={`metric-value mt-1 ${getScoreColor(value)}`}>{value}</p>
        </div>
        {Icon && <Icon className={`w-8 h-8 ${color} opacity-80`} />}
      </div>
      {badge && (
        <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.text}
        </span>
      )}
    </div>
  );
}
