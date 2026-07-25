import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import DashboardPreview from './DashboardPreview';
import FloatingCards from './FloatingCards';

function TypingText() {
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 py-1.5 backdrop-blur-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.0, duration: 0.5 }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[11px] text-white/50 font-mono">Tracking 24 repos, 142 problems, 8 projects</span>
    </motion.div>
  );
}

export default function HeroSection({ mouseX, mouseY }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 lg:px-12 overflow-hidden">
      <FloatingCards />

      {/* Dashboard preview — centered */}
      <div className="relative z-10 mb-6 lg:mb-8">
        <DashboardPreview />
      </div>

      {/* Text content below dashboard */}
      <div className="relative z-10 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">DevTrack</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-2xl lg:text-3xl xl:text-[2.1rem] font-bold leading-tight mb-3"
        >
          <span className="text-white">Your Developer </span>
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Productivity Hub
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-[13px] text-white/40 leading-relaxed max-w-sm mx-auto mb-5"
        >
          Track coding progress, GitHub activity, projects, placement readiness, and AI insights in one powerful dashboard.
        </motion.p>

        <TypingText />
      </div>
    </div>
  );
}
