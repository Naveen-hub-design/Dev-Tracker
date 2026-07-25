import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, GitFork, ArrowUpDown } from 'lucide-react';

const LANG_COLORS = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5', Java: '#B07219',
  CSS: '#563D7C', HTML: '#E34C26', React: '#61DAFB', 'C++': '#F34B7D',
  Go: '#00ADD8', Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138',
  Kotlin: '#A97BFF', Rust: '#DEA584', Shell: '#89E051', 'C#': '#178600',
};

function RepoCard({ repo, index }) {
  const color = LANG_COLORS[repo.language] || '#94A3B8';
  return (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-slate-900 truncate">{repo.name}</h3>
        {repo.url && (
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors shrink-0">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3 min-h-[30px]">
        {repo.description || 'No description'}
      </p>
      <div className="flex items-center gap-3 text-[11px] text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-amber-400" />
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-0.5">
            <GitFork className="w-3 h-3 text-slate-400" />
            {repo.forks}
          </span>
        )}
      </div>
      {repo.updatedAt && (
        <p className="text-[10px] text-slate-400 mt-2">{repo.updatedAt}</p>
      )}
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
      result = result.filter((r) => r.name?.toLowerCase().includes(q));
    }
    if (langFilter !== 'all') {
      result = result.filter((r) => r.language === langFilter);
    }
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'updated':
        result.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
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
        <input
          type="text"
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          <option value="all">All Languages</option>
          {languages.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          <option value="stars">By Stars</option>
          <option value="name">By Name</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((repo, i) => (
            <RepoCard key={repo.name} repo={repo} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-8">No repositories found</p>
      )}
    </div>
  );
}

export default React.memo(RepositoryGrid);
