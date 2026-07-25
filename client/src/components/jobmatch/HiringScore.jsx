import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Briefcase, FileText, GitBranch, Code2, Award } from 'lucide-react';

const CARDS = [
  { key: 'portfolio', label: 'Portfolio Score', Icon: Briefcase, color: 'blue' },
  { key: 'github', label: 'GitHub Score', Icon: GitBranch, color: 'purple' },
  { key: 'coding', label: 'Coding Score', Icon: Code2, color: 'emerald' },
];

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', ring: 'ring-blue-500/10', text: 'text-blue-600', grad: 'from-blue-500 to-indigo-500' },
  purple: { bg: 'bg-purple-50', ring: 'ring-purple-500/10', text: 'text-purple-600', grad: 'from-purple-500 to-violet-500' },
  emerald: { bg: 'bg-emerald-50', ring: 'ring-emerald-500/10', text: 'text-emerald-600', grad: 'from-emerald-500 to-teal-500' },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

function HiringScore({ resumeScore }) {
  if (!resumeScore) return null;
  const overall = resumeScore.overall || 0;
  const overallColor = overall >= 70 ? 'from-emerald-500 to-teal-500' : overall >= 40 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';
  const overallLabel = overall >= 70 ? 'Strong' : overall >= 40 ? 'Moderate' : 'Developing';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <SectionHeader
          title="Hiring Score"
          subtitle="Resume and portfolio readiness assessment"
        />
        <div className="mt-5 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg width={128} height={128} className="transform -rotate-90">
              <circle cx={64} cy={64} r={54} fill="none" stroke="#F1F5F9" strokeWidth={10} />
              <motion.circle
                cx={64}
                cy={64}
                r={54}
                fill="none"
                stroke={`url(#hiringGrad)`}
                strokeWidth={10}
                strokeDasharray={2 * Math.PI * 54}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                whileInView={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - overall / 100) }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              />
              <defs>
                <linearGradient id="hiringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={overall >= 70 ? '#10B981' : overall >= 40 ? '#F59E0B' : '#EF4444'} />
                  <stop offset="100%" stopColor={overall >= 70 ? '#14B8A6' : overall >= 40 ? '#F97316' : '#F43F5E'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">
                <AnimatedNumber value={overall} duration={1200} />
              </span>
              <span className="text-[10px] text-slate-400">{overallLabel}</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-4">Overall Hiring Score</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CARDS.map((card) => {
            const val = resumeScore[card.key] || 0;
            const colors = COLOR_MAP[card.color];
            return (
              <motion.div key={card.key} variants={item}>
                <div className="text-center p-3 rounded-xl bg-slate-50/80">
                  <div className={`w-8 h-8 rounded-lg ring-1 ${colors.ring} ${colors.bg} flex items-center justify-center mx-auto mb-2`}>
                    <card.Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <p className="text-lg font-bold text-slate-900 tabular-nums">
                    <AnimatedNumber value={val} duration={1000} />
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{card.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(HiringScore);
