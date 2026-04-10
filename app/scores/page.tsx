'use client';

import { useEffect, useState } from 'react';
import { SettingsPanel } from '@/components/dashboard/settings-panel';
import { WhoAmIPanel } from '@/components/dashboard/whoami-panel';
import { LayoutGrid, Mail, Power, LogOut, Trophy, Gavel, Clock, Users, BarChart2, HelpCircle, MonitorPlay } from 'lucide-react';
import Link from 'next/link';

// Detailed Mock Fixtures with hidden "live" data to power the HUD
const MOCK_FIXTURES = [
   { id: 1, t1: "Team 1", t2: "Team Alpha", time: "18:00", s1: "A", s2: "B", scoreT1: 25, scoreT2: 12, players: 96, kd: 1.10, econ: 25000 },
   { id: 2, t1: "Team 8", t2: "Radiant", time: "15:00", s1: "C", s2: "D", scoreT1: 14, scoreT2: 14, players: 84, kd: 0.95, econ: 18500 },
   { id: 3, t1: "Cloud9", t2: "Liquid", time: "19:00", s1: "E", s2: "F", scoreT1: 3, scoreT2: 7, players: 100, kd: 1.50, econ: 12000 },
   { id: 4, t1: "Fnatic", t2: "G2", time: "18:00", s1: "G", s2: "H", scoreT1: 0, scoreT2: 0, players: 100, kd: 1.0, econ: 5000 },
   { id: 5, t1: "Navi", t2: "Vitality", time: "19:00", s1: "I", s2: "J", scoreT1: 18, scoreT2: 21, players: 43, kd: 0.8, econ: 34000 },
   { id: 6, t1: "Faze", t2: "Astralis", time: "19:00", s1: "K", s2: "L", scoreT1: 10, scoreT2: 5, players: 67, kd: 1.25, econ: 19400 },
   { id: 7, t1: "Sentinels", t2: "100T", time: "19:00", s1: "M", s2: "N", scoreT1: 12, scoreT2: 12, players: 90, kd: 1.05, econ: 22000 },
   { id: 8, t1: "T1", t2: "Gen.G", time: "19:00", s1: "O", s2: "P", scoreT1: 2, scoreT2: 0, players: 98, kd: 1.8, econ: 8000 },
   { id: 9, t1: "DRX", t2: "Paper Rex", time: "19:00", s1: "Q", s2: "R", scoreT1: 30, scoreT2: 28, players: 12, kd: 0.9, econ: 45000 },
];

export default function ScoresPage() {
  const [mounted, setMounted] = useState(false);
  const [uptime, setUptime] = useState(0); 
  const [activeMatchData, setActiveMatchData] = useState(MOCK_FIXTURES[0]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
       setUptime(prev => prev + 1);
       // Sporadically update the score of the currently viewed match
       if (Math.random() > 0.8) {
          setActiveMatchData(prev => ({
             ...prev,
             scoreT1: prev.scoreT1 + (Math.random() > 0.5 ? 1 : 0),
             scoreT2: prev.scoreT2 + (Math.random() > 0.5 ? 1 : 0),
             econ: prev.econ + Math.floor(Math.random() * 500)
          }));
       }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
     const h = Math.floor(seconds / 3600);
     const m = Math.floor((seconds % 3600) / 60);
     const s = seconds % 60;
     return `012:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {/* HEADERBAR */}
      <header className="flex items-center justify-between pt-5 pb-5 px-8 relative z-10 w-full mb-2">
         <div className="flex items-center">
            <h1 className="text-2xl font-semibold tracking-wide">
               <span className="text-[#00f0ff]">KhelSync</span> Management Dashboard
            </h1>
         </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 relative z-10 w-full max-w-[1700px] mx-auto px-6 pb-8">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-56 hidden xl:flex flex-col pr-4 border-r border-border">
           <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-3 h-3 bg-[#ff2e88] rounded-full shadow-[0_0_10px_#ff2e88]" />
              <div>
                 <div className="text-[#ff2e88] font-bold tracking-wider text-sm uppercase">NODE_ID: 77-B</div>
                 <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Status: Encrypted</div>
              </div>
           </div>
           
           <nav className="flex flex-col gap-2 w-full">
              <Link href="/tournaments" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-4 border-transparent hover:bg-accent/10">
                <Trophy className="w-[18px] h-[18px]" /> Tournaments
              </Link>
              <Link href="/auction" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-4 border-transparent hover:bg-accent/10">
                <Gavel className="w-[18px] h-[18px]" /> Player Auction
              </Link>
              
              <Link href="/scores" className="flex items-center gap-3 p-3 bg-accent/20 border-l-4 border-[#00f0ff] text-[#00f0ff] text-[13px] font-medium tracking-wide">
                <Clock className="w-[18px] h-[18px]" /> Live Scores
              </Link>
              
              <Link href="/teams" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-4 border-transparent hover:bg-accent/10">
                <Users className="w-[18px] h-[18px]" /> Team Management
              </Link>
              <Link href="/analytics" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-4 border-transparent hover:bg-accent/10">
                <BarChart2 className="w-[18px] h-[18px]" /> Analytics
              </Link>
              <Link href="/live-match" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-4 border-transparent hover:bg-accent/10">
                <MonitorPlay className="w-[18px] h-[18px]" /> Fan Live Match
              </Link>
           </nav>
        </aside>

        {/* CENTER CONTENT */}
        <div className="flex-1 flex flex-col gap-6">
           
           {/* LIVE STREAM SECTION */}
           <div className="rounded-md border border-border bg-card overflow-hidden w-full shadow-xl">
              <div className="w-full h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
                 <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                 </div>
                 <MonitorPlay className="w-4 h-4 text-muted-foreground" />
                 <span className="text-[10px] text-foreground/70 font-semibold tracking-wider ml-1 uppercase">LIVE STREAM - {activeMatchData.t1} VS {activeMatchData.t2}</span>
                 <span className="ml-auto text-[10px] text-[#00f0ff]/70 font-mono tracking-widest lowercase">uptime: {mounted ? formatUptime(uptime) : "..."}</span>
              </div>
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                 <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070" 
                    alt="Esports Live Stream" 
                    className="w-full h-full object-cover opacity-80"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90 pointer-events-none" />
                 
                 {/* HUD Overlay linked to state */}
                 <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-end pointer-events-none gap-4">
                    
                    {/* Exact TEAM PERF Box Match */}
                    <div className="bg-black/80 backdrop-blur-md border border-border p-4 w-48 shadow-lg hidden md:block">
                       <div className="font-bold text-foreground/60 mb-3 border-b border-border pb-2 text-[9px] tracking-widest uppercase">{activeMatchData.t1} PERF</div>
                       <div className="space-y-2 text-[10px]">
                          <div className="flex justify-between items-center"><span className="text-[#00f0ff] font-bold">Player</span><span className="font-bold text-foreground/90">{Math.floor(activeMatchData.scoreT1 * 1.5)}/10</span></div>
                          <div className="flex justify-between items-center"><span className="text-muted-foreground font-bold">R10b</span><span className="font-bold text-foreground/90">{Math.floor(activeMatchData.scoreT1)}/8</span></div>
                       </div>
                    </div>
                    
                    {/* Exact LIVE SCORE Box Match */}
                    <div className="bg-black/80 backdrop-blur-md border border-[#ff2e88]/30 py-3 px-8 shadow-lg flex gap-10 transform transition-all duration-300">
                       <div className="flex flex-col items-center">
                          <div className="text-[8px] text-muted-foreground tracking-widest mb-1.5 font-bold uppercase">PLAYERS</div>
                          <div className="text-xl font-black text-[#ff2e88]">{activeMatchData.players}</div>
                       </div>
                       <div className="flex flex-col items-center border-l border-r border-[#ff2e88]/20 px-8">
                          <div className="text-[8px] text-[#00f0ff] tracking-widest mb-1.5 font-bold uppercase">LIVE SCORE</div>
                          <div className="text-xl font-black text-[#00f0ff] tracking-widest">
                             {activeMatchData.scoreT1} <span className="text-foreground/30 text-sm">:</span> {activeMatchData.scoreT2}
                          </div>
                       </div>
                       <div className="flex flex-col items-center">
                          <div className="text-[8px] text-muted-foreground tracking-widest mb-1.5 font-bold uppercase">K/D AVG</div>
                          <div className="text-xl font-black text-foreground">{activeMatchData.kd.toFixed(2)}</div>
                       </div>
                       <div className="flex flex-col items-center ml-2 border-l border-border pl-8">
                          <div className="text-[8px] text-muted-foreground tracking-widest mb-1.5 font-bold uppercase">ECON</div>
                          <div className="text-xl font-black text-[#00f0ff]">{Math.floor(activeMatchData.econ / 1000)}k</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* UPCOMING MATCH FIXTURES (EXACT VISUALS) */}
           <div className="rounded-md border border-border bg-card/80 p-6 flex-1 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold tracking-widest text-[11px] uppercase">
                 <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                 UPCOMING MATCH FIXTURES
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {MOCK_FIXTURES.map((match) => {
                    const isActive = activeMatchData.id === match.id;
                    return (
                       <div 
                          key={match.id} 
                          onClick={() => setActiveMatchData(match)}
                          className={`bg-background py-5 px-6 transition-colors flex justify-between items-center cursor-pointer group shadow-sm border-t ${
                             isActive ? 'border-t-2 border-[#00f0ff] bg-accent/5' : 'border-border hover:bg-accent/5'
                          }`}
                       >
                          <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${match.s1}&backgroundColor=transparent`} className={`w-8 h-8 transition-opacity drop-shadow-md ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} alt="" />
                          <div className={`font-mono text-sm font-bold tracking-widest ${isActive ? 'text-[#00f0ff]' : 'text-foreground/80'}`}>
                             {isActive ? 'LIVE' : match.time}
                          </div>
                          <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${match.s2}&backgroundColor=transparent`} className={`w-8 h-8 transition-opacity drop-shadow-md ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} alt="" />
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full xl:w-[320px] flex flex-col gap-6 pt-0">
           <WhoAmIPanel />
           <SettingsPanel />
        </aside>

      </div>
    </main>
  );
}
