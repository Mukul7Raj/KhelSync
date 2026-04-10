'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCard } from './PlayerCard';
import { Timer } from './Timer';
import { BidPanel } from './BidPanel';
import { Trophy, Activity, History, Zap, Sparkles } from 'lucide-react';

const MOCK_PLAYERS = [
  {
    id: 'p1',
    name: 'Shadow_Ninja',
    role: 'Duelist / Entry',
    stats: { totalPoints: 1250, kdr: '1.42', winRate: '68%' }
  },
  {
    id: 'p2',
    name: 'Cyber_Oracle',
    role: 'Controller / Support',
    stats: { totalPoints: 980, kdr: '1.05', winRate: '72%' }
  },
  {
    id: 'p3',
    name: 'Void_Reaper',
    role: 'Sentinel / Defense',
    stats: { totalPoints: 1100, kdr: '1.28', winRate: '64%' }
  }
];

const MOCK_TEAMS = [
  { id: 't1', name: 'NEON_DRAGONS', budget: 50000, remaining: 50000, playersBought: 0 },
  { id: 't2', name: 'VOID_WALKERS', budget: 45000, remaining: 45000, playersBought: 0 },
  { id: 't3', name: 'CYBER_PUNKS', budget: 55000, remaining: 55000, playersBought: 0 }
];

export function AuctionArena() {
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [currentBid, setCurrentBid] = useState(1000);
  const [lastBidderId, setLastBidderId] = useState<string | null>(null);
  const [isSold, setIsSold] = useState(false);
  const [teams, setTeams] = useState(MOCK_TEAMS);
  const [bidHistory, setBidHistory] = useState<{ teamName: string; amount: number; time: string }[]>([]);
  const [showSoldAnimation, setShowSoldAnimation] = useState(false);
  const [floatingBid, setFloatingBid] = useState<{ id: number; amount: string }[]>([]);
  const [flash, setFlash] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const currentPlayer = MOCK_PLAYERS[currentPlayerIdx];

  const handleBid = useCallback((teamId: string) => {
    if (isSold) return;

    const bidIncrement = 500;
    const newBid = currentBid + bidIncrement;
    const team = teams.find(t => t.id === teamId);

    if (team && team.remaining >= newBid) {
      setCurrentBid(newBid);
      setLastBidderId(teamId);
      setTimerKey(prev => prev + 1);

      // Floating & Flash animation trigger
      setFlash(true);
      setTimeout(() => setFlash(false), 200);

      const id = Date.now();
      setFloatingBid(prev => [...prev, { id, amount: `+₹${bidIncrement}` }]);
      setTimeout(() => setFloatingBid(prev => prev.filter(b => b.id !== id)), 1000);

      const now = new Date();
      setBidHistory(prev => [{
        teamName: team.name,
        amount: newBid,
        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      }, ...prev].slice(0, 5));
    }
  }, [currentBid, isSold, teams]);

  const handleTimeUp = useCallback(() => {
    if (lastBidderId) {
      setIsSold(true);
      setShowSoldAnimation(true);

      // Update team stats
      const winningTeam = teams.find(t => t.id === lastBidderId);
      if (winningTeam) {
        setTeams(prev => prev.map(t =>
          t.id === lastBidderId
            ? { ...t, remaining: t.remaining - currentBid, playersBought: t.playersBought + 1 }
            : t
        ));
      }

      // Next player after 5 seconds
      setTimeout(() => {
        setCurrentPlayerIdx(prev => prev + 1);
        setCurrentBid(1000);
        setLastBidderId(null);
        setIsSold(false);
        setShowSoldAnimation(false);
      }, 5000);
    } else {
      // Unsold logic?
      setIsSold(true);
      setTimeout(() => {
        setCurrentPlayerIdx(prev => prev + 1);
        setCurrentBid(1000);
        setLastBidderId(null);
        setIsSold(false);
      }, 3000);
    }
  }, [currentBid, currentPlayerIdx, lastBidderId, teams]);

  if (!currentPlayer) {
    return (
      <div className="w-full flex flex-col gap-8 items-center justify-center p-4 md:p-8 bg-[#0a0220] min-h-[800px] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00f0ff]/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter shadow-cyan-500/50 relative z-10 text-center">
          Auction <span className="text-[#00f0ff]">Completed</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10 mt-8">
          {teams.map(t => (
            <div key={t.id} className="cyber-panel p-6 bg-black/60 border border-[#00f0ff]/20">
              <h3 className="text-2xl font-bold text-[#00f0ff] uppercase italic tracking-tighter mb-6">{t.name}</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-white/5 pb-2"><span className="text-white/50 uppercase">Players Acquired</span><span className="text-white font-bold">{t.playersBought}</span></div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2"><span className="text-white/50 uppercase">Total Spent</span><span className="text-[#ff2e88] font-bold">₹{t.budget - t.remaining}</span></div>
                <div className="flex justify-between items-center pt-2"><span className="text-emerald-400 uppercase">Remaining Budget</span><span className="text-emerald-400 font-black text-lg">₹{t.remaining}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 p-4 md:p-8 bg-[#0a0220] min-h-[800px] relative overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00f0ff]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-50 shadow-[inset_0_0_100px_white]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end relative z-10 border-b border-[#00f0ff]/20 pb-4">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter shadow-cyan-500/50">
            Auction <span className="text-[#00f0ff]">Arena</span>
          </h1>
          <div className="text-[10px] font-mono text-[#00f0ff]/50 uppercase tracking-[0.4em]">Live_Transmission_Active</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Session #882
          </div>
          <div className="text-2xl font-black text-white italic">STAGE {currentPlayerIdx + 1}/{MOCK_PLAYERS.length}</div>
        </div>
      </div>

      {/* MAIN ARENA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

        {/* LEFT: PLAYER CARD */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <PlayerCard key={currentPlayer.id} player={currentPlayer} />
          </AnimatePresence>

          {/* HISTORY MINI PANEL */}
          <div className="cyber-panel p-4 bg-black/40 border-white/5">
            <div className="flex items-center gap-2 mb-3 text-[10px] text-white/40 uppercase font-mono tracking-widest">
              <History className="w-3 h-3" /> Bid History
            </div>
            <div className="space-y-2">
              {bidHistory.length > 0 ? bidHistory.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-mono border-l-2 border-[#00f0ff]/20 pl-2">
                  <span className="text-white/60">{h.teamName}</span>
                  <span className="text-[#00f0ff]">₹{h.amount}</span>
                </div>
              )) : (
                <div className="text-[10px] text-white/20 uppercase font-mono italic">Awaiting first bid...</div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER: PRICE & TIMER */}
        <div className="flex flex-col items-center justify-center gap-12 order-1 lg:order-2 py-8 lg:py-0">
          <Timer key={`${currentPlayer.id}-${timerKey}`} initialTime={lastBidderId ? 10 : 20} onTimeUp={handleTimeUp} />

          <div className="relative group">
            <div className="text-[10px] text-center text-[#ff2e88] uppercase tracking-[0.5em] font-mono mb-2">Current Bid</div>
            <motion.div
              key={currentBid}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="text-8xl md:text-9xl font-black text-white italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                ₹{currentBid}
              </div>
              {/* Floating animations */}
              <AnimatePresence>
                {floatingBid.map(bid => (
                  <motion.div
                    key={bid.id}
                    initial={{ y: 0, opacity: 1, scale: 0.5 }}
                    animate={{ y: -100, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-0 right-0 text-3xl font-black text-emerald-400 italic pointer-events-none"
                  >
                    {bid.amount}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="flex flex-col items-center gap-1 mt-4">
              <div className="text-[10px] text-[#00f0ff]/60 uppercase tracking-widest font-mono">Last Bidder</div>
              <div className="text-xl font-bold text-[#00f0ff] uppercase tracking-tighter italic">
                {lastBidderId ? teams.find(t => t.id === lastBidderId)?.name : 'NO_BIDS'}
              </div>
            </div>

            {/* Central Glow */}
            <div className="absolute inset-0 bg-[#00f0ff]/10 blur-[60px] rounded-full scale-150 -z-10 group-hover:bg-[#ff2e88]/10 transition-colors" />
          </div>
        </div>

        {/* RIGHT: TEAMS PANEL */}
        <div className="order-3">
          <BidPanel
            teams={teams}
            onBid={handleBid}
            currentBid={currentBid}
            lastBidderId={lastBidderId}
            canBid={!isSold}
          />
        </div>

      </div>

      {/* SOLD MODAL / OVERLAY */}
      <AnimatePresence>
        {showSoldAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative"
              >
                <div className="text-[10vw] font-black italic text-white uppercase tracking-tighter glitch-text z-10 relative" data-text="SOLD!!">
                  SOLD!!
                </div>
                <div className="absolute inset-0 bg-[#ff2e88] blur-[100px] opacity-50 z-0 scale-150" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <div className="text-[#00f0ff] text-xl uppercase tracking-[0.5em] font-mono mb-2">Transferred to</div>
                <div className="text-4xl font-black text-white italic uppercase tracking-tighter border-y border-[#00f0ff]/30 py-4 px-12">
                  {teams.find(t => t.id === lastBidderId)?.name}
                </div>
                <div className="mt-4 text-emerald-400 font-bold text-2xl">₹{currentBid}</div>
              </motion.div>

              {/* Confetti Simulated */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#00f0ff]"
                    initial={{ top: '50%', left: '50%', opacity: 1 }}
                    animate={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: 0,
                      rotate: 360,
                      scale: 0.5
                    }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{
                      backgroundColor: i % 2 === 0 ? '#00f0ff' : '#ff2e88',
                      boxShadow: `0 0 10px ${i % 2 === 0 ? '#00f0ff' : '#ff2e88'}`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER DECORATION */}
      <div className="mt-auto pt-8 border-t border-white/5 flex flex-wrap gap-8 justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 border border-[#00f0ff]/30 px-3 py-1 bg-[#00f0ff]/5">
            <Zap className="w-3 h-3 text-[#00f0ff]" />
            <span className="text-[9px] font-mono text-white/50 uppercase">Network Stability: 99.9%</span>
          </div>
          <div className="flex items-center gap-1.5 border border-white/10 px-3 py-1 bg-white/5">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span className="text-[9px] font-mono text-white/50 uppercase">Premium Stream Activated</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          KheSync_Auction_Subsystem // Port_8080 // Build_4.1.2
        </div>
      </div>
    </div>
  );
}
