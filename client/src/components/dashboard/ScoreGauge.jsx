import Card from '../ui/Card';
import StatBadge from '../ui/StatBadge';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Target } from 'lucide-react';

function ScoreSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-28 mb-4" />
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-5 w-full rounded" />
          ))}
        </div>
      </div>
    </Card>
  );
}

function getScoreColor(score) {
  if (score >= 70) return { stroke: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600' };
  if (score >= 40) return { stroke: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-600' };
  return { stroke: '#EF4444', bg: 'bg-red-50', text: 'text-red-600' };
}

function ScoreRing({ score, color }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="7" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-slate-900">{score}</span>
      </div>
    </div>
  );
}

export default function ScoreGauge({ score = 0, companyReadiness = [], loading, empty }) {
  if (loading) return <ScoreSkeleton />;

  if (empty) {
    return (
      <Card>
        <EmptyState
          icon={Target}
          title="No job match data"
          description="Connect your accounts to calculate your job readiness score."
        />
      </Card>
    );
  }

  const colors = getScoreColor(score);
  const topCompanies = companyReadiness.slice(0, 4);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Job Match Score</h3>
      <div className="flex items-center gap-6">
        <ScoreRing score={score} color={colors.stroke} />
        <div className="flex-1 space-y-2">
          {topCompanies.map((c) => (
            <div key={c.company} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{c.company}</span>
              <StatBadge
                label={c.status}
                color={
                  c.status === 'Ready' ? 'emerald' :
                  c.status === 'Almost' ? 'amber' : 'red'
                }
                dot
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
