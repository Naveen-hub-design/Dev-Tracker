import { GitBranch } from 'lucide-react';

export default function GitHubHeader({ username, avatar }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2.5 rounded-xl bg-slate-900 text-white">
        <GitBranch className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-900">GitHub Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {username ? `@${username}` : 'Connect your GitHub account'}
        </p>
      </div>
    </div>
  );
}
