'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, Mail, Power, LogOut, Filter, Activity, Target } from 'lucide-react';
import Link from 'next/link';
import { WhoAmIPanel } from '@/components/dashboard/whoami-panel';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* subtle grid background exact match */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {/* HEADERBAR */}
      <header className="flex items-center justify-between pt-5 pb-5 px-8 relative z-10 w-full mb-2">
         <div className="flex items-center">
            <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
               <span className="text-[#00f0ff]">KhelSync</span> Analytics Portal
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
        <div className="flex-1 flex flex-col gap-6">
           
           {/* KPI CARDS ROW */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-[#00f0ff] p-4 bg-card/60 flex flex-col justify-center items-center rounded-sm shadow-sm">
                 <div className="text-[12px] text-muted-foreground mb-1">Total Matches Played</div>
                 <div className="text-4xl font-black text-[#00f0ff]">142</div>
              </div>
              <div className="border border-[#ff2e88] p-4 bg-card/60 flex flex-col justify-center items-center rounded-sm shadow-sm">
                 <div className="text-[12px] text-muted-foreground mb-1">Tournament Win Rate</div>
                 <div className="text-4xl font-black text-[#ff2e88]">68%</div>
              </div>
              <div className="border border-[#00f0ff] p-4 bg-card/60 flex flex-col justify-center items-center rounded-sm shadow-sm">
                 <div className="text-[12px] text-muted-foreground mb-1">Avg Goals Per Game</div>
                 <div className="text-4xl font-black text-[#00f0ff]">2.5</div>
              </div>
              <div className="border border-yellow-400 p-4 bg-card/60 flex flex-col justify-center items-center rounded-sm shadow-sm">
                 <div className="text-[12px] text-muted-foreground mb-1">Player Efficiency</div>
                 <div className="text-4xl font-black text-[#c9b700] dark:text-yellow-400">89%</div>
              </div>
           </div>

           {/* MIDDLE ROW (HEATMAP + SPIDER CHART) */}
           <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
              
              {/* HEATMAP VISUALIZATION */}
              <div className="border border-border bg-card/80 rounded-md p-4 flex flex-col shadow-lg backdrop-blur-sm">
                 <div className="flex items-center gap-2 mb-4 text-foreground font-bold tracking-widest text-[12px] uppercase">
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                    HEATMAP VISUALIZATION
                 </div>
                 <div className="relative w-full aspect-[2/1] border-2 border-border bg-background/40 rounded-sm overflow-hidden flex items-center justify-center">
                    {/* SVG Field Lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
                       <rect x="0" y="0" width="100" height="50" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <line x1="50" y1="0" x2="50" y2="50" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <circle cx="50" cy="25" r="8" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <rect x="0" y="10" width="15" height="30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <rect x="85" y="10" width="15" height="30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <path d="M 15 20 Q 20 25 15 30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                       <path d="M 85 20 Q 80 25 85 30" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5" />
                    </svg>
                    
                    {/* Glowing Hotspots */}
                    <div className="absolute left-[10%] top-[40%] w-16 h-16 bg-[#ff2e88] rounded-full blur-xl opacity-60" />
                    <div className="absolute right-[10%] top-[40%] w-16 h-16 bg-yellow-400 rounded-full blur-xl opacity-60" />
                    <div className="absolute left-[25%] top-[20%] w-12 h-12 bg-[#00f0ff] rounded-full blur-xl opacity-70" />
                    <div className="absolute left-[25%] bottom-[20%] w-12 h-12 bg-[#ff2e88] rounded-full blur-xl opacity-70" />
                    <div className="absolute left-[45%] top-[40%] w-16 h-16 bg-[#ff2e88] rounded-full blur-2xl opacity-70" />
                    <div className="absolute right-[25%] top-[15%] w-20 h-10 bg-yellow-400 rounded-full blur-xl opacity-60" />
                    <div className="absolute right-[25%] bottom-[15%] w-20 h-10 bg-[#ff2e88] rounded-full blur-xl opacity-60" />
                    <div className="absolute right-[35%] top-[40%] w-12 h-12 bg-[#00f0ff] rounded-full blur-xl opacity-50" />
                 </div>
              </div>

              {/* SPIDER CHART */}
              <div className="border border-border bg-card/80 rounded-md p-4 flex flex-col shadow-lg backdrop-blur-sm">
                 <div className="flex items-center gap-2 mb-2 text-foreground font-bold tracking-widest text-[12px] uppercase">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    SPIDER CHART
                 </div>
                 <div className="relative w-full aspect-square flex flex-col items-center justify-center p-4">
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
                    <div className="absolute bottom-0 flex gap-6 text-[10px]">
                       <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#00f0ff]"/> Team Alpha</div>
                       <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#ff2e88]"/> Team Beta</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* BOTTOM ROW (PERFORMANCE TIMELINE) */}
           <div className="border border-border bg-card/80 rounded-md p-4 flex flex-col shadow-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2 text-foreground font-bold tracking-widest text-[12px] uppercase">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    PERFORMANCE TIMELINE
                 </div>
                 <div className="flex gap-6 text-[10px]">
                    <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#00f0ff]"/> Team Alpha Ranking</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#ff2e88]"/> Team Beta Ranking</div>
                 </div>
              </div>
              
              <div className="relative w-full h-[220px]">
                 <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 50, 100, 150, 200].map((y, i) => (
                       <g key={y}>
                          <line x1="0" y1={y} x2="1000" y2={y} stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" className="text-foreground" />
                          <text x="-25" y={200 - y + 4} fill="currentColor" fillOpacity="0.4" fontSize="12" fontFamily="sans-serif" className="text-foreground">{i * 5}</text>
                       </g>
                    ))}
                    {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((x, i) => (
                       <g key={x}>
                          <line x1={x} y1="0" x2={x} y2="200" stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" className="text-foreground" />
                          <text x={x} y="220" fill="currentColor" fillOpacity="0.4" fontSize="12" fontFamily="sans-serif" textAnchor="middle" className="text-foreground">{i * 5}</text>
                       </g>
                    ))}

                    {/* Highlight Vertical Line */}
                    <line x1="260" y1="0" x2="260" y2="200" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                    
                    {/* Paths */}
                    <path d="M 0 200 L 100 100 L 200 110 L 300 70 L 400 30 L 500 110 L 600 100 L 700 30 L 800 60 L 900 10 L 1000 30" fill="none" stroke="#00f0ff" strokeWidth="3" />
                    <path d="M 0 200 L 100 150 L 200 155 L 300 100 L 400 150 L 500 130 L 600 80 L 700 130 L 800 150 L 900 100 L 1000 40" fill="none" stroke="#ff2e88" strokeWidth="3" />
                    
                    {/* Data Points */}
                    <circle cx="100" cy="100" r="4" fill="#00f0ff" />
                    <circle cx="200" cy="110" r="4" fill="#00f0ff" />
                    <circle cx="300" cy="70" r="4" fill="#00f0ff" />
                    <circle cx="400" cy="30" r="4" fill="#00f0ff" />
                    <circle cx="500" cy="110" r="4" fill="#00f0ff" />
                    <circle cx="600" cy="100" r="4" fill="#00f0ff" />
                    <circle cx="700" cy="30" r="4" fill="#00f0ff" />
                    <circle cx="800" cy="60" r="4" fill="#00f0ff" />
                    <circle cx="900" cy="10" r="4" fill="#00f0ff" />
                    <circle cx="1000" cy="30" r="4" fill="#00f0ff" />
                    
                    <circle cx="100" cy="150" r="4" fill="#ff2e88" />
                    <circle cx="200" cy="155" r="4" fill="#ff2e88" />
                    <circle cx="300" cy="100" r="4" fill="#ff2e88" />
                    <circle cx="400" cy="150" r="4" fill="#ff2e88" />
                    <circle cx="500" cy="130" r="4" fill="#ff2e88" />
                    <circle cx="600" cy="80" r="4" fill="#ff2e88" />
                    <circle cx="700" cy="130" r="4" fill="#ff2e88" />
                    <circle cx="800" cy="150" r="4" fill="#ff2e88" />
                    <circle cx="900" cy="100" r="4" fill="#ff2e88" />
                    <circle cx="1000" cy="40" r="4" fill="#ff2e88" />
                    
                    {/* Active Point Highlight */}
                    <circle cx="260" cy="88" r="6" fill="#00f0ff" className="animate-pulse" />
                 </svg>
              </div>
           </div>

        </div>

        {/* RIGHT SIDEBAR (FILTERS) */}
        <aside className="w-full lg:w-[280px] xl:w-[320px] rounded-xl border border-border bg-card/80 p-6 flex flex-col shadow-lg backdrop-blur-sm relative overflow-hidden">
           {/* Beautiful Cyan glow at the bottom */}
           <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#00f0ff]/10 to-transparent pointer-events-none" />
           
           <div className="flex items-center gap-2 mb-8 text-foreground font-bold tracking-widest text-[14px] uppercase border-b border-border pb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              FILTERS
           </div>
           
           <div className="flex flex-col gap-6 relative z-10 w-full">
              {/* Select 1 */}
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] text-muted-foreground font-medium">Season</label>
                 <div className="relative">
                    <select className="w-full appearance-none bg-transparent border border-border rounded-sm text-sm text-foreground/90 p-3 pr-8 focus:outline-none focus:border-[#00f0ff]">
                       <option>Season</option>
                       <option>Season 1</option>
                       <option>Season 2</option>
                    </select>
                    <div className="absolute right-3 top-[14px] pointer-events-none opacity-60">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                 </div>
              </div>

              {/* Select 2 */}
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] text-muted-foreground font-medium">Tournament</label>
                 <div className="relative">
                    <select className="w-full appearance-none bg-transparent border border-border rounded-sm text-sm text-foreground/90 p-3 pr-8 focus:outline-none focus:border-[#00f0ff]">
                       <option>Tournament</option>
                       <option>Alpha Cup</option>
                       <option>Beta League</option>
                    </select>
                    <div className="absolute right-3 top-[14px] pointer-events-none opacity-60">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                 </div>
              </div>

              {/* Select 3 */}
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] text-muted-foreground font-medium">Team</label>
                 <div className="relative">
                    <select className="w-full appearance-none bg-transparent border border-border rounded-sm text-sm text-foreground/90 p-3 pr-8 focus:outline-none focus:border-[#00f0ff]">
                       <option>Team</option>
                       <option>Team Alpha</option>
                       <option>Team Beta</option>
                    </select>
                    <div className="absolute right-3 top-[14px] pointer-events-none opacity-60">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                 </div>
              </div>
           </div>
        </aside>

      </div>
    </main>
  );
}
