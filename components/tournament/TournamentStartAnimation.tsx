'use client';

import { AnimatePresence, motion } from 'framer-motion';

const TEAM_BLOCKS = ['Team A', 'Team B', 'Team C', 'Team D'];

export default function TournamentStartAnimation({
  open,
  success,
}: {
  open: boolean;
  success: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#050510]/95 backdrop-blur-md p-6 flex items-center justify-center"
        >
          <div className="w-full max-w-5xl rounded-xl border border-fuchsia-400/40 bg-slate-950/75 p-6 shadow-[0_0_35px_rgba(168,85,247,0.25)]">
            <p className="text-fuchsia-100 text-sm mb-5">Generating Bracket</p>

            <div className="rounded-lg border border-cyan-400/30 bg-slate-900/55 p-4">
              <svg viewBox="0 0 900 260" className="w-full h-44">
                <motion.path
                  d="M70 60 H300 M300 60 V130 M300 130 H520 M520 130 H760"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M70 200 H300 M300 200 V130 M520 130 V80 M520 130 V180"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
                />
              </svg>

              <div className="grid grid-cols-2 gap-3 mt-2">
                {TEAM_BLOCKS.map((team, idx) => (
                  <motion.div
                    key={team}
                    initial={{ x: idx % 2 === 0 ? -40 : 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.15 * idx }}
                    className="rounded-md border border-cyan-400/50 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100"
                  >
                    {team}
                  </motion.div>
                ))}
              </div>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 0 }}
                animate={{ opacity: 1, scale: 1, x: [0, -2, 2, -1, 1, 0] }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="mt-4 rounded-lg border border-yellow-300/60 bg-yellow-400/15 px-4 py-3 text-yellow-100 font-semibold text-center shadow-[0_0_24px_rgba(250,204,21,0.35)]"
              >
                Tournament Started
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
