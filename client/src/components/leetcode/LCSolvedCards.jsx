import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import { CheckCircle, Brain, BarChart3, AlertTriangle } from 'lucide-react';

const CARDS = [
  { key: 'total', label: 'Total Solved', Icon: CheckCircle, ring: 'ring-blue-500/10', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', grad: 'from-blue-500 to-indigo-500' },
  { key: 'easy', label: 'Easy', Icon: Brain, ring: 'ring-emerald-500/10', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', grad: 'from-emerald-500 to-teal-500' },
  { key: 'medium', label: 'Medium', Icon: BarChart3, ring: 'ring-amber-500/10', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', grad: 'from-amber-500 to-orange-500' },
  { key: 'hard', label: 'Hard', Icon: AlertTriangle, ring: 'ring-red-500/10', iconBg: 'bg-red-50', iconColor: 'text-red-600', grad: 'from-red-500 to-rose-500' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function LCSolvedCards({ data }) {
  const vals = useMemo(() => ({
    total: data?.total || 0,
    easy: data?.easy || 0,
    medium: data?.medium || 0,
    hard: data?.hard || 0,
  }), [data]);

  const subs = useMemo(() => ({
    total: data?.total ? `${Math.round((data.total / 500) * 100)}% to 500` : 'Start solving',
    easy: data?.easy ? `${data.total ? Math.round((data.easy / data.total) * 100) : 0}% of total` : 'No easy solved',
    medium: data?.medium ? `${data.total ? Math.round((data.medium / data.total) * 100) : 0}% of total` : 'No medium solved',
    hard: data?.hard ? `${data.total ? Math.round((data.hard / data.total) * 100) : 0}% of total` : 'No hard solved',
  }), [data]);

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {CARDS.map(({ key, label, Icon, ring, iconBg, iconColor }) => (
        <motion.div
          key={key}
          variants={item}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ring-1 ${ring} ${iconBg}`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            <AnimatedNumber value={vals[key]} duration={1000} />
          </p>
          <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{subs[key]}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default React.memo(LCSolvedCards);
