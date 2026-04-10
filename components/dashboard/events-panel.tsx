'use client';

import { Activity, Radio, Users } from 'lucide-react';

interface EventProps {
  name: string;
  progress: number;
  type: 'LIVE' | 'UPCOMING';
}

function EventItem({ name, progress, type }: EventProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {type === 'LIVE' ? (
            <Radio className="w-3 h-3 text-[#ff2e88] animate-pulse" />
          ) : (
            <Activity className="w-3 h-3 text-[#00f0ff]" />
          )}
          <span className="text-xs font-mono uppercase text-white/90 tracking-wider">
            {name}
          </span>
        </div>
        <span className={`text-[10px] px-1 border ${type === 'LIVE' ? 'border-[#ff2e88] text-[#ff2e88]' : 'border-[#00f0ff] text-[#00f0ff]'}`}>
          {type}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-black/50 border border-white/10 relative">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ${type === 'LIVE' ? 'bg-[#ff2e88] shadow-[0_0_10px_#ff2e88]' : 'bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono whitespace-nowrap">
          {progress.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export function EventsPanel() {
  return (
    <div className="cyber-panel h-full">
      <div className="flex items-center gap-2 mb-6 border-b border-[#00f0ff]/30 pb-2">
        <Users className="w-4 h-4 text-[#00f0ff]" />
        <span className="terminal-text text-sm font-bold tracking-tighter uppercase">Active Events</span>
      </div>

      <div className="space-y-2">
        <EventItem name="Regional Qualifier #1" progress={87.5} type="LIVE" />
        <EventItem name="College Cup 2024" progress={42.3} type="UPCOMING" />
        <EventItem name="Valorant Scrims" progress={12.73} type="UPCOMING" />
      </div>
    </div>
  );
}
