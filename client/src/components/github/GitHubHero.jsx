import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, GitBranch } from 'lucide-react';

function GitHubHero({ data, onRefresh, loading }) {
  if (!data) return null;
  const profile = data.profile || {};
  const name = profile.name || data.username;
  const bio = profile.bio || 'Developer';

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAyMGgyMjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={data.avatar || profile.avatar}
            alt={data.username}
            className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-lg shadow-black/20 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <GitBranch className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{name || `@${data.username}`}</h1>
                <p className="text-sm text-slate-300">@{data.username}</p>
              </div>
            </div>
            {bio && <p className="text-sm text-slate-300 mt-2 max-w-lg">{bio}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Profile
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(GitHubHero);
