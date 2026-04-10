'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users, Trophy } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  budget: number;
  remaining: number;
  playersBought: number;
}

export function BidPanel({ 
  teams, 
  onBid, 
  currentBid, 
  lastBidderId,
  canBid 
}: { 
  teams: Team[]; 
  onBid: (teamId: string) => void;
  currentBid: number;
  lastBidderId: string | null;
  canBid: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
        <Users className="w-4 h-4 text-[#00f0ff]" />
        <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-mono">Bidding Teams</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 max-h-[400px]">
        {teams.map((team) => {
          const isCurrentBidder = team.id === lastBidderId;
          const isBroke = team.remaining < currentBid + 500;

          return (
            <motion.div
              key={team.id}
              layout
              className={`relative p-4 border ${isCurrentBidder ? 'border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/10 bg-black/40'} group transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-tight">{team.name}</div>
                  <div className="text-[8px] text-white/40 uppercase font-mono">Squad: {team.playersBought} players</div>
                </div>
                <div className="text-right">
                   <div className={`text-sm font-mono font-bold ${isBroke ? 'text-[#ff2e88]' : 'text-emerald-400'}`}>
                     ₹{(team.remaining / 1000).toFixed(1)}K
                   </div>
                   <div className="text-[8px] text-white/40 uppercase font-mono">Budget</div>
                </div>
              </div>

              {/* Progress bar of budget */}
              <div className="h-1 bg-white/5 w-full relative overflow-hidden">
                 <motion.div 
                   className={`absolute top-0 left-0 h-full ${isBroke ? 'bg-[#ff2e88]' : 'bg-[#00f0ff]'}`}
                   initial={{ width: '100%' }}
                   animate={{ width: `${(team.remaining / team.budget) * 100}%` }}
                 />
              </div>

              {/* Bid Button for this team (if we are simulating specific team actions or acting as that team) */}
              <button
                disabled={!canBid || isBroke || isCurrentBidder}
                onClick={() => onBid(team.id)}
                className={`mt-3 w-full py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300
                  ${isCurrentBidder ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]' : 
                    isBroke ? 'border-red-500/30 text-red-500/50 cursor-not-allowed' :
                    'border-white/20 text-white/60 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#00f0ff]/5'}
                `}
              >
                {isCurrentBidder ? 'Winning Bid' : isBroke ? 'Insufficient Funds' : `Bid ₹${(currentBid + 500)}`}
              </button>
              
              {isCurrentBidder && (
                <div className="absolute -top-1 -right-1">
                   <Trophy className="w-4 h-4 text-yellow-500 animate-bounce" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-[#ff2e88]/10 border border-[#ff2e88]/20 text-center">
         <div className="text-[10px] text-[#ff2e88]/80 uppercase font-mono tracking-widest">Global Warning</div>
         <div className="text-[9px] text-[#ff2e88]/60 mt-1">REAL-TIME SYNC ACTIVE. ALL BIDS ARE FINAL.</div>
      </div>
    </div>
  );
}
