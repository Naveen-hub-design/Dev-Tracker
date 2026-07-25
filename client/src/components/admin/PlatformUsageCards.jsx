import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Github, Code2, Shield, Users, Zap } from 'lucide-react';

function PlatformUsageCards({ stats }) {
  const platforms = [
    { label: 'GitHub', icon: Github, connected: stats.githubConnected, total: stats.total, color: 'text-slate-800', bg: 'bg-slate-100', bar: 'bg-slate-800' },
    { label: 'LeetCode', icon: Code2, connected: stats.leetcodeConnected, total: stats.total, color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' },
    { label: 'HackerRank', icon: Shield, connected: stats.hackerrankConnected, total: stats.total, color: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-900">Platform Connections</h3>
        </div>
        <div className="space-y-4">
          {platforms.map((p) => {
            const pct = Math.round((p.connected / Math.max(1, p.total)) * 100);
            return (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-md ${p.bg} flex items-center justify-center`}>
                      <p.icon className={`w-3 h-3 ${p.color}`} />
                    </span>
                    {p.label}
                  </span>
                  <span className="text-xs text-slate-500">{p.connected}/{p.total} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-700">
            <span className="font-bold">{stats.allConnected}</span> users have all 3 platforms connected
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(PlatformUsageCards);
