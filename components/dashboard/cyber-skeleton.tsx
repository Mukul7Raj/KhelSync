'use client';

import { motion } from 'framer-motion';

export function CyberSkeleton({ className }: { className?: string }) {
  return (
    <div className={`cyber-panel overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-black/40 z-10" />
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-full h-full flex flex-col gap-4 p-4"
      >
        <div className="h-6 w-1/3 bg-[#00f0ff]/20 rounded-sm" />
        <div className="flex-1 w-full bg-[#00f0ff]/10 rounded-sm" />
        <div className="h-10 w-full bg-[#00f0ff]/20 mt-auto rounded-sm" />
      </motion.div>
      {/* GLITCH OVERLAY */}
      <motion.div
        animate={{
          opacity: [0, 0.5, 0],
          top: ['-100%', '100%'],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 2,
        }}
        className="absolute inset-0 bg-white/5 z-20"
      />
    </div>
  );
}
