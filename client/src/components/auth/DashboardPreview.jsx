import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GitCommit, Code2, FolderKanban, Trophy, Star,
  TrendingUp, Zap, Flame, Activity, BarChart3
} from 'lucide-react';

function ContributionGraph() {
  const weeks = useMemo(() => {
    const grid = [];
    for (let w = 0; w < 15; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const r = Math.random();
        const level = r < 0.2 ? 0 : r < 0.45 ? 1 : r < 0.7 ? 2 : r < 0.88 ? 3 : 4;
        week.push(level);
      }
      grid.push(week);
    }
    return grid;
  }, []);

  const colors = ['bg-white/[0.04]', 'bg-emerald-500/25', 'bg-emerald-500/45', 'bg-emerald-500/70', 'bg-emerald-500/95'];

  return (
    <div className="flex gap-[3px]">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((level, di) => (
            <motion.div
              key={`${wi}-${di}`}
              className={`w-[7px] h-[7px] rounded-[1.5px] ${colors[level]}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + (wi * 7 + di) * 0.008, duration: 0.2 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MiniBar({ value, max, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] text-white/40 w-6 shrink-0 text-right tabular-nums">{value}</span>
      <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

function LiveCounter({ icon: Icon, value, label, color, delay }) {
  return (
    <motion.div
      className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-2.5 py-1.5 border border-white/[0.06]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Icon className={`w-3 h-3 ${color}`} />
      <div>
        <p className={`text-[11px] font-bold ${color} tabular-nums`}>{value}</p>
        <p className="text-[7px] text-white/30">{label}</p>
      </div>
    </motion.div>
  );
}

function StreakBar() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className="flex gap-1">
      {days.map((d, i) => {
        const active = i < 5;
        return (
          <motion.div
            key={i}
            className={`w-5 h-5 rounded-md flex items-center justify-center text-[7px] font-bold ${
              active ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/[0.03] text-white/20 border border-white/[0.05]'
            }`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.4 + i * 0.05, duration: 0.3 }}
          >
            {d}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <motion.div
      className="w-full max-w-[420px]"
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Browser chrome */}
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-3.5 py-2 border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
              <div className="w-2 h-2 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 mx-8">
              <div className="bg-white/[0.04] rounded-md px-3 py-0.5 text-center">
                <span className="text-[8px] text-white/30 font-mono">devtrack.app/dashboard</span>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-3.5 space-y-3">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: FolderKanban, val: '24', label: 'Repos', color: 'text-blue-400', bg: 'bg-blue-500/10', delay: 1.6 },
                { icon: Code2, val: '142', label: 'Solved', color: 'text-amber-400', bg: 'bg-amber-500/10', delay: 1.7 },
                { icon: Trophy, val: '8', label: 'Badges', color: 'text-purple-400', bg: 'bg-purple-500/10', delay: 1.8 },
                { icon: TrendingUp, val: '72', label: 'Score', color: 'text-emerald-400', bg: 'bg-emerald-500/10', delay: 1.9 },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.05]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: s.delay, duration: 0.5 }}
                >
                  <div className={`w-6 h-6 rounded-lg ${s.bg} flex items-center justify-center mb-1.5`}>
                    <s.icon className={`w-3 h-3 ${s.color}`} />
                  </div>
                  <p className={`text-[13px] font-bold ${s.color} tabular-nums leading-none`}>{s.val}</p>
                  <p className="text-[7px] text-white/30 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Contribution graph */}
            <motion.div
              className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="w-3 h-3 text-emerald-400" />
                  <span className="text-[8px] text-white/50 font-medium">Contribution Activity</span>
                </div>
                <span className="text-[7px] text-white/25">312 contributions</span>
              </div>
              <ContributionGraph />
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-2 gap-2">
              {/* Language breakdown */}
              <motion.div
                className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.1, duration: 0.5 }}
              >
                <span className="text-[8px] text-white/50 font-medium block mb-2">Languages</span>
                <div className="space-y-1.5">
                  <MiniBar value={42} max={100} color="bg-yellow-400" />
                  <MiniBar value={28} max={100} color="bg-blue-400" />
                  <MiniBar value={18} max={100} color="bg-purple-400" />
                  <MiniBar value={12} max={100} color="bg-emerald-400" />
                </div>
              </motion.div>

              {/* Weekly streak */}
              <motion.div
                className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="text-[8px] text-white/50 font-medium">5-day streak</span>
                </div>
                <StreakBar />
              </motion.div>
            </div>

            {/* Bottom stats bar */}
            <div className="grid grid-cols-3 gap-2">
              <LiveCounter icon={Star} value="34" label="Stars" color="text-amber-400" delay={2.5} />
              <LiveCounter icon={Zap} value="847" label="Commits" color="text-blue-400" delay={2.6} />
              <LiveCounter icon={Activity} value="92%" label="Uptime" color="text-emerald-400" delay={2.7} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
