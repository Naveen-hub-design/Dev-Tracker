import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, GitPullRequest, Star, Clock, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

function GitHubVelocityCard({ data }) {
  if (!data) return null;

  const velocity = data.commitVelocity;
  const rateLimit = data.rateLimit;
  const avgMonthly = velocity?.avgMonthly || Math.round((data.totalCommits || 0) / 6);
  const peakCount = velocity?.peakCount || Math.max(...(data.commitActivity || [0]));
  const remaining = rateLimit?.remaining ?? 60;
  const limit = rateLimit?.limit ?? 60;
  const pct = Math.min(100, Math.max(0, Math.round((remaining / limit) * 100)));
  const isAuth = rateLimit?.authenticated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Engineering Velocity & API Token Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time GitHub rate limit quotas, repository velocity, and pull request activity
          </p>
        </div>
        {!isAuth && (
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shrink-0"
          >
            <Key className="w-3.5 h-3.5" />
            Upgrade to 5,000 req/hr
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Metric 1: Monthly Velocity */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Monthly Velocity</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{avgMonthly}</span>
            <span className="text-xs text-slate-400 font-medium">commits / mo avg</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            Peak surge: <strong className="text-slate-700 dark:text-slate-300">{peakCount}</strong> commits
          </p>
        </div>

        {/* Metric 2: Open Source Impact */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Community Impact</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-amber-500 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              {data.totalStars ?? 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">stars earned</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            Across {data.repos?.length || 0} active public repositories
          </p>
        </div>

        {/* Metric 3: Token Quota & Rate Limit */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">GitHub API Rate Limit</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isAuth ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {isAuth ? 'PAT Synced' : 'Public'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{remaining?.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium">/ {limit?.toLocaleString()} remaining</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct > 25 ? 'bg-emerald-500' : pct > 10 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(GitHubVelocityCard);
