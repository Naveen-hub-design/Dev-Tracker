import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Award } from 'lucide-react';

function AchievementBadges({ achievements }) {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Achievements</h3>
          <span className="ml-auto text-xs text-slate-500">{unlocked}/{achievements.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                a.unlocked
                  ? 'bg-amber-50 border-amber-200 shadow-sm'
                  : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
              title={a.desc}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{a.name}</span>
              {a.unlocked && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.04 + 0.2, type: 'spring' }}
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(AchievementBadges);
