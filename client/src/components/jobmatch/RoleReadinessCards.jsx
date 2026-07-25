import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import { Layout, Server, Layers, Coffee, Atom, Brain } from 'lucide-react';

const ICON_MAP = { Layout, Server, Layers, Coffee, Atom, Brain };

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', ring: 'ring-blue-500/10', text: 'text-blue-600', bar: 'from-blue-500 to-indigo-500' },
  emerald: { bg: 'bg-emerald-50', ring: 'ring-emerald-500/10', text: 'text-emerald-600', bar: 'from-emerald-500 to-teal-500' },
  purple: { bg: 'bg-purple-50', ring: 'ring-purple-500/10', text: 'text-purple-600', bar: 'from-purple-500 to-violet-500' },
  amber: { bg: 'bg-amber-50', ring: 'ring-amber-500/10', text: 'text-amber-600', bar: 'from-amber-500 to-orange-500' },
  cyan: { bg: 'bg-cyan-50', ring: 'ring-cyan-500/10', text: 'text-cyan-600', bar: 'from-cyan-500 to-blue-500' },
  rose: { bg: 'bg-rose-50', ring: 'ring-rose-500/10', text: 'text-rose-600', bar: 'from-rose-500 to-pink-500' },
};

const getBarColor = (score) => {
  if (score >= 70) return 'from-emerald-500 to-teal-500';
  if (score >= 40) return 'from-amber-500 to-orange-500';
  return 'from-red-500 to-rose-500';
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

function RoleReadinessCards({ roles }) {
  if (!roles?.length) return null;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {roles.map((role) => {
        const Icon = ICON_MAP[role.icon] || Layout;
        const colors = COLOR_MAP[role.color] || COLOR_MAP.blue;
        const barGrad = getBarColor(role.score);
        const label = role.score >= 70 ? 'Ready' : role.score >= 40 ? 'Developing' : 'Early';

        return (
          <motion.div
            key={role.id}
            variants={item}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ring-1 ${colors.ring} ${colors.bg}`}>
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{role.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  role.score >= 70 ? 'bg-emerald-50 text-emerald-700' : role.score >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                }`}>
                  {label}
                </span>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-slate-900 tabular-nums">
                  <AnimatedNumber value={role.score} duration={1000} />
                </p>
                <p className="text-[10px] text-slate-400">/100</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${barGrad}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${role.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {role.skills?.slice(0, 4).map((s) => (
                <span key={s} className="px-2 py-0.5 rounded bg-slate-50 text-[10px] font-medium text-slate-500">{s}</span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default React.memo(RoleReadinessCards);
