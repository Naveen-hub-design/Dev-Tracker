import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Percent, Trophy, Hash, Flame } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function LCMetricCards({ data }) {
  const streak = useMemo(() => {
    const wp = data?.weeklyProgress;
    if (!wp?.length) return 0;
    return wp[wp.length - 1] || 0;
  }, [data?.weeklyProgress]);

  const avgWeekly = useMemo(() => {
    const wp = data?.weeklyProgress;
    if (!wp?.length) return 0;
    return Math.round(wp.reduce((a, b) => a + b, 0) / wp.length);
  }, [data?.weeklyProgress]);

  const metrics = [
    {
      label: 'Acceptance Rate',
      value: '—',
      sub: 'Not available via API',
      Icon: Percent,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      ring: 'ring-emerald-500/10',
    },
    {
      label: 'Contest Rating',
      value: '—',
      sub: 'Not available via API',
      Icon: Trophy,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      ring: 'ring-amber-500/10',
    },
    {
      label: 'Global Ranking',
      value: '—',
      sub: 'Not available via API',
      Icon: Hash,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      ring: 'ring-purple-500/10',
    },
    {
      label: 'Weekly Average',
      value: `${avgWeekly}`,
      sub: `${streak} solved last week`,
      Icon: Flame,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      ring: 'ring-orange-500/10',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {metrics.map((m) => (
        <motion.div key={m.label} variants={item}>
          <Card>
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{m.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{m.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ring-1 ${m.ring} ${m.iconBg} ${m.iconColor}`}>
                <m.Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">{m.sub}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default React.memo(LCMetricCards);
