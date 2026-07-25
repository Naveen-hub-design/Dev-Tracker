import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { UserPlus, Clock } from 'lucide-react';

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];

function getColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function RecentRegistrations({ users }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900">Recent Registrations</h3>
        </div>
        <div className="space-y-2">
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
            >
              <div className={`w-8 h-8 rounded-lg ${getColor(u.name)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                {getInitials(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{u.name}</p>
                <p className="text-[10px] text-slate-400">{u.email}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(u.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(RecentRegistrations);
