'use client';

import { useTypewriter } from '@/hooks/use-typewriter';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Activity, Zap, Radio, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function TerminalPanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const { displayedText: bootLogs } = useTypewriter(
    `> INITIALIZING KHELSYNC CORE...\n> LOADING TOURNAMENT PROTOCOLS...\n> ESTABLISHING SECURE CONNECTION...\n> SYSTEM READY.`,
    30
  );

  const asciiLogo = `
  _  _ _  _ ____ _    ____ _   _ _  _ ____ 
  |_/  |__| |___ |    [__   \\_/  |\\ | |    
  | \\_ |  | |___ |___ ___]   |   | \\| |___ 
                                            
  `;

  // Simulate incoming data packets
  useEffect(() => {
    const streamItems = [
      "PACKET_RCV [192.168.1.1]",
      "SIGNAL_AUTH_SUCCESS",
      "NODE_PING: 14ms",
      "ENC_LAYER_3_STABLE",
      "DATA_POOL_SYNCED",
      "NET_TRAFFIC_OPTIMIZED"
    ];
    
    const interval = setInterval(() => {
      setLogs(prev => [streamItems[Math.floor(Math.random() * streamItems.length)], ...prev].slice(0, 5));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-panel h-full flex flex-col relative overflow-hidden group">
      <div className="scanline opacity-10" />
      <div className="absolute inset-0 bg-[#00f0ff]/[0.02] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[#00f0ff]/30 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#00f0ff]" />
          <span className="terminal-text font-bold tracking-tighter uppercase">Main Hero Terminal</span>
        </div>
        <div className="flex gap-2">
           <span className="w-2 h-2 bg-[#00f0ff] animate-pulse rounded-full" />
           <span className="w-2 h-2 bg-[#ff2e88] animate-pulse rounded-full" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* ASCII LOGO */}
      <pre className="text-[10px] md:text-sm text-[#00f0ff] font-mono leading-tight mb-6 overflow-hidden drop-shadow-[0_0_5px_#00f0ff]">
        {asciiLogo}
      </pre>

      <div className="flex-1 flex flex-col min-h-0">
        {/* BOOT LOGS */}
        <div className="font-mono text-xs md:text-sm text-[#00f0ff]/80 mb-6 whitespace-pre-wrap">
          {bootLogs}
        </div>

        {/* --- GAP FILLER: RADAR & DATA FEED --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-1">
          {/* RADAR VIZ */}
          <div className="relative border border-[#00f0ff]/10 bg-black/40 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]" />
             
             {/* Circular Radar Grid */}
             <div className="relative w-32 h-32 border border-[#00f0ff]/20 rounded-full flex items-center justify-center">
                <div className="absolute w-24 h-24 border border-[#00f0ff]/20 rounded-full" />
                <div className="absolute w-16 h-16 border border-[#00f0ff]/20 rounded-full" />
                <div className="absolute w-[1px] h-full bg-[#00f0ff]/10" />
                <div className="absolute w-full h-[1px] bg-[#00f0ff]/10" />
                
                {/* Radar Sweep */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-r-2 border-t-2 border-[#00f0ff]/60"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ background: 'conic-gradient(from 0deg, transparent 80%, rgba(0,240,255,0.4) 100%)' }}
                />

                {/* Blips */}
                <motion.div 
                  className="absolute w-1 h-1 bg-[#ff2e88] rounded-full shadow-[0_0_8px_#ff2e88]"
                  style={{ top: '25%', left: '70%' }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <motion.div 
                  className="absolute w-1 h-1 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"
                  style={{ top: '60%', left: '30%' }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
             </div>
             <div className="absolute bottom-2 left-2 text-[8px] font-mono text-[#00f0ff]/40 uppercase tracking-widest">
                Local_Area_Scanner
             </div>
          </div>

          {/* LIVE DATA STREAM */}
          <div className="border border-[#00f0ff]/10 bg-black/40 p-4 font-mono text-[9px] relative overflow-hidden">
             <div className="flex items-center gap-2 mb-3 border-b border-[#00f0ff]/10 pb-2">
                <Radio className="w-3 h-3 text-[#ff2e88]" />
                <span className="text-[#ff2e88] uppercase font-bold tracking-tighter">Live_Intercept</span>
             </div>
             <div className="space-y-1">
                {logs.map((log, i) => (
                  <motion.div 
                    key={`${log}-${i}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between"
                  >
                    <span className="text-[#00f0ff]/60">{log}</span>
                    <span className="text-[#00f0ff]/20">0x{Math.floor(Math.random()*1000).toString(16).toUpperCase()}</span>
                  </motion.div>
                ))}
             </div>
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                <div className="flex items-center gap-1">
                   <div className="w-1 h-3 bg-[#00f0ff]/60 animate-pulse" />
                   <div className="w-1 h-5 bg-[#00f0ff]/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
                   <div className="w-1 h-2 bg-[#00f0ff]/60 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SYSTEM INFO */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 bg-black/40 p-3 border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-colors">
          <Shield className="w-4 h-4 text-[#00f0ff]" />
          <div>
            <div className="text-[10px] text-[#00f0ff]/50 uppercase font-mono">Security</div>
            <div className="text-xs text-white font-bold">CORE_ACTIVE</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-black/40 p-3 border border-[#ff2e88]/20 hover:border-[#ff2e88]/50 transition-colors">
          <Cpu className="w-4 h-4 text-[#ff2e88]" />
          <div>
            <div className="text-[10px] text-[#ff2e88]/50 uppercase font-mono">Synthetics</div>
            <div className="text-xs text-white font-bold">12.4H_UPTIME</div>
          </div>
        </div>
      </div>

      {/* CTA BUTTONS */}
      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/tournaments">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="launch-btn w-full cursor-pointer group-hover:shadow-[0_0_25px_rgba(255,46,136,0.6)]"
          >
            &gt;&gt; JOIN TOURNAMENT &lt;&lt;
          </motion.div>
        </Link>
        <Link href="/auction">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-full p-3 font-bold uppercase tracking-widest text-center border-2 border-[#00f0ff] text-[#00f0ff] bg-black/40 hover:bg-[#00f0ff]/10 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            &gt;&gt; AUCTION ARENA &lt;&lt;
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
