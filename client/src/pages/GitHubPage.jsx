import { useGitHub } from '../hooks/useGitHub';
import { useUser } from '../context/UserContext';
import { demoGitHub } from '../api/github';
import MetricCard from '../components/MetricCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, BookOpen, GitCommit, Star } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export default function GitHubPage() {
  const { githubUser } = useUser();
  const { data, loading, error } = useGitHub();

  const displayData = data || demoGitHub;

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-500 font-medium">{error}</p>
        <p className="text-sm text-slate-500 mt-2">Try a different username or connect via the navbar</p>
      </div>
    );
  }

  const commitData = (displayData.commitActivity || []).map((count, i) => ({
    month: MONTHS[i] || `M${i + 1}`,
    commits: count,
  }));

  const langData = Object.entries(displayData.languages || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">GitHub Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          {githubUser ? `@${displayData.username}` : 'Connect your GitHub account'}
        </p>
      </div>

      {displayData.profile && (
        <div className="card flex items-center gap-4">
          <img
            src={displayData.profile.avatar}
            alt={displayData.profile.username}
            className="w-16 h-16 rounded-full border-2 border-slate-200"
          />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{displayData.profile.username}</h2>
            <p className="text-sm text-slate-500">
              {displayData.profile.public_repos} public repos · {displayData.profile.followers} followers
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Public Repos" value={displayData.public_repos} icon={BookOpen} color="text-blue-500" loading={loading} />
        <MetricCard label="Total Commits" value={displayData.totalCommits} icon={GitCommit} color="text-emerald-500" loading={loading} />
        <MetricCard label="Followers" value={displayData.followers} icon={Users} color="text-purple-500" loading={loading} />
        <MetricCard
          label="Top Repo Stars"
          value={displayData.repos?.[0]?.stars || 0}
          icon={Star}
          color="text-amber-500"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title">Commits per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={commitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="commits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title">Language Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={langData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {langData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-2 flex-wrap">
            {langData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-xs text-slate-500">{d.name}: {d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Top Repositories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(displayData.repos || []).map((repo) => (
            <div key={repo.name} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-900 truncate">{repo.name}</h4>
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <Star className="w-3 h-3" />
                  <span>{repo.stars}</span>
                </div>
              </div>
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-2">
                {repo.language}
              </span>
              <p className="text-xs text-slate-400">Updated {repo.updatedAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
