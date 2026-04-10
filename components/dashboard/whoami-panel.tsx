'use client';

import { Trophy } from 'lucide-react';

export function WhoAmIPanel() {
  const leaderboard = [
    { rank: 1, name: "Player", score: 200, isCurrentUser: true, icon: "A" },
    { rank: 2, name: "Hamnoms'", score: 150, isCurrentUser: false, icon: "B" },
    { rank: 3, name: "Engharleve", score: 130, isCurrentUser: false, icon: "C" },
    { rank: 4, name: "PlayerEC", score: 100, isCurrentUser: false, icon: "D" },
    { rank: 5, name: "Norghyn", score: 75, isCurrentUser: false, icon: "E" },
    { rank: 6, name: "Team Auction", score: 70, isCurrentUser: false, icon: "F" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card/80 p-5 backdrop-blur-md flex flex-col font-sans shadow-lg">
      <div className="flex items-center gap-2 mb-6 text-foreground font-bold tracking-widest text-[12px] uppercase">
        <Trophy className="w-4 h-4 text-muted-foreground" />
        REAL-TIME LEADERBOARD
      </div>

      <div className="w-full text-xs">
        <div className="flex justify-between items-center text-[9px] text-muted-foreground tracking-widest font-semibold uppercase px-4 pb-2 border-b border-border mb-2">
           <div className="w-4 text-left">#</div>
           <div className="flex-1 text-left ml-4">PLAYER</div>
           <div className="text-right">SCORE</div>
        </div>
        
        <div className="flex flex-col gap-1">
           {leaderboard.map((p) => (
             <div 
               key={p.rank} 
               className={`flex items-center px-4 py-2.5 rounded-sm ${p.isCurrentUser ? 'bg-accent/10 border-l-2 border-[#00f0ff]' : 'border-l-2 border-transparent hover:bg-accent/5 transition-colors'}`}
             >
                <div className={`w-4 text-left font-mono tracking-wider ${p.isCurrentUser ? 'text-[#00f0ff] font-bold' : 'text-muted-foreground'}`}>
                   {p.rank}
                </div>
                <div className="flex-1 flex items-center gap-3 ml-4">
                   <img 
                     src={`https://api.dicebear.com/7.x/identicon/svg?seed=${p.icon}&backgroundColor=transparent`} 
                     alt="" 
                     className="w-6 h-6 rounded-full bg-muted p-0.5 border border-border" 
                   />
                   <span className={`${p.isCurrentUser ? 'text-[#00f0ff] font-semibold' : 'text-foreground/80'}`}>
                     {p.name}
                   </span>
                </div>
                <div className={`text-right font-mono tracking-wider ${p.isCurrentUser ? 'text-[#00f0ff] font-bold' : 'text-muted-foreground'}`}>
                   {p.score}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
