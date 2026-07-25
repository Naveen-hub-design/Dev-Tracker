import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 35;
const CODE_SYMBOLS = ['{ }', '< />', '( )', '[ ]', '=>', '===', '&&', '||', 'fn()', 'async', 'import', 'export', 'const', 'let', 'map()', '=> {}', '.then', 'await', '.map', '.filter'];

function Particles() {
  const items = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.8,
    dur: Math.random() * 25 + 18,
    delay: Math.random() * 12,
    op: Math.random() * 0.25 + 0.05,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -25, 0], x: [0, Math.random() * 16 - 8, 0], opacity: [p.op, p.op * 2.5, p.op] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="loginGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#loginGrid)" className="text-slate-900 dark:text-white" />
      </svg>
    </div>
  );
}

function GlowBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/[0.07] dark:bg-blue-500/[0.1] blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 -right-24 w-[400px] h-[400px] rounded-full bg-purple-600/[0.06] dark:bg-purple-500/[0.09] blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-500/[0.05] dark:bg-cyan-400/[0.07] blur-[90px]"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function ConnectionLines() {
  const lines = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x1: `${10 + Math.random() * 30}%`,
    y1: `${10 + Math.random() * 80}%`,
    x2: `${60 + Math.random() * 30}%`,
    y2: `${10 + Math.random() * 80}%`,
    delay: i * 0.8,
  })), []);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04] dark:opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      {lines.map((l) => (
        <motion.line
          key={l.id}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="currentColor" strokeWidth="0.5" className="text-blue-400"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: l.delay, ease: 'easeInOut' }}
        />
      ))}
      {lines.map((l) => (
        <motion.circle
          key={`dot-${l.id}`}
          cx={l.x1} cy={l.y1} r="2"
          fill="currentColor" className="text-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, delay: l.delay + 1, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function FloatingCodeSymbols() {
  const items = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    text: CODE_SYMBOLS[i % CODE_SYMBOLS.length],
    x: 5 + Math.random() * 50,
    y: 5 + Math.random() * 90,
    delay: i * 0.4,
    dur: 20 + Math.random() * 15,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((s) => (
        <motion.span
          key={s.id}
          className="absolute font-mono text-[10px] text-blue-400/[0.08] dark:text-blue-300/[0.1] select-none"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -15, 0] }}
          transition={{ opacity: { delay: s.delay, duration: 0.8 }, y: { duration: s.dur, repeat: Infinity, ease: 'easeInOut' } }}
        >
          {s.text}
        </motion.span>
      ))}
    </div>
  );
}

function AnimatedDots() {
  const dots = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute w-1 h-1 rounded-full bg-indigo-400/20 dark:bg-indigo-300/25"
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
          animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function AnimatedBackground({ mouseX, mouseY }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a0e1a] to-slate-950 dark:from-slate-950 dark:via-[#0a0e1a] dark:to-slate-950 overflow-hidden">
      <GridPattern />
      <ConnectionLines />
      <FloatingCodeSymbols />
      <GlowBlobs />
      <Particles />
      <AnimatedDots />

      {/* Mouse-following glow */}
      {mouseX != null && mouseY != null && (
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] dark:bg-blue-400/[0.06] blur-[100px] pointer-events-none"
          animate={{ x: mouseX - 200, y: mouseY - 200 }}
          transition={{ type: 'spring', damping: 30, stiffness: 120, mass: 0.8 }}
        />
      )}

      {/* Top-right accent line */}
      <div className="absolute top-0 right-0 w-[600px] h-px bg-gradient-to-l from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-[600px] h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />

      {/* Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
}
