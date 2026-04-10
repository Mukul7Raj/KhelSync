'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Target, Zap } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  role: string;
  photo?: string;
  stats: {
    totalPoints: number;
    kdr: string;
    winRate: string;
  };
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="cyber-panel p-6 w-full max-w-md bg-black/40 backdrop-blur-xl border-2 border-[#00f0ff]/50 relative"
    >
      <div className="absolute top-0 right-0 p-2">
         <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-1 text-[10px] text-[#00f0ff] uppercase tracking-widest font-mono">
            ID: {player.id.slice(0, 8)}
         </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 border-2 border-[#00f0ff] p-1 bg-black relative mb-4 group">
          <div className="w-full h-full bg-[#00f0ff]/20 flex items-center justify-center relative overflow-hidden">
             {player.photo ? (
               <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
             ) : (
               <User className="w-16 h-16 text-[#00f0ff]" />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute -inset-2 border border-[#ff2e88]/30 scale-105 pointer-events-none group-hover:scale-110 transition-transform" />
        </div>
        
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter glitch-text" data-text={player.name}>
          {player.name}
        </h2>
        <div className="text-[10px] text-[#00f0ff] uppercase tracking-[0.3em] font-mono mt-1">
          {player.role}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/10 p-3 text-center">
          <div className="text-[8px] uppercase text-white/40 mb-1 flex items-center justify-center gap-1">
            <Zap className="w-2.5 h-2.5" /> Points
          </div>
          <div className="text-sm font-bold text-white">{player.stats.totalPoints}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-3 text-center">
          <div className="text-[8px] uppercase text-white/40 mb-1 flex items-center justify-center gap-1">
            <Target className="w-2.5 h-2.5" /> KDR
          </div>
          <div className="text-sm font-bold text-white">{player.stats.kdr}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-3 text-center">
          <div className="text-[8px] uppercase text-white/40 mb-1 flex items-center justify-center gap-1">
            <Shield className="w-2.5 h-2.5" /> WR
          </div>
          <div className="text-sm font-bold text-white">{player.stats.winRate}</div>
        </div>
      </div>
      
      <div className="mt-6 border-t border-white/10 pt-4">
         <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-widest">
            <span>Status</span>
            <span className="text-emerald-400">Available</span>
         </div>
      </div>
    </motion.div>
  );
}
