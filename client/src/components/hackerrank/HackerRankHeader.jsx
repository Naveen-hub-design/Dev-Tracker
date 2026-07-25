import { Shield, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export default function HackerRankHeader({ username, onRefresh, loading }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-green-600 text-white">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">HackerRank Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {username ? `@${username} — coding certifications and skills` : 'Track your HackerRank progress'}
          </p>
        </div>
      </div>
      {username && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          loading={loading}
          aria-label="Refresh HackerRank data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      )}
    </div>
  );
}
