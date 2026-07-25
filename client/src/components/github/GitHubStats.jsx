import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import { GitFork, Star, Users, GitBranch, Code2, Activity, Layers, CalendarDays } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

function GitHubStats({ data }) {
  const stats = useMemo(() => {
    if (!data) return [];
    const repos = data.repos || [];
    const langs = data.languages || {};
    const langCount = Object.keys(langs).length;
    const totalStars = repos.reduce((a, r) => a + (r.stars || 0), 0);
    const totalForks = repos.reduce((a, r) => a + (r.forks || 0), 0);
    const contribDays = (data.commitActivity || []).filter((c) => c > 0).length;

    return [
      { label: 'Repositories', value: data.public_repos || 0, Icon: Layers, bg: 'bg-blue-50', color: 'text-blue-600', ring: 'ring-blue-500/10' },
      { label: 'Followers', value: data.followers || 0, Icon: Users, bg: 'bg-purple-50', color: 'text-purple-600', ring: 'ring-purple-500/10' },
      { label: 'Total Stars', value: totalStars, Icon: Star, bg: 'bg-amber-50', color: 'text-amber-600', ring: 'ring-amber-500/10' },
      { label: 'Forks', value: totalForks, Icon: GitFork, bg: 'bg-emerald-50', color: 'text-emerald-600', ring: 'ring-emerald-500/10' },
      { label: 'Commits', value: data.totalCommits || 0, Icon: GitBranch, bg: 'bg-slate-50', color: 'text-slate-700', ring: 'ring-slate-500/10' },
      { label: 'Languages', value: langCount, Icon: Code2, bg: 'bg-orange-50', color: 'text-orange-600', ring: 'ring-orange-500/10' },
      { label: 'Contrib Days', value: contribDays, Icon: Activity, bg: 'bg-teal-50', color: 'text-teal-600', ring: 'ring-teal-500/10' },
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
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ring-1 ${s.ring} ${s.bg}`}>
              <s.Icon className={`w-4 h-4 ${s.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            <AnimatedNumber value={s.value} duration={1000} />
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-1">{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default React.memo(GitHubStats);
