import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { GitBranch, Star, Folder, Flame, Award, Code2 } from 'lucide-react';

const ACHIEVEMENTS_DEF = [
  { id: 'first-commit', label: 'First Commit', desc: 'Made your first commit', Icon: GitBranch, threshold: (d) => (d.totalCommits || 0) >= 1 },
  { id: '100-commits', label: '100 Commits', desc: 'Reached 100 commits', Icon: Flame, threshold: (d) => (d.totalCommits || 0) >= 100 },
  { id: '1000-commits', label: '1000 Commits', desc: 'Reached 1000 commits', Icon: Flame, threshold: (d) => (d.totalCommits || 0) >= 1000, color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-500/10' },
  { id: '10-repos', label: '10 Repositories', desc: 'Created 10+ repos', Icon: Folder, threshold: (d) => (d.public_repos || 0) >= 10 },
  { id: '50-stars', label: '50 Stars', desc: 'Earned 50+ stars', Icon: Star, threshold: (d) => (d.repos || []).reduce((a, r) => a + (r.stars || 0), 0) >= 50, color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-500/10' },
  { id: 'polyglot', label: 'Polyglot', desc: 'Uses 3+ languages', Icon: Code2, threshold: (d) => Object.keys(d.languages || {}).length >= 3, color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-500/10' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.35 } } };

function GitHubAchievements({ data }) {
  const results = useMemo(() => {
    return ACHIEVEMENTS_DEF.map((a) => ({
      ...a,
      unlocked: a.threshold(data || {}),
    }));
  }, [data]);

  const count = results.filter((a) => a.unlocked).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <div className="flex items-center justify-between mb-5">
          <SectionHeader title="Achievements" subtitle="GitHub milestones unlocked" />
          <span className="text-xs font-bold text-slate-900 bg-slate-100 rounded-full px-2.5 py-1">
            {count} / {ACHIEVEMENTS_DEF.length}
          </span>
        </div>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {results.map((a) => {
            const color = a.unlocked ? (a.color || 'text-blue-500') : 'text-slate-300';
            const bg = a.unlocked ? (a.bg || 'bg-blue-50') : 'bg-slate-50/60';
            const ring = a.unlocked ? (a.ring || 'ring-blue-500/10') : 'ring-slate-200';
            return (
              <motion.div
                key={a.id}
                variants={item}
                className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  a.unlocked
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                    : 'bg-slate-50/60 border-slate-100 opacity-50'
                }`}
              >
                <div className={`p-2 rounded-lg ring-1 ${ring} ${bg}`}>
                  <a.Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${a.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>{a.label}</p>
                  <p className="text-[10px] text-slate-400">{a.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default React.memo(GitHubAchievements);
