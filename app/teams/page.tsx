'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, Mail, Power, LogOut, Filter, Activity, Target, ChevronLeft, ChevronRight, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { WhoAmIPanel } from '@/components/dashboard/whoami-panel';

const FORMATIONS = ['4-4-2', '4-3-3', '3-5-2'];

const ROSTER = [
   { id: 1, name: "Alex", role: "'Striker'", form: 92, color: "border-[#ff2e88]" },
   { id: 2, name: "Ben", role: "'Mid'", form: 88, color: "border-[#00f0ff]" },
   { id: 3, name: "Chloe", role: "'Def'", form: 90, color: "border-[#00f0ff]" },
   { id: 4, name: "Dan", role: "'GK'", form: 85, color: "border-yellow-400" },
];

const TRANSFERS = [
   { id: 1, name: "Player A", cost: "500 CR", color: "border-[#00f0ff]" },
   { id: 2, name: "Player B", cost: "750 CR", color: "border-[#ff2e88]" },
   { id: 3, name: "Player C", cost: "600 CR", color: "border-[#00f0ff]" },
];

export default function TeamsPage() {
  const [mounted, setMounted] = useState(false);
  const [formationIdx, setFormationIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNextFormation = () => setFormationIdx((i) => (i + 1) % FORMATIONS.length);
  const handlePrevFormation = () => setFormationIdx((i) => (i - 1 + FORMATIONS.length) % FORMATIONS.length);

  // Generates absolutely positioned coordinates for the pitch based on formation string
  const getFormationPositions = (formation: string) => {
     switch (formation) {
        case '4-4-2':
           return [
              { top: '50%', left: '10%', color: '#ffff00', name: 'GK' },
              { top: '20%', left: '30%', color: '#00f0ff', name: 'LB' },
              { top: '40%', left: '25%', color: '#00f0ff', name: 'CB' },
              { top: '60%', left: '25%', color: '#00f0ff', name: 'CB' },
              { top: '80%', left: '30%', color: '#00f0ff', name: 'RB' },
              { top: '20%', left: '55%', color: '#ff2e88', name: 'LM' },
              { top: '40%', left: '50%', color: '#ff2e88', name: 'CM' },
              { top: '60%', left: '50%', color: '#ff2e88', name: 'CM' },
              { top: '80%', left: '55%', color: '#ff2e88', name: 'RM' },
              { top: '35%', left: '80%', color: '#ff2e88', name: 'ST' },
              { top: '65%', left: '80%', color: '#ff2e88', name: 'ST' },
           ];
        case '4-3-3':
           return [
              { top: '50%', left: '10%', color: '#ffff00', name: 'GK' },
              { top: '20%', left: '30%', color: '#00f0ff', name: 'LB' },
              { top: '40%', left: '25%', color: '#00f0ff', name: 'CB' },
              { top: '60%', left: '25%', color: '#00f0ff', name: 'CB' },
              { top: '80%', left: '30%', color: '#00f0ff', name: 'RB' },
              { top: '30%', left: '50%', color: '#ff2e88', name: 'CM' },
              { top: '50%', left: '45%', color: '#ff2e88', name: 'CDM' },
              { top: '70%', left: '50%', color: '#ff2e88', name: 'CM' },
              { top: '25%', left: '75%', color: '#00f0ff', name: 'LW' },
              { top: '50%', left: '85%', color: '#00f0ff', name: 'ST' },
              { top: '75%', left: '75%', color: '#00f0ff', name: 'RW' },
           ];
        case '3-5-2':
           return [
              { top: '50%', left: '10%', color: '#ffff00', name: 'GK' },
              { top: '30%', left: '25%', color: '#00f0ff', name: 'CB' },
              { top: '50%', left: '22%', color: '#00f0ff', name: 'CB' },
              { top: '70%', left: '25%', color: '#00f0ff', name: 'CB' },
              { top: '15%', left: '50%', color: '#ff2e88', name: 'LM' },
              { top: '35%', left: '45%', color: '#ff2e88', name: 'CM' },
              { top: '50%', left: '55%', color: '#ff2e88', name: 'CAM' },
              { top: '65%', left: '45%', color: '#ff2e88', name: 'CM' },
              { top: '85%', left: '50%', color: '#ff2e88', name: 'RM' },
              { top: '40%', left: '80%', color: '#00f0ff', name: 'ST' },
              { top: '60%', left: '80%', color: '#00f0ff', name: 'ST' },
           ];
        default: return [];
     }
  };

  const currentFormation = FORMATIONS[formationIdx];
  const positions = getFormationPositions(currentFormation);

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* subtle grid background exact match */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {/* HEADERBAR */}
      <header className="flex items-center justify-between pt-5 pb-5 px-8 relative z-10 w-full mb-2">
         <div className="flex items-center">
            <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
               <span className="text-[#00f0ff]">KhelSync</span> Team Management Hub
            </h1>
         </div>
         <div className="flex items-center gap-6 text-[#00f0ff]">
            <Link href="/home" className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
               <LayoutGrid className="w-5 h-5" />
            </Link>
            <Mail className="w-5 h-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            <Power className="w-5 h-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            <LogOut className="w-5 h-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
         </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 relative z-10 w-full max-w-[1700px] mx-auto px-6 pb-8">
        
        {/* LEFT COLUMN (DASHBOARD) */}
        <div className="flex-1 flex flex-col gap-5">
           
           {/* ROW 1: CHEMISTRY AND ROSTER GRID */}
           <div className="flex flex-col lg:flex-row gap-5">
              
              {/* CHEMISTRY */}
              <div className="border border-border bg-card/80 p-5 rounded-md shadow-lg backdrop-blur-sm w-full lg:w-[280px] flex flex-col items-center justify-center">
                 <div className="flex items-center gap-2 mb-4 w-full text-foreground font-bold tracking-widest text-[11px] uppercase">
                    <Activity className="w-4 h-4 text-muted-foreground" /> TEAM CHEMISTRY
                 </div>
                 <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#00f0ff" strokeWidth="12" strokeOpacity="0.2" />
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#00f0ff" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="62.8" />
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#ff2e88" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="220" />
                    </svg>
                    <div className="absolute text-3xl font-black text-foreground">85<span className="text-xl">%</span></div>
                 </div>
              </div>

              {/* ROSTER GRID */}
              <div className="border border-border bg-card/80 p-5 rounded-md shadow-lg backdrop-blur-sm flex-1 flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-foreground font-bold tracking-widest text-[11px] uppercase">
                       <LayoutGrid className="w-4 h-4 text-muted-foreground" /> ROSTER GRID
                    </div>
                    <select className="appearance-none bg-transparent border border-border rounded-sm text-xs text-foreground/90 px-3 py-1 focus:outline-none focus:border-[#00f0ff]">
                       <option>4-3-3</option>
                       <option>4-4-2</option>
                       <option>3-5-2</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                    {ROSTER.map((p) => (
                       <div key={p.id} className={`border ${p.color} bg-background rounded-sm p-4 relative flex flex-col justify-between shadow-sm`}>
                          <div className="absolute top-2 right-2 flex gap-0.5"><div className="w-1 h-1 rounded-full bg-muted" /><div className="w-1 h-1 rounded-full bg-muted" /><div className="w-1 h-1 rounded-full bg-muted" /></div>
                          <div className="flex justify-center mb-3">
                             <div className={`w-12 h-12 rounded-full border border-border flex items-center justify-center bg-muted shadow-sm text-[#00f0ff]`}>
                                <UserCircle2 className="w-8 h-8" />
                             </div>
                          </div>
                          <div className="text-center font-bold text-sm text-foreground mb-2">{p.name} <span className="font-normal text-muted-foreground text-xs">{p.role}</span></div>
                          <div className="flex justify-between items-center mt-auto">
                             <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">FORM</div>
                             <div className="w-full mx-2 h-1 bg-muted rounded-full overflow-hidden flex items-center">
                                <div className="h-full bg-[#ff2e88] w-[90%]" />
                             </div>
                             <div className="font-black text-[#00f0ff]">{p.form}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* ROW 2: TACTICAL FORMATION AND TEAM ATTRIBUTES */}
           <div className="flex flex-col lg:flex-row gap-5">
              
              {/* TACTICAL FORMATION */}
               <div className="border border-border bg-card/80 p-5 rounded-md shadow-lg backdrop-blur-sm flex-1 flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-foreground font-bold tracking-widest text-[11px] uppercase">
                       <LayoutGrid className="w-4 h-4 text-muted-foreground" /> TACTICAL FORMATION
                    </div>
                    <div className="flex items-center border border-border rounded-sm overflow-hidden">
                       <button onClick={handlePrevFormation} className="px-2 py-1 text-[#00f0ff] hover:bg-[#00f0ff]/10"><ChevronLeft className="w-4 h-4" /></button>
                       <div className="px-3 py-1 font-mono text-sm text-foreground/80 w-20 text-center">{currentFormation}</div>
                       <button onClick={handleNextFormation} className="px-2 py-1 text-[#00f0ff] hover:bg-[#00f0ff]/10"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                 </div>
                 
                 <div className="relative w-full aspect-[2/1] border-2 border-border bg-background/40 rounded-sm overflow-hidden mt-2">
                    {/* SVG Soccer Pitch */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
                       <rect x="0" y="0" width="100" height="50" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <line x1="50" y1="0" x2="50" y2="50" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <circle cx="50" cy="25" r="8" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <rect x="0" y="10" width="15" height="30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <rect x="85" y="10" width="15" height="30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <path d="M 15 20 Q 20 25 15 30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <path d="M 85 20 Q 80 25 85 30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                    </svg>

                    {/* Active Players plotted based on formation */}
                    {positions.map((pos, idx) => (
                       <div 
                         key={idx} 
                         className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700 ease-out"
                         style={{ top: pos.top, left: pos.left }}
                       >
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-border flex items-center justify-center bg-card shadow-sm`} style={{ color: pos.color, borderColor: pos.color }}>
                            <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="text-[7px] sm:text-[9px] font-bold text-foreground mt-1 uppercase tracking-widest">{pos.name}</div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* TEAM ATTRIBUTES */}
              <div className="border border-border bg-card/80 rounded-md p-5 flex flex-col shadow-lg backdrop-blur-sm w-full lg:w-[320px]">
                 <div className="flex items-center gap-2 mb-2 text-foreground font-bold tracking-widest text-[11px] uppercase">
                    <Target className="w-4 h-4 text-muted-foreground" /> TEAM ATTRIBUTES
                 </div>
                 <div className="relative w-full aspect-square flex flex-col items-center justify-center pb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                       {/* Background Hexagons */}
                       {[20, 40, 60, 80, 100].map(r => (
                          <polygon key={r} points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" className="text-foreground" style={{transformOrigin: '50px 50px', transform: `scale(${r/100})`}} />
                       ))}
                       {/* Spokes */}
                       <line x1="50" y1="50" x2="50" y2="0" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-foreground" />
                       <line x1="50" y1="50" x2="93.3" y2="25" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-foreground" />
                       <line x1="50" y1="50" x2="93.3" y2="75" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-foreground" />
                       <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-foreground" />
                       <line x1="50" y1="50" x2="6.7" y2="75" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-foreground" />
                       <line x1="50" y1="50" x2="6.7" y2="25" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-foreground" />
                       
                       {/* Polygons */}
                       <polygon points="50,15 80,35 75,70 50,85 15,65 20,40" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                       <polygon points="50,25 70,20 85,60 50,75 25,75 35,30" fill="none" stroke="#ff2e88" strokeWidth="1.5" />
                    </svg>
                    
                    {/* Text labels outside the SVG area */}
                    <div className="absolute top-0 text-[10px] text-muted-foreground tracking-widest">Speed</div>
                    <div className="absolute top-[28%] right-[2%] text-[10px] text-muted-foreground tracking-widest">Defense</div>
                    <div className="absolute bottom-[28%] right-[4%] text-[10px] text-muted-foreground tracking-widest">Tactics</div>
                    <div className="absolute bottom-0 text-[10px] text-muted-foreground tracking-widest pb-6">Stamina</div>
                    <div className="absolute bottom-[28%] left-[4%] text-[10px] text-muted-foreground tracking-widest">Agility</div>
                    <div className="absolute top-[28%] left-[4%] text-[10px] text-muted-foreground tracking-widest">Power</div>
                    
                    {/* Legend */}
                    <div className="absolute bottom-[-10px] flex gap-6 text-[10px]">
                       <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#00f0ff]"/> Team Alpha</div>
                       <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#ff2e88]"/> Team Beta</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* ROW 3: TRANSFER MARKET AND ACTIONS */}
           <div className="border border-border bg-card/80 p-5 rounded-md shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 text-foreground font-bold tracking-widest text-[11px] uppercase">
                 <Activity className="w-4 h-4 text-muted-foreground" /> ACTIVE TRANSFER MARKET
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                 <button className="text-muted-foreground hover:text-[#00f0ff] transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {TRANSFERS.map((t) => (
                       <div key={t.id} className={`border border-border bg-background rounded-sm p-4 flex items-center justify-between shadow-sm`}>
                          <div className={`w-12 h-12 rounded-full border border-border flex items-center justify-center bg-muted`}>
                             <UserCircle2 className="w-8 h-8 text-foreground/50" />
                          </div>
                          <div className="text-right">
                             <div className="font-bold text-foreground mb-1.5 text-sm">{t.name}</div>
                             <div className="font-mono font-bold text-[#c9b700] border border-yellow-400/50 bg-yellow-400/10 px-2 py-0.5 rounded-sm shadow-[0_0_10px_rgba(250,204,21,0.2)] dark:text-[#ffff00]">{t.cost}</div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button className="text-[#00f0ff] hover:text-foreground transition-colors"><ChevronRight className="w-6 h-6" /></button>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button className="w-full border border-[#00f0ff] text-foreground hover:bg-[#00f0ff]/10 font-bold tracking-wide text-xs py-3 rounded-sm transition-colors duration-300">
                    Save Lineup
                 </button>
                 <button className="w-full border border-[#00f0ff] text-foreground hover:bg-[#00f0ff]/10 font-bold tracking-wide text-xs py-3 rounded-sm transition-colors duration-300">
                    Export Tactics
                 </button>
                 <button className="w-full border border-[#ff2e88] text-foreground hover:bg-[#ff2e88]/10 font-bold tracking-wide text-xs py-3 rounded-sm transition-colors duration-300 shadow-sm">
                    Simulate Match
                 </button>
              </div>
           </div>

        </div>

        {/* RIGHT SIDEBAR (FILTERS) */}
        <aside className="w-full lg:w-[280px] xl:w-[320px] rounded-xl border border-border bg-card/80 p-6 flex flex-col shadow-lg backdrop-blur-sm relative overflow-hidden h-fit">
           {/* Beautiful Cyan glow at the bottom */}
           <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#00f0ff]/10 to-transparent pointer-events-none" />
           
           <div className="flex items-center gap-2 mb-8 text-foreground font-bold tracking-widest text-[14px] uppercase border-b border-border pb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              FILTERS
           </div>
           
           <div className="flex flex-col gap-6 relative z-10 w-full mb-8">
              {/* Select 1 */}
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] text-muted-foreground font-medium">Position</label>
                 <div className="relative">
                    <select className="w-full appearance-none bg-transparent border border-border rounded-sm text-sm text-foreground/90 p-3 pr-8 focus:outline-none focus:border-[#00f0ff]">
                       <option>Position</option>
                       <option>Forward</option>
                       <option>Midfielder</option>
                       <option>Defender</option>
                    </select>
                    <div className="absolute right-3 top-[14px] pointer-events-none opacity-60">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                 </div>
              </div>

              {/* Select 2 */}
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] text-muted-foreground font-medium">Nationality</label>
                 <div className="relative">
                    <select className="w-full appearance-none bg-transparent border border-border rounded-sm text-sm text-foreground/90 p-3 pr-8 focus:outline-none focus:border-[#00f0ff]">
                       <option>Nationality</option>
                       <option>Europe</option>
                       <option>Asia / Pacific</option>
                       <option>Americas</option>
                    </select>
                    <div className="absolute right-3 top-[14px] pointer-events-none opacity-60">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                 </div>
              </div>

              {/* Select 3 */}
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] text-muted-foreground font-medium">Price Range</label>
                 <div className="relative">
                    <select className="w-full appearance-none bg-transparent border border-border rounded-sm text-sm text-foreground/90 p-3 pr-8 focus:outline-none focus:border-[#00f0ff]">
                       <option>Price Range</option>
                       <option>100 - 500 CR</option>
                       <option>500 - 1000 CR</option>
                    </select>
                    <div className="absolute right-3 top-[14px] pointer-events-none opacity-60">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                 </div>
              </div>
           </div>

           {/* Filter Mini Pitch */}
           <div className="relative w-full aspect-[2/1] border-2 border-border bg-background/20 rounded-sm overflow-hidden flex items-center justify-center opacity-80 pointer-events-none">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
                 <rect x="0" y="0" width="100" height="50" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                 <line x1="50" y1="0" x2="50" y2="50" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                 <circle cx="50" cy="25" r="8" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                 <rect x="0" y="10" width="15" height="30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                 <rect x="85" y="10" width="15" height="30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                 <path d="M 15 20 Q 20 25 15 30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                 <path d="M 85 20 Q 80 25 85 30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
              </svg>
           </div>
        </aside>

      </div>
    </main>
  );
}
