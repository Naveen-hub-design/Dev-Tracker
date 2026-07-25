import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Star, TrendingUp, Zap, Award } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 1, label: 'First Solve', Icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-500/10' },
  { id: 2, label: '10 Solved', Icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-500/10' },
  { id: 3, label: '25 Solved', Icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-500/10' },
  { id: 4, label: '50 Solved', Icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-500/10' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

function LCAchievements({ data }) {
  const unlocked = useMemo(() => {
    const total = data?.total || 0;
    return ACHIEVEMENTS.map((a) => {
      let unlocked = false;
      if (a.id === 1 && total >= 1) unlocked = true;
      if (a.id === 2 && total >= 10) unlocked = true;
      if (a.id === 3 && total >= 25) unlocked = true;
      if (a.id === 4 && total >= 50) unlocked = true;
      return { ...a, unlocked };
    });
  }, [data?.total]);

  const count = unlocked.filter((a) => a.unlocked).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <div className="flex items-center justify-between mb-5">
          <SectionHeader title="Achievements" subtitle="Milestones unlocked" />
          <span className="text-xs font-bold text-slate-900 bg-slate-100 rounded-full px-2.5 py-1">
            {count} / {ACHIEVEMENTS.length}
          </span>
        </div>
        <motion.div
          className="grid grid-cols-2 gap-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {unlocked.map((a) => (
            <motion.div
              key={a.id}
              variants={item}
              className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                a.unlocked
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                  : 'bg-slate-50/60 border-slate-100 opacity-50'
              }`}
            >
              <div className={`p-2 rounded-lg ring-1 ${a.ring} ${a.bg}`}>
                <a.Icon className={`w-4 h-4 ${a.unlocked ? a.color : 'text-slate-300'}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${a.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>{a.label}</p>
                <p className="text-[10px] text-slate-400">{a.unlocked ? 'Unlocked' : 'Locked'}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default React.memo(LCAchievements);
