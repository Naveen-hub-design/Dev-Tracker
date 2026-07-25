import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Layout, Server, Layers, Coffee, Atom, Brain, ExternalLink } from 'lucide-react';

const ICON_MAP = { Layout, Server, Layers, Coffee, Atom, Brain };

const COLOR_MAP = {
  blue: 'from-blue-500 to-indigo-500',
  emerald: 'from-emerald-500 to-teal-500',
  purple: 'from-purple-500 to-violet-500',
  amber: 'from-amber-500 to-orange-500',
  cyan: 'from-cyan-500 to-blue-500',
  rose: 'from-rose-500 to-pink-500',
};

const getBarColor = (score) => {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-400';
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

function RecommendedJobs({ jobs }) {
  if (!jobs?.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <SectionHeader
          title="Recommended Jobs"
          subtitle="Roles that match your skill profile"
        />
        <motion.div
          className="mt-5 space-y-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {jobs.map((job, i) => {
            const Icon = ICON_MAP[job.icon] || Layout;
            const barColor = getBarColor(job.score);
            const barGrad = COLOR_MAP[job.color] || COLOR_MAP.blue;
            const label = job.score >= 70 ? 'Strong Match' : job.score >= 40 ? 'Good Match' : 'Partial Match';

            return (
              <motion.div
                key={job.id}
                variants={item}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${barGrad} flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      job.score >= 70 ? 'bg-emerald-50 text-emerald-700' : job.score >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${barColor}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${job.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">{job.score}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default React.memo(RecommendedJobs);
