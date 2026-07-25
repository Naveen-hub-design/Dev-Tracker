import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Code2, Lightbulb } from 'lucide-react';

const getBarColor = (score) => {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-400';
};

const getTextColor = (score) => {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-500';
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

function SkillMatch({ skills }) {
  if (!skills?.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <SectionHeader
          title="Skill Match"
          subtitle="Your proficiency across key technologies"
          action={
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Lightbulb className="w-3 h-3" />
              <span>Hover for details</span>
            </div>
          }
        />
        <motion.div
          className="mt-5 space-y-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {skills.map((skill) => (
            <motion.div key={skill.key} variants={item} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{skill.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold tabular-nums ${getTextColor(skill.score)}`}>
                    {skill.score}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${getBarColor(skill.score)} transition-all duration-300`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default React.memo(SkillMatch);
