import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Users, Activity, Link2, BarChart3, Shield, AlertTriangle } from 'lucide-react';

const STAT_CONFIG = [
  { key: 'total', label: 'Total Users', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-500/10' },
  { key: 'dau', label: 'Daily Active', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-500/10' },
  { key: 'githubConnected', label: 'GitHub Connected', icon: Link2, color: 'text-slate-700', bg: 'bg-slate-100', ring: 'ring-slate-500/10' },
  { key: 'leetcodeConnected', label: 'LeetCode Connected', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-500/10' },
  { key: 'hackerrankConnected', label: 'HackerRank Connected', icon: Shield, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-500/10' },
  { key: 'suspended', label: 'Suspended', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-500/10' },
];

function AdminStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {STAT_CONFIG.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ring-1 ${s.ring}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stats[s.key]}</p>
                <p className="text-[11px] text-slate-500 font-medium">{s.label}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default React.memo(AdminStats);
