import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Flame, Trophy, Zap, Calendar } from 'lucide-react';

function StreakCard({ streaks }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Streak Tracker</h3>
            <p className="text-xs text-slate-500">Keep the fire burning</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-xl bg-orange-50 border border-orange-100">
            <p className="text-3xl font-bold text-orange-600">{streaks.current}</p>
            <p className="text-xs text-orange-600/70 mt-0.5 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" /> Current
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-3xl font-bold text-amber-600">{streaks.longest}</p>
            <p className="text-xs text-amber-600/70 mt-0.5 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" /> Longest
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Streak Goal: 30 days</span>
            <span className="font-semibold text-slate-700">{Math.min(100, Math.round((streaks.current / 30) * 100))}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (streaks.current / 30) * 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(StreakCard);
