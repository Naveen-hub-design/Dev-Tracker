import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';

const PRIORITY_CONFIG = {
  high: { icon: AlertTriangle, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800/30', label: 'High' },
  medium: { icon: TrendingUp, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800/30', label: 'Medium' },
  low: { icon: Lightbulb, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800/30', label: 'Low' },
};

export default function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Recommendations</h3>
      <div className="space-y-2.5">
        {recommendations.map((rec, i) => {
          const config = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.low;
          const Icon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-start gap-3 p-3 rounded-xl border ${config.border} ${config.bg} transition-colors hover:shadow-sm`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{rec.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{rec.category}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${config.color} ${config.bg}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
