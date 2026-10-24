import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import { GitFork, Star, Users, GitBranch, Code2, Activity, Layers, GitPullRequest, AlertCircle } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

function GitHubStats({ data }) {
  const stats = useMemo(() => {
    if (!data) return [];
    const repos = data.repos || [];
    const langs = data.languages || {};
    const langCount = Object.keys(langs).length;
    const totalStars = data.totalStars ?? repos.reduce((a, r) => a + (r.stars || 0), 0);
    const totalForks = data.totalForks ?? repos.reduce((a, r) => a + (r.forks || 0), 0);
    const prCount = data.prCount ?? 0;
    const totalOpenIssues = data.totalOpenIssues ?? repos.reduce((a, r) => a + (r.openIssues || 0), 0);

    return [
      { label: 'Repositories', value: data.public_repos || (data.profile?.public_repos) || 0, Icon: Layers, bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/10' },
      { label: 'Followers', value: data.followers || (data.profile?.followers) || 0, Icon: Users, bg: 'bg-purple-50 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-500/10' },
      { label: 'Total Stars', value: totalStars, Icon: Star, bg: 'bg-amber-50 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/10' },
      { label: 'Forks', value: totalForks, Icon: GitFork, bg: 'bg-emerald-50 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/10' },
      { label: 'Commits', value: data.totalCommits || 0, Icon: GitBranch, bg: 'bg-slate-100 dark:bg-slate-800', color: 'text-slate-700 dark:text-slate-300', ring: 'ring-slate-500/10' },
      { label: 'Pull Requests', value: prCount, Icon: GitPullRequest, bg: 'bg-indigo-50 dark:bg-indigo-900/30', color: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-500/10' },
      { label: 'Languages', value: langCount, Icon: Code2, bg: 'bg-orange-50 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-500/10' },
    ];
  }, [data]);

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={item}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ring-1 ${s.ring} ${s.bg}`}>
              <s.Icon className={`w-4 h-4 ${s.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            <AnimatedNumber value={s.value} duration={1000} />
          </p>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default React.memo(GitHubStats);
