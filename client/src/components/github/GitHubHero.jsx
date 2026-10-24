import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RefreshCw, ExternalLink, GitBranch, MapPin, Building2, Key, ShieldCheck } from 'lucide-react';

function GitHubHero({ data, onRefresh, loading }) {
  if (!data) return null;
  const profile = data.profile || {};
  const name = profile.name || data.username;
  const bio = profile.bio || 'Developer';
  const rateLimit = data.rateLimit;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 text-white shadow-xl shadow-slate-900/10 border border-slate-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAyMGgyMjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={data.avatar || profile.avatar}
              alt={data.username}
              className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-lg shadow-black/20 object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold">{name || `@${data.username}`}</h1>
                <span className="text-sm font-medium text-slate-400">@{data.username}</span>
                {rateLimit && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      rateLimit.authenticated
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {rateLimit.authenticated ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        PAT Synced ({rateLimit.remaining?.toLocaleString()} / {rateLimit.limit?.toLocaleString()} req/hr)
                      </>
                    ) : (
                      <>
                        <Key className="w-3 h-3 text-amber-400" />
                        Public API ({rateLimit.remaining} req left)
                      </>
                    )}
                  </span>
                )}
              </div>

              {bio && <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">{bio}</p>}

              <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-400 flex-wrap">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}
                  </span>
                )}
                {profile.company && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {profile.company}
                  </span>
                )}
                {profile.public_repos !== undefined && (
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> {profile.public_repos} public repos
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {!rateLimit?.authenticated && (
              <Link
                to="/settings"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                Sync PAT
              </Link>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-50"
              aria-label="Refresh GitHub data"
              title="Refresh GitHub data"
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
              GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(GitHubHero);
