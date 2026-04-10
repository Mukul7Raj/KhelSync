'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { CheckCircle2, ClipboardCheck, ShieldCheck, UserPlus } from 'lucide-react';
import { useEffect } from 'react';

const STAGES = [
  { id: 'registration', label: 'Registration', icon: UserPlus },
  { id: 'verification', label: 'Verification', icon: ShieldCheck },
  { id: 'allocation', label: 'Team Allocation', icon: ClipboardCheck },
  { id: 'entry', label: 'Tournament Entry', icon: CheckCircle2 },
];

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function JoinAnimation({
  open,
  onComplete,
}: {
  open: boolean;
  onComplete: () => void;
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!open) return;
    let mounted = true;

    const run = async () => {
      for (let i = 0; i < STAGES.length; i += 1) {
        await controls.start({
          left: `${6 + i * 29}%`,
          transition: { duration: 0.6, ease: 'easeInOut' },
        });
        await wait(190);
        if (!mounted) return;
      }
      onComplete();
    };

    run();
    return () => {
      mounted = false;
    };
  }, [open, controls, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#050510]/95 backdrop-blur-md p-6 flex items-center justify-center"
        >
          <div className="w-full max-w-4xl rounded-xl border border-cyan-400/50 bg-slate-950/70 p-6 shadow-[0_0_35px_rgba(0,240,255,0.2)]">
            <p className="text-cyan-100 text-sm mb-6">Joining Tournament Journey</p>
            <div className="relative rounded-lg border border-cyan-500/40 px-3 py-8 bg-slate-900/60 overflow-hidden">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-300 to-fuchsia-500/20" />
              <motion.div
                animate={controls}
                initial={{ left: '6%' }}
                className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.85)]"
              >
                <div className="absolute inset-0 rounded-full bg-cyan-300/70 blur-md" />
              </motion.div>

              <div className="relative z-10 grid grid-cols-4 gap-3">
                {STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: 'easeInOut', delay: idx * 0.15 }}
                      className="text-center"
                    >
                      <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-cyan-400/60 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_16px_rgba(0,240,255,0.25)]">
                        <Icon className="h-4 w-4 text-cyan-200" />
                      </div>
                      <p className="text-xs text-cyan-100">{stage.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
