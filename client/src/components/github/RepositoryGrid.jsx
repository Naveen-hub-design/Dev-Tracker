import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, GitFork, ArrowUpDown, AlertCircle, HardDrive, Scale, Globe, Search } from 'lucide-react';

const LANG_COLORS = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5', Java: '#B07219',
  CSS: '#563D7C', HTML: '#E34C26', React: '#61DAFB', 'C++': '#F34B7D',
  Go: '#00ADD8', Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138',
  Kotlin: '#A97BFF', Rust: '#DEA584', Shell: '#89E051', 'C#': '#178600',
};

function formatSize(kb) {
  if (!kb || kb <= 0) return '';
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function RepoCard({ repo, index }) {
  const color = LANG_COLORS[repo.language] || '#94A3B8';
  const repoUrl = repo.htmlUrl || repo.url || `https://github.com/${repo.fullName || repo.name}`;

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" title={repo.name}>
              {repo.name}
            </h3>
            {repo.isFork && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium shrink-0">
                Fork
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded text-slate-400 hover:text-emerald-500 transition-colors"
                title="Live Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-slate-400 hover:text-blue-500 transition-colors"
              title="View on GitHub"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 min-h-[32px] leading-relaxed">
          {repo.description || 'No repository description provided.'}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {repo.language && (
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {repo.language}
              </span>
            )}
            {repo.stars > 0 && (
              <span className="flex items-center gap-0.5 font-medium text-amber-600 dark:text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {repo.stars}
              </span>
            )}
            {repo.forks > 0 && (
              <span className="flex items-center gap-0.5">
                <GitFork className="w-3 h-3" />
                {repo.forks}
              </span>
            )}
            {repo.openIssues > 0 && (
              <span className="flex items-center gap-0.5 text-rose-500 dark:text-rose-400">
                <AlertCircle className="w-3 h-3" />
                {repo.openIssues}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
            {repo.license && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                <Scale className="w-2.5 h-2.5" />
                {repo.license}
              </span>
            )}
            {repo.size > 0 && (
              <span className="flex items-center gap-0.5">
                <HardDrive className="w-2.5 h-2.5" />
                {formatSize(repo.size)}
              </span>
            )}
          </div>
        </div>

        {repo.updatedAt && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
            Updated {formatDate(repo.updatedAt)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function RepositoryGrid({ repos, loading }) {
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [sortBy, setSortBy] = useState('stars');

  const languages = useMemo(() => {
    const set = new Set();
    (repos || []).forEach((r) => { if (r.language) set.add(r.language); });
    return Array.from(set).sort();
  }, [repos]);

  const filtered = useMemo(() => {
    let result = [...(repos || [])];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }
    if (langFilter !== 'all') {
      result = result.filter((r) => r.language === langFilter);
    }
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'updated':
        result.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
        break;
      case 'size':
        result.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      case 'stars':
      default:
        result.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        break;
    }
    return result;
  }, [repos, search, langFilter, sortBy]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search repositories or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Languages</option>
          {languages.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="stars">Most Stars</option>
          <option value="updated">Recently Updated</option>
          <option value="size">Largest Size</option>
          <option value="name">Repository Name</option>
        </select>
      </div>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((repo, i) => (
            <RepoCard key={repo.name} repo={repo} index={i} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400">No matching repositories found.</p>
        </div>
      )}
    </div>
  );
}

export default React.memo(RepositoryGrid);
