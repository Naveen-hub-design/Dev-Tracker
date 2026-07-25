import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Calendar, Flag, CheckCircle, Rocket } from 'lucide-react';

function ProjectTimeline({ projects }) {
  const allMilestones = useMemo(() => {
    if (!projects?.length) return [];
    const items = [];
    projects.forEach((p) => {
      p.milestones?.forEach((m) => {
        items.push({ ...m, projectName: p.name, projectId: p.id });
      });
    });
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12);
  }, [projects]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <SectionHeader title="Project Timeline" subtitle="Recent milestones across all projects" />
        <div className="mt-5">
          {allMilestones.length > 0 ? (
            <div className="space-y-0">
              {allMilestones.map((m, i) => (
                <motion.div
                  key={`${m.projectId}-${i}`}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${
                      i === 0 ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-300'
                    }`} />
                    {i < allMilestones.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className="pb-6 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{m.label}</p>
                    <p className="text-xs text-blue-600 font-medium">{m.projectName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No milestones yet</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(ProjectTimeline);
