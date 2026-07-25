import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';

function GoalsHero({ streaks, todayActivity, ringProgress }) {
  const dailyPct = Math.round(((ringProgress.daily.commits + ringProgress.daily.problems + ringProgress.daily.hours) / 3) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 border-slate-700 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm text-blue-300 font-medium mb-1">Coding Goals Dashboard</p>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">
              {dailyPct >= 100 ? '🎉 Daily goals complete!' : dailyPct >= 50 ? '💪 Great progress today!' : '🚀 Keep coding today!'}
            </h1>
            <p className="text-slate-300 text-sm max-w-lg">
              Track your daily, weekly, and monthly coding goals. Build streaks, earn badges, and level up your development skills.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-2xl font-bold">{streaks.current}</p>
              <p className="text-[11px] text-slate-300">Current Streak</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
              <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-2xl font-bold">{streaks.longest}</p>
              <p className="text-[11px] text-slate-300">Longest Streak</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
              <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-2xl font-bold">{todayActivity.commits || 0}</p>
              <p className="text-[11px] text-slate-300">Commits Today</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-2xl font-bold">{todayActivity.problems || 0}</p>
              <p className="text-[11px] text-slate-300">Problems Today</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(GoalsHero);
