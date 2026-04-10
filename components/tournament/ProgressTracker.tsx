'use client';

import { motion } from 'framer-motion';

const STAGES = ['Registration', 'Teams Ready', 'Live Matches', 'Completed'];

export default function ProgressTracker({
  started,
  finished,
  playerCount,
}: {
  started: boolean;
  finished: boolean;
  playerCount: number;
}) {
  const current = finished ? 3 : started ? 2 : playerCount >= 2 ? 1 : 0;
  const progressPercent = (current / (STAGES.length - 1)) * 100;

  return (
    <div className="rounded-xl border border-cyan-400/40 bg-slate-950/55 backdrop-blur-md p-4 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
      <p className="text-xs text-cyan-200/90 mb-3">Tournament Progress</p>
      <div className="relative mb-4">
        <div className="h-2 rounded-full bg-cyan-900/40" />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STAGES.map((label, idx) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.05 }}
            className={`rounded-md border px-2 py-1.5 text-xs text-center transition-colors ${
              idx === current
                ? 'border-cyan-300 bg-cyan-400/15 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.35)]'
                : idx < current
                  ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                  : 'border-slate-600/50 bg-slate-900/40 text-slate-300'
            }`}
            initial={{ opacity: 0.8, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut', delay: idx * 0.08 }}
          >
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
