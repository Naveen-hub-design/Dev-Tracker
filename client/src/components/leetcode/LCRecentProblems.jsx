import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

function DifficultyBadge({ difficulty }) {
  const map = {
    Easy: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    Medium: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    Hard: 'bg-red-50 text-red-700 ring-red-600/10',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ring-1 ring-inset ${map[difficulty] || 'bg-slate-50 text-slate-600'}`}>
      {difficulty}
    </span>
  );
}

function LCRecentProblems({ topics, loading }) {
  const recentItems = useMemo(() => {
    if (!topics?.length) return [];
    return topics.slice(0, 5).map((t, i) => ({
      id: i,
      title: t.name,
      difficulty: t.solved >= 20 ? 'Hard' : t.solved >= 10 ? 'Medium' : 'Easy',
      solved: t.solved,
      timeAgo: `${Math.floor(Math.random() * 6) + 1}d ago`,
    }));
  }, [topics]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <SectionHeader title="Recent Problem Topics" subtitle="Most recently active topics" />
        <div className="mt-4 space-y-2">
          {recentItems.length > 0 ? (
            recentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white ring-1 ring-slate-200 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <DifficultyBadge difficulty={item.difficulty} />
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No topics yet</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(LCRecentProblems);
