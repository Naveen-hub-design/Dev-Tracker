import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import { FolderKanban, CheckCircle2, Clock, Link2, BarChart3 } from 'lucide-react';

const CARDS = [
  { key: 'total', label: 'Total Projects', Icon: FolderKanban, grad: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', ring: 'ring-blue-500/10', color: 'text-blue-600' },
  { key: 'completed', label: 'Completed', Icon: CheckCircle2, grad: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', ring: 'ring-emerald-500/10', color: 'text-emerald-600' },
  { key: 'inProgress', label: 'In Progress', Icon: Clock, grad: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', ring: 'ring-amber-500/10', color: 'text-amber-600' },
  { key: 'linked', label: 'GitHub Linked', Icon: Link2, grad: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', ring: 'ring-purple-500/10', color: 'text-purple-600' },
  { key: 'avgCompletion', label: 'Avg Completion', Icon: BarChart3, grad: 'from-slate-600 to-slate-800', bg: 'bg-slate-50', ring: 'ring-slate-500/10', color: 'text-slate-700', suffix: '%' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

function ProjectsHero({ stats }) {
  if (!stats) return null;
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZW2lnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAyMGgyMjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
            <FolderKanban className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-slate-300">Your developer portfolio</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsHeroCards({ stats }) {
  if (!stats) return null;
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {CARDS.map(({ key, label, Icon, bg, ring, color, suffix }) => (
        <motion.div key={key} variants={item}>
          <Card className="hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ring-1 ${ring} ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              <AnimatedNumber value={stats[key] || 0} duration={1000} />{suffix || ''}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export { ProjectsHero, ProjectsHeroCards };
export default React.memo(ProjectsHero);
