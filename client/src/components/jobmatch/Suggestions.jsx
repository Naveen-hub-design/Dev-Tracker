import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Sparkles, ArrowRight, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

const PRIORITY_CONFIG = {
  high: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-500/10', icon: AlertTriangle, label: 'High' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-500/10', icon: Lightbulb, label: 'Medium' },
  low: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-500/10', icon: Sparkles, label: 'Low' },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function Suggestions({ suggestions }) {
  if (!suggestions?.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <Card>
          <SectionHeader title="Suggestions" subtitle="Personalized recommendations" />
          <div className="mt-6 text-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">You're doing great!</p>
            <p className="text-xs text-slate-400 mt-1">Keep maintaining your current progress across all areas.</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <SectionHeader
          title="Suggestions"
          subtitle="Recommendations to improve your score"
          action={<span className="text-[10px] text-slate-400">{suggestions.length} items</span>}
        />
        <motion.div
          className="mt-5 space-y-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {suggestions.map((s, i) => {
            const cfg = PRIORITY_CONFIG[s.priority] || PRIORITY_CONFIG.low;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors group"
              >
                <div className={`p-1.5 rounded-lg ring-1 ${cfg.ring} ${cfg.bg} shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{s.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    <span className="text-[10px] text-slate-400">{s.category}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 mt-1" />
              </motion.div>
            );
          })}
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default React.memo(Suggestions);
