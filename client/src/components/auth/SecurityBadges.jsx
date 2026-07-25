import { motion } from 'framer-motion';
import { Shield, Lock, Key, Eye } from 'lucide-react';

const BADGES = [
  { Icon: Shield, label: 'Secure Authentication' },
  { Icon: Lock, label: 'JWT Protected' },
  { Icon: Key, label: 'Encrypted Passwords' },
  { Icon: Eye, label: 'Privacy First' },
];

export default function SecurityBadges() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5"
    >
      {BADGES.map((b) => (
        <div key={b.label} className="flex items-center gap-1">
          <b.Icon className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{b.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
