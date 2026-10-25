import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Github, Code2, Shield, Users, Zap, Trophy, ChefHat } from 'lucide-react';

function PlatformUsageCards({ stats }) {
  const platforms = [
    { label: 'GitHub', icon: Github, connected: stats.githubConnected, total: stats.total, color: 'text-slate-800 dark:text-slate-200', bg: 'bg-slate-100 dark:bg-slate-800', bar: 'bg-slate-800 dark:bg-slate-300' },
    { label: 'LeetCode', icon: Code2, connected: stats.leetcodeConnected, total: stats.total, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', bar: 'bg-amber-500' },
    { label: 'Codeforces', icon: Trophy, connected: stats.codeforcesConnected || 0, total: stats.total, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', bar: 'bg-blue-500' },
    { label: 'CodeChef', icon: ChefHat, connected: stats.codechefConnected || 0, total: stats.total, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40', bar: 'bg-orange-500' },
    { label: 'HackerRank', icon: Shield, connected: stats.hackerrankConnected, total: stats.total, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40', bar: 'bg-green-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Platform Connections</h3>
        </div>
        <div className="space-y-4">
          {platforms.map((p) => {
            const pct = Math.round((p.connected / Math.max(1, p.total)) * 100);
            return (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-md ${p.bg} flex items-center justify-center`}>
                      <p.icon className={`w-3 h-3 ${p.color}`} />
                    </span>
                    {p.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{p.connected}/{p.total} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${p.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40">
          <p className="text-xs text-orange-700 dark:text-orange-400">
            <span className="font-bold">{stats.allConnected}</span> active developers multi-platform connected
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(PlatformUsageCards);
