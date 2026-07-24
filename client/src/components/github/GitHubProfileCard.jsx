import Card from '../ui/Card';
import StatBadge from '../ui/StatBadge';

export default function GitHubProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <Card>
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar}
          alt={profile.username}
          className="w-14 h-14 rounded-full border-2 border-slate-200"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900 truncate">
            {profile.username}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <StatBadge label={`${profile.public_repos} repos`} color="blue" dot />
            <StatBadge label={`${profile.followers} followers`} color="purple" dot />
          </div>
        </div>
      </div>
    </Card>
  );
}
