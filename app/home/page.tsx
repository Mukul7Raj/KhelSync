'use client';

import { useEffect, useState } from 'react';
import { SettingsPanel } from '@/components/dashboard/settings-panel';
import { WhoAmIPanel } from '@/components/dashboard/whoami-panel';
import { createClient } from '@/utils/supabase/client';
import { LayoutGrid, Mail, LogOut, Trophy, Gavel, Clock, Users, BarChart2, User, HelpCircle, MonitorPlay, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
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
          <h1 className="text-2xl font-semibold tracking-wide">
            <span className="text-[#00f0ff]">KhelSync</span> Management Dashboard
          </h1>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 relative z-10 w-full max-w-[1700px] mx-auto px-6 pb-8">

        {/* LEFT SIDEBAR */}
        <aside className="w-56 hidden xl:flex flex-col border-r border-border pr-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-3 h-3 bg-[#ff2e88] rounded-full shadow-[0_0_10px_#ff2e88]" />
            <div>
              <div className="text-[#ff2e88] font-bold tracking-wider text-sm uppercase">NODE_ID: 77-B</div>
              <div className="text-[9px] text-[#00f0ff]/50 uppercase tracking-widest font-semibold mt-0.5">Status: Encrypted</div>
            </div>
          </div>

          <nav className="flex flex-col gap-2 w-full">
            <Link href="/tournaments" className="flex items-center gap-3 p-3 bg-[#00f0ff]/10 border-l-2 border-[#00f0ff] text-[#00f0ff] text-[13px] font-medium tracking-wide shadow-[5px_0_20px_-5px_rgba(0,240,255,0.1)_inset]">
              <Trophy className="w-[18px] h-[18px]" /> Tournaments
            </Link>
            <Link href="/auction" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-2 border-transparent hover:border-[#00f0ff]/30 hover:bg-accent/10">
              <Gavel className="w-[18px] h-[18px]" /> Player Auction
            </Link>
            <Link href="/scores" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-2 border-transparent hover:border-[#00f0ff]/30 hover:bg-accent/10">
              <Clock className="w-[18px] h-[18px]" /> Live Scores
            </Link>
            <Link href="/teams" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-2 border-transparent hover:border-[#00f0ff]/30 hover:bg-accent/10">
              <Users className="w-[18px] h-[18px]" /> Team Management
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-2 border-transparent hover:border-[#00f0ff]/30 hover:bg-accent/10">
              <BarChart2 className="w-[18px] h-[18px]" /> Analytics
            </Link>
            <Link href="/live-match" className="flex items-center gap-3 p-3 text-muted-foreground text-[13px] font-normal tracking-wide hover:text-[#00f0ff] transition-colors border-l-2 border-transparent hover:border-[#00f0ff]/30 hover:bg-accent/10">
              <MonitorPlay className="w-[18px] h-[18px]" /> Fan Live Match
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-5 text-[11px] font-semibold tracking-wider text-muted-foreground mb-6 px-2">
            <a href="#" className="flex items-center gap-3 hover:text-foreground transition-colors"><HelpCircle className="w-3.5 h-3.5" /> SUPPORT</a>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <div className="flex-1 flex flex-col gap-6">

          {/* LIVE STREAM SECTION */}
          <div className="rounded-xl border border-border bg-card overflow-hidden w-full shadow-xl">
            <div className="w-full h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5 mr-4">
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
              </div>
              <MonitorPlay className="w-4 h-4 text-white/40" />
              <span className="text-[11px] text-white/70 font-semibold tracking-wider ml-1">LIVE STREAM</span>
              <span className="ml-auto text-[10px] text-[#00f0ff]/70 font-mono tracking-widest lowercase">uptime: {mounted ? "012:09:39" : "..."}</span>
            </div>
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070"
                alt="Esports Live Stream"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-transparent to-transparent opacity-80 pointer-events-none" />
              {/* Fake HUD Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="bg-[#0b1121]/80 backdrop-blur-md border border-white/10 rounded-md p-3 text-xs w-48 shadow-lg hidden md:block">
                  <div className="font-bold text-white/90 mb-2 border-b border-white/10 pb-1 text-[9px] tracking-widest uppercase">Player Performance</div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center"><span className="text-[#00f0ff]">Player</span><span className="font-mono">26/10</span></div>
                    <div className="flex justify-between items-center"><span className="text-[#ff2e88]">R10b</span><span className="font-mono">28/8</span></div>
                    <div className="flex justify-between items-center"><span className="text-emerald-400">Roadkoacs</span><span className="font-mono">19/4</span></div>
                  </div>
                </div>
                <div className="flex gap-4 mb-2">
                  <div className="text-center"><div className="text-[9px] text-white/50 tracking-widest">PLAYERS</div><div className="text-xl font-black text-[#ff2e88]">96</div></div>
                  <div className="text-center"><div className="text-[9px] text-white/50 tracking-widest">SCORE</div><div className="text-xl font-black text-[#00f0ff]">25</div></div>
                  <div className="text-center"><div className="text-[9px] text-white/50 tracking-widest">K/D</div><div className="text-xl font-black text-white">0.10</div></div>
                  <div className="text-center"><div className="text-[9px] text-white/50 tracking-widest">ECON</div><div className="text-xl font-black text-[#00f0ff]">25</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* UPCOMING MATCH FIXTURES */}
          <div className="rounded-xl border border-border bg-card/80 p-6 flex-1 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 text-foreground font-bold tracking-widest text-[12px] uppercase">
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
              UPCOMING MATCH FIXTURES
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { t1: "Team 1", t2: "Team 1", time: "18:00", s1: "A", s2: "B" },
                { t1: "Team 8", t2: "Team 2", time: "15:00", s1: "C", s2: "D" },
                { t1: "Team 1", t2: "Team 2", time: "19:00", s1: "E", s2: "F" },
                { t1: "Team B", t2: "Team 2", time: "18:00", s1: "G", s2: "H" },
                { t1: "Team B", t2: "Team 2", time: "19:00", s1: "I", s2: "J" },
                { t1: "Team A", t2: "Team 2", time: "19:00", s1: "K", s2: "L" },
                { t1: "Team A", t2: "Team 2", time: "19:00", s1: "M", s2: "N" },
                { t1: "Team B", t2: "Team 2", time: "19:00", s1: "O", s2: "P" },
                { t1: "Team A", t2: "Team 2", time: "19:00", s1: "Q", s2: "R" },
              ].map((match, i) => (
                <div key={i} className="border border-border bg-background rounded-lg p-3 hover:border-cyan-500/50 transition-colors flex flex-col justify-between cursor-pointer group shadow-sm">
                  <div className="flex justify-between items-center px-4 py-2">
                    <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${match.s1}&backgroundColor=transparent`} className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" alt="" />
                    <div className="font-mono text-sm font-bold text-foreground">{match.time}</div>
                    <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${match.s2}&backgroundColor=transparent`} className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" alt="" />
                  </div>
                  <div className="text-center bg-muted text-[10px] text-muted-foreground py-1.5 mt-2 rounded font-medium tracking-wide">
                    {match.t1} vs {match.t2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full xl:w-[320px] flex flex-col gap-6">
          <WhoAmIPanel />
          <SettingsPanel />
        </aside>

      </div>
    </main>
  );
}
