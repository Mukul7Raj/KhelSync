'use client';

import { motion } from 'framer-motion';

const STAGES = ['Registration', 'Teams Ready', 'Scheduled', 'Live Matches', 'Completed'];

export default function ProgressTracker({
  started,
  finished,
  playerCount,
  isScheduled,
}: {
  started: boolean;
  finished: boolean;
  playerCount: number;
  isScheduled?: boolean;
}) {
  // Logic for determining the current stage
  let current = 0;
  if (finished) current = 4;
  else if (started) current = 3;
  else if (isScheduled) current = 2;
  else if (playerCount >= 2) current = 1;
  else current = 0;

  const progressPercent = (current / (STAGES.length - 1)) * 100;

  return (
    <div className="rounded-xl border border-cyan-400/40 bg-slate-950/55 backdrop-blur-md p-4 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
      <p className="text-xs text-cyan-200/90 mb-3 font-mono tracking-widest uppercase">Tournament_Flow.status</p>
      <div className="relative mb-6">
        <div className="h-1.5 rounded-full bg-cyan-900/40" />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'circOut' }}
        />
        {/* Glow point */}
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_10px_#fff]"
          animate={{ left: `${progressPercent}%` }}
          style={{ x: '-50%' }}
          transition={{ duration: 0.8, ease: 'circOut' }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {STAGES.map((label, idx) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.02 }}
            className={`rounded border px-1 py-2 text-[10px] font-mono uppercase tracking-tighter text-center transition-all duration-500 ${
              idx === current
                ? 'border-cyan-400 bg-cyan-400/20 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse'
                : idx < current
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400/80'
                  : 'border-white/5 bg-white/5 text-white/20'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
