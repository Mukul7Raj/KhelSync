'use client';

import { Activity } from 'lucide-react';

export function SettingsPanel() {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-5 backdrop-blur-md flex flex-col font-sans shadow-lg mt-0">
      <div className="flex items-center gap-2 mb-6 text-foreground font-bold tracking-widest text-[12px] uppercase">
        <Activity className="w-4 h-4 text-muted-foreground" />
        QUICK ACTIONS
      </div>

      <div className="flex flex-col gap-4">
         <button className="w-full bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-bold tracking-wide text-[12px] py-4 rounded-sm transition-colors duration-300 shadow-sm border border-[#00f0ff]">
            CREATE TOURNAMENT
         </button>
         
         <button className="w-full border-2 border-[#ff2e88] hover:bg-[#ff2e88]/10 text-foreground font-bold tracking-wide text-[12px] py-4 rounded-sm transition-colors duration-300 shadow-sm">
            START AUCTION
         </button>
      </div>
    </div>
  );
}
