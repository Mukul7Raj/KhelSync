'use client';

import { useEffect, useState } from 'react';
import { Play, Volume2, Settings, Maximize, Send, Trophy, Users, Star, BarChart2, MessageSquare, ChevronRight, MonitorPlay, Zap, Heart, Flame } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const INITIAL_CHAT = [
  { id: 1, user: "Pixel_Warrior", badge: "SUPERFAN", text: "That was an insane goal!", color: "text-[#00f0ff]" },
  { id: 2, user: "Synth_Queen", badge: "SUPERFAN", text: "Go Knights! 🛡️", color: "text-[#ff00ff]" },
  { id: 3, user: "Code_Breaker", badge: "SUPERFAN", text: "Cyber Dragons are making a comeback!", color: "text-[#00f0ff]" },
  { id: 4, user: "Techno_Viking", badge: "SUPERFAN", text: "I love this arena design!", color: "text-[#ff00ff]" },
  { id: 5, user: "Neon_Ghost", badge: "SUPERFAN", text: "Watch out for Knight_Strike!", color: "text-[#ff00ff]" },
];

const TIMELINE_EVENTS = [
   { time: "11:20", event: "GOAL", team: "KNIGHTS", color: "bg-[#00f0ff]", side: "top" },
   { time: "11:20", event: "GOAL", team: "KNIGHTS", color: "bg-[#ff00ff]", side: "bottom" },
   { time: "13:05", event: "CARD (YELLOW)", player: "DRAGON_FURY", color: "bg-yellow-400", side: "top" },
   { time: "14:00", event: "SUB", team: "KNIGHTS", color: "bg-[#00f0ff]", side: "bottom" },
   { time: "14:30", event: "GOAL", team: "DRAGONS", color: "bg-[#00f0ff]", side: "bottom" },
];

export default function LiveMatchPage() {
   const [mounted, setMounted] = useState(false);
   const [chat, setChat] = useState(INITIAL_CHAT);
   const [viewers, setViewers] = useState(45800);
   const [chatInput, setChatInput] = useState('');

   useEffect(() => {
      setMounted(true);
      
      // Simulate Viewer fluctuations
      const viewerInterval = setInterval(() => {
         setViewers(prev => prev + Math.floor(Math.random() * 20) - 10);
      }, 3000);

      // Simulate incoming chat messages
      const chatInterval = setInterval(() => {
         if (Math.random() > 0.6) {
            const randomMsgs = ["Let's gooo!", "What a play!", "GG", "Defense needs to wake up", "HYPE!!"];
            const randomUsers = ["NetRunner", "ByteMe", "CyberPunk_99", "Glitch", "Neon_Ninja"];
            setChat(prev => {
               const newChat = [...prev, {
                  id: Date.now(),
                  user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
                  badge: "FAN",
                  text: randomMsgs[Math.floor(Math.random() * randomMsgs.length)],
                  color: Math.random() > 0.5 ? "text-[#00f0ff]" : "text-[#ff00ff]"
               }];
               // keep only last 8 messages
               if (newChat.length > 8) return newChat.slice(newChat.length - 8);
               return newChat;
            });
         }
      }, 2500);

      return () => {
         clearInterval(viewerInterval);
         clearInterval(chatInterval);
      };
   }, []);

   const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      setChat(prev => [...prev, {
         id: Date.now(),
         user: "NEON_CRUSADER99",
         badge: "SUPERFAN",
         text: chatInput,
         color: "text-white"
      }]);
      setChatInput('');
   };

   return (
      <main className="min-h-screen w-full bg-[#080811] text-white flex flex-col font-sans relative overflow-hidden selection:bg-[#ff00ff] selection:text-white">
         
         {/* Cyberpunk Grid Background */}
         <div className="absolute inset-0 pointer-events-none opacity-30" 
              style={{ backgroundImage: 'linear-gradient(rgba(255,0,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.15) 1px, transparent 1px)', backgroundSize: '80px 80px', transform: 'perspective(1000px) rotateX(60deg) scale(2) translateY(20%)', transformOrigin: 'bottom' }} />
         <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#080811]/80 to-[#080811]" />

         {/* TOP NAVIGATION BAR */}
         <header className="flex items-center justify-between px-6 py-4 relative z-10 w-full border-b border-[#ff00ff]/20 bg-[#0b0b1a]/90 backdrop-blur-sm">
            {/* Logo */}
            <div className="flex flex-col">
               <span className="text-[#00f0ff] font-black text-xl tracking-widest uppercase leading-none drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">CYBERPUNK</span>
               <span className="text-[#ff00ff] font-bold text-sm tracking-widest uppercase leading-none mt-1 drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]">SPORTS LEAGUE</span>
            </div>

            {/* Horizontal Nav */}
            <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold tracking-widest uppercase">
               <Link href="#" className="flex items-center gap-2 text-[#00f0ff] border-t-2 border-[#00f0ff] pt-1 pb-1 -mt-1 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                  <MonitorPlay className="w-4 h-4" /> LIVE MATCHES
               </Link>
               <Link href="/tournaments" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <Trophy className="w-4 h-4" /> TOURNAMENTS
               </Link>
               <Link href="/teams" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <Star className="w-4 h-4" /> FAN HUB
               </Link>
               <Link href="/analytics" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <BarChart2 className="w-4 h-4" /> LEADERBOARDS
               </Link>
            </nav>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1.5 border border-white/10 hover:border-[#00f0ff]/50 transition-colors cursor-pointer">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#ff00ff] p-[2px]">
                  <div className="w-full h-full bg-[#080811] rounded-full flex items-center justify-center">
                     <Users className="w-4 h-4 text-white" />
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-white text-xs font-bold font-mono tracking-wider">NEON_CRUSADER99</span>
                  <div className="flex items-center gap-1">
                     <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                     <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest">SUPERFAN</span>
                  </div>
               </div>
            </div>
         </header>

         {/* MAIN CONTENT GRID */}
         <div className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 relative z-10 overflow-hidden">
            
            {/* LEFT AREA: Video & Bottom Panel */}
            <div className="flex-1 flex flex-col gap-6 w-full">
               
               {/* TOP ROW: Video Player AND Chat */}
               <div className="flex flex-col lg:flex-row gap-6 w-full aspect-auto lg:aspect-[21/9]">
                  
                  {/* VIDEO PLAYER */}
                  <div className="flex-[2.5] flex flex-col rounded-xl overflow-hidden border border-[#ff00ff]/30 shadow-[0_0_30px_rgba(255,0,255,0.15)] bg-black relative w-full h-full">
                     {/* Stream Header Overlay */}
                     <div className="absolute top-0 left-0 w-full h-14 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center px-4 gap-4">
                        <div className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.8)] flex items-center gap-1.5 uppercase tracking-widest">
                           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                        </div>
                        <div className="flex items-center gap-4 text-white font-black text-sm md:text-lg uppercase tracking-wider backdrop-blur-md bg-black/40 px-4 py-1.5 rounded border border-white/10 skew-x-[-10deg]">
                           <span className="text-[#ff00ff] skew-x-[10deg]">NEON KNIGHTS</span>
                           <span className="text-2xl skew-x-[10deg]"> 2 - 1 </span>
                           <span className="text-[#00f0ff] skew-x-[10deg]">CYBER DRAGONS</span>
                        </div>
                        <div className="ml-auto text-[10px] md:text-xs font-mono font-bold text-white/80 bg-black/50 px-3 py-1 rounded backdrop-blur border border-white/10">
                           <span className="text-red-400">LIVE</span> | 2nd HALF | 14:30
                        </div>
                     </div>

                     {/* Main Video Screen */}
                     <div className="relative flex-1 w-full h-full bg-black">
                        {/* Active Live Video Stream */}
                        <video 
                           src="/ROBOTFIGHT.mp4" 
                           className="w-full h-full object-cover opacity-60"
                           autoPlay 
                           loop 
                           muted 
                           playsInline
                        />
                        {/* Center action graphics */}
                        <div className="absolute inset-0 bg-[#00f0ff]/5 pointer-events-none mix-blend-overlay" />
                        
                        {/* Player Overlay Cards inside the video */}
                        <div className="absolute bottom-12 left-4 md:left-8 bg-black/60 backdrop-blur-md border border-[#00f0ff]/50 rounded-lg p-3 flex gap-3 shadow-[0_0_15px_rgba(0,240,255,0.2)] w-48 md:w-64 transform -skew-x-[5deg]">
                           <div className="w-12 h-12 md:w-16 md:h-16 border border-[#00f0ff] bg-[#00f0ff]/20 flex items-center justify-center skew-x-[5deg]">
                              <Users className="w-8 h-8 text-[#00f0ff]" />
                           </div>
                           <div className="flex flex-col justify-center flex-1 skew-x-[5deg]">
                              <div className="text-[#00f0ff] font-bold text-xs md:text-sm tracking-widest uppercase mb-1">DRAGON_FURY</div>
                              <div className="flex justify-between items-center text-[8px] md:text-[10px] text-white/70 mb-0.5"><span className="uppercase tracking-widest border-l-2 border-[#00f0ff] pl-1">Energy</span><span>98%</span></div>
                              <div className="w-full h-1 bg-white/20 rounded-full mb-1"><div className="h-full bg-[#00f0ff] w-[98%]" /></div>
                              <div className="flex justify-between items-center text-[8px] md:text-[10px] text-white/70 mb-0.5"><span className="uppercase tracking-widest border-l-2 border-[#00f0ff] pl-1">Stats</span><span>12/4</span></div>
                              <div className="w-full h-1 bg-white/20 rounded-full"><div className="h-full bg-[#00f0ff] w-[75%]" /></div>
                           </div>
                        </div>

                        <div className="absolute bottom-12 right-4 md:right-8 bg-black/60 backdrop-blur-md border border-[#ff00ff]/50 rounded-lg p-3 flex gap-3 shadow-[0_0_15px_rgba(255,0,255,0.2)] w-48 md:w-64 transform flex-row-reverse -skew-x-[5deg]">
                           <div className="w-12 h-12 md:w-16 md:h-16 border border-[#ff00ff] bg-[#ff00ff]/20 flex items-center justify-center skew-x-[5deg]">
                              <Users className="w-8 h-8 text-[#ff00ff]" />
                           </div>
                           <div className="flex flex-col justify-center flex-1 skew-x-[5deg] text-right">
                              <div className="text-[#ff00ff] font-bold text-xs md:text-sm tracking-widest uppercase mb-1">KNIGHT_STRIKE</div>
                              <div className="flex justify-between items-center text-[8px] md:text-[10px] text-white/70 mb-0.5"><span>92%</span><span className="uppercase tracking-widest border-r-2 border-[#ff00ff] pr-1">Energy</span></div>
                              <div className="w-full h-1 bg-white/20 rounded-full relative mb-1"><div className="absolute right-0 h-full bg-[#ff00ff] w-[92%]" /></div>
                              <div className="flex justify-between items-center text-[8px] md:text-[10px] text-white/70 mb-0.5"><span>18/2</span><span className="uppercase tracking-widest border-r-2 border-[#ff00ff] pr-1">Stats</span></div>
                              <div className="w-full h-1 bg-white/20 rounded-full relative"><div className="absolute right-0 h-full bg-[#ff00ff] w-[85%]" /></div>
                           </div>
                        </div>

                     </div>

                     {/* Video Controls Footer */}
                     <div className="h-10 bg-[#05050a] w-full flex items-center px-4 gap-4 box-border border-t border-white/5 relative z-20">
                        <Play className="w-4 h-4 text-white hover:text-[#00f0ff] cursor-pointer" />
                        <Volume2 className="w-4 h-4 text-white hover:text-[#00f0ff] cursor-pointer" />
                        <div className="text-[10px] font-mono text-white/70 pt-0.5">0:00 / 14:30</div>
                        {/* Playback bar */}
                        <div className="flex-1 h-1 bg-white/20 rounded cursor-pointer relative mx-4 group">
                           <div className="absolute left-0 top-0 h-full bg-red-500 w-1/3 rounded-l" />
                           <div className="absolute left-1/3 -top-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <Settings className="w-4 h-4 text-white hover:text-[#00f0ff] cursor-pointer" />
                        <Maximize className="w-4 h-4 text-white hover:text-[#00f0ff] cursor-pointer" />
                     </div>
                  </div>

                  {/* GLOBAL FAN CHAT */}
                  <div className="flex-1 bg-[#0b0b1a]/80 backdrop-blur-md rounded-xl border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)] flex flex-col overflow-hidden h-[400px] lg:h-auto">
                     <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#00f0ff]/5">
                        <div className="font-bold text-white text-sm uppercase tracking-widest flex items-center gap-2">
                           <MessageSquare className="w-4 h-4 text-[#00f0ff]" /> GLOBAL FAN CHAT
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                     </div>
                     
                     <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end gap-3 custom-scrollbar relative">
                        {/* Floating emojis overlay */}
                        <div className="absolute right-2 bottom-10 w-8 h-48 pointer-events-none flex flex-col justify-end gap-2 text-xl animate-[pulse_3s_infinite]">
                           <span className="block animate-bounce opacity-80" style={{ animationDelay: '0.2s'}}>🔥</span>
                           <span className="block animate-bounce opacity-60" style={{ animationDelay: '0.7s'}}>🤖</span>
                           <span className="block animate-bounce opacity-90" style={{ animationDelay: '0.1s'}}>🤩</span>
                           <span className="block animate-bounce opacity-70" style={{ animationDelay: '0.5s'}}>🎉</span>
                           <span className="block animate-bounce opacity-80" style={{ animationDelay: '0.9s'}}>💖</span>
                        </div>

                        {chat.map((msg) => (
                           <div key={msg.id} className="text-xs flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 pr-10">
                              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                 <Users className="w-3.5 h-3.5 text-white/70" />
                              </div>
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className={`font-bold ${msg.color}`}>{msg.user}</span>
                                    {msg.badge && (
                                       <span className="bg-purple-900/50 text-[#ff00ff] text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-widest border border-[#ff00ff]/30">
                                          <Star className="w-2 h-2 fill-[#ff00ff]" /> {msg.badge}
                                       </span>
                                    )}
                                 </div>
                                 <span className="text-white/90 leading-tight">{msg.text}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                     
                     <div className="p-3 border-t border-white/10 bg-black/40">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                           <input 
                              type="text" 
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Type a message..." 
                              className="w-full bg-[#121225] border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                           />
                           <button type="submit" className="absolute right-3 text-[#00f0ff] hover:scale-110 transition-transform">
                              <Send className="w-4 h-4" />
                           </button>
                        </form>
                     </div>
                  </div>
               </div>

               {/* BOTTOM ROW: FAN INTERACTION PANEL */}
               <div className="w-full bg-[#0b0b1a]/80 backdrop-blur-xl border border-[#ff00ff]/30 rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.1)] p-5 md:p-6 pb-8 border-t-4 border-t-[#ff00ff]">
                  <div className="text-center font-black text-white md:text-lg tracking-[0.2em] uppercase mb-6 shadow-black drop-shadow-md">
                     FAN INTERACTION
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                     
                     {/* POLLING */}
                     <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                           <div className="text-[#00f0ff] font-bold text-[11px] tracking-widest uppercase mb-1">LIVE PREDICTION POLL</div>
                           <div className="text-white font-bold text-sm tracking-wider uppercase">WHO WILL SCORE NEXT?</div>
                        </div>
                        <div className="flex flex-col gap-3">
                           <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between text-xs font-bold font-mono">
                                 <span className="text-white tracking-widest">KNIGHTS (58%)</span>
                                 <span className="text-white/50">130 votes</span>
                              </div>
                              <div className="h-4 bg-white/10 rounded overflow-hidden relative border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.1)_inset]">
                                 <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00f0ff]/50 to-[#00f0ff] w-[58%] border-r border-white/50 shadow-[0_0_10px_#00f0ff]" />
                                 {/* Grid overlay for texture */}
                                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between text-xs font-bold font-mono">
                                 <span className="text-white tracking-widest">DRAGONS (42%)</span>
                                 <span className="text-white/50">52 votes</span>
                              </div>
                              <div className="h-4 bg-white/10 rounded overflow-hidden relative border border-[#ff00ff]/30 shadow-[0_0_10px_rgba(255,0,255,0.1)_inset]">
                                 <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#ff00ff]/50 to-[#ff00ff] w-[42%] border-r border-white/50 shadow-[0_0_10px_#ff00ff]" />
                                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* CENTER BUTTON */}
                     <div className="flex flex-col items-center justify-center px-4">
                        <button className="relative group overflow-hidden bg-transparent border-2 border-transparent w-full max-w-[280px] rounded-lg">
                           <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] via-[#ff00ff] to-[#00f0ff] animate-[gradient_3s_infinite_linear] bg-[length:200%_auto] opacity-50 group-hover:opacity-100 transition-opacity rounded-lg blur-md" />
                           <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] via-[#ff00ff] to-[#00f0ff] animate-[gradient_3s_infinite_linear] bg-[length:200%_auto] opacity-80 rounded-lg p-[2px]">
                              <div className="w-full h-full bg-[#0b0b1a] rounded-md" />
                           </div>
                           <div className="relative py-4 px-6 text-white font-black tracking-[0.15em] text-sm group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10">
                              SUPPORT YOUR TEAM
                           </div>
                        </button>
                        <div className="text-[10px] text-white/50 font-bold tracking-widest mt-3">Trigger screen-wide neon pulse!</div>
                     </div>

                     {/* TIMELINE */}
                     <div className="flex flex-col gap-4">
                        <div className="text-[#00f0ff] font-bold text-[11px] tracking-widest uppercase mb-2">REAL-TIME MATCH TIMELINE</div>
                        <div className="relative w-full h-1 bg-[#00f0ff]/30 rounded-full mt-4 flex items-center shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                           {/* Timeline line */}
                           <div className="absolute left-0 top-0 h-full bg-[#00f0ff] w-[80%] rounded-full shadow-[0_0_8px_#00f0ff]" />
                           
                           {/* Timeline events nodes */}
                           {TIMELINE_EVENTS.map((ev, i) => (
                              <div key={i} className="absolute flex flex-col items-center" style={{ left: `${15 + (i * 20)}%` }}>
                                 {/* Node dot */}
                                 <div className={`w-3 h-3 rounded-full ${ev.color} border-2 border-[#0b0b1a] shadow-[0_0_8px_currentColor] z-10`} />
                                 {/* Tooltip info */}
                                 <div className={`absolute ${ev.side === 'top' ? 'bottom-5' : 'top-5'} transform -translate-x-1/2 flex flex-col items-center w-24`}>
                                    <div className="flex items-center gap-1 bg-[#0b0b1a]/80 border border-white/10 px-1.5 py-0.5 rounded shadow-lg backdrop-blur text-[8px] whitespace-nowrap">
                                       {ev.event === "GOAL" && <MonitorPlay className="w-2 h-2 text-[#00f0ff]" />}
                                       {ev.event === "SUB" && <Zap className="w-2 h-2 text-[#ff00ff]" />}
                                       {ev.event.includes("CARD") && <div className="w-1.5 h-2 bg-yellow-400 rounded-sm" />}
                                       <div className="flex flex-col items-center ml-0.5">
                                          <span className="font-bold text-white leading-none uppercase">{ev.event}</span>
                                          <span className="font-mono text-white/60 leading-none mt-0.5">{ev.team || ev.player} <span className="text-[#00f0ff]">{ev.time}</span></span>
                                       </div>
                                    </div>
                                    {/* connecting line */}
                                    <div className={`w-px h-3 ${ev.color} opacity-50`} />
                                 </div>
                              </div>
                           ))}
                           <ChevronRight className="absolute -right-3 w-4 h-4 text-[#00f0ff]" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* RIGHT AREA: Audience Stats */}
            <aside className="w-full xl:w-72 bg-[#0b0b1a]/90 backdrop-blur-lg border border-white/10 rounded-xl flex flex-col p-5 gap-6 xl:sticky xl:top-6 shadow-2xl z-10 shrink-0 self-start">
               {/* Live Viewers */}
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 border border-[#00f0ff] rounded-lg bg-[#00f0ff]/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.15)] relative">
                     <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                     <Users className="w-5 h-5 text-[#00f0ff]" />
                  </div>
                  <div className="flex flex-col">
                     <div className="text-[10px] text-white/50 tracking-widest font-bold uppercase mb-0.5">LIVE VIEWERS:</div>
                     <div className="text-2xl font-black text-white tracking-widest font-mono">
                        {viewers.toLocaleString()}
                     </div>
                  </div>
               </div>

               {/* Top Gifters */}
               <div className="flex flex-col gap-3">
                  <div className="text-[10px] text-white/50 tracking-widest font-bold uppercase border-b border-white/5 pb-1">
                     TOP GIFTERS:
                  </div>
                  <div className="flex flex-col gap-3">
                     {[
                        { user: "Pixel_Warrior", credits: "1500" },
                        { user: "Synth_Queen", credits: "1200" },
                        { user: "Code_Breaker", credits: "900" },
                     ].map((g, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                           <div className="flex items-center gap-2">
                              {i === 0 ? <Trophy className="w-3.5 h-3.5 text-yellow-500" /> : <div className="w-3.5 h-3.5 flex items-center justify-center text-white/30 font-bold">{i+1}</div>}
                              <span className="font-bold text-white/80">{g.user}</span>
                           </div>
                           <span className="text-[#00f0ff] font-mono tracking-widest">({g.credits} Credits)</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Community Goals */}
               <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-5">
                  <div className="text-[10px] text-white/50 tracking-widest font-bold uppercase">
                     COMMUNITY GOALS
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-[#00f0ff] text-[10px] font-bold font-mono tracking-widest">
                        <span>0%</span>
                        <span>1000</span>
                     </div>
                     <div className="h-4 bg-white/10 rounded overflow-hidden relative shadow-[0_0_10px_rgba(0,240,255,0.1)_inset] border border-[#00f0ff]/30">
                        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00f0ff]/50 to-[#00f0ff] w-[45%] border-r border-white/50 shadow-[0_0_10px_#00f0ff] flex items-center justify-end px-1">
                           <div className="text-[8px] text-white font-bold opacity-80">450</div>
                        </div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
                     </div>
                     <div className="text-[9px] text-[#00f0ff] mt-1 tracking-widest font-bold uppercase animate-pulse text-right">
                        PROGRESS ACTIVE
                     </div>
                  </div>
               </div>
               
               {/* Quick stats replicated just for filler match to screenshot top/bottom */}
               <div className="flex flex-col gap-3 mt-4">
                   <div className="text-[10px] text-white/50 tracking-widest font-bold uppercase border-b border-white/5 pb-1">
                     TOP VIEWERS:
                  </div>
                  <div className="text-2xl font-black text-white tracking-widest font-mono mb-2">
                        45,800
                  </div>
                  <div className="flex flex-col gap-3">
                     {[
                        { user: "Pixel_Warrior", credits: "1500" },
                        { user: "Synth_Queen", credits: "1200" },
                        { user: "Code_Breaker", credits: "900" },
                     ].map((g, i) => (
                        <div key={i} className="flex gap-2 text-xs items-center">
                           <div className="w-6 h-6 rounded-full border border-[#ff00ff]/30 bg-[#ff00ff]/10 flex items-center justify-center shrink-0">
                                 <Users className="w-3.5 h-3.5 text-[#ff00ff]" />
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-white/80 leading-none">{g.user}</span>
                              <span className="text-white/40 font-mono tracking-widest text-[9px] mt-0.5">({g.credits} Credits)</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-5">
                  <div className="text-[10px] text-white/50 tracking-widest font-bold uppercase">
                     COMMUNITY GOALS
                  </div>
                  <div className="h-3 bg-white/10 rounded overflow-hidden relative border border-[#00f0ff]/30">
                        <div className="absolute left-0 top-0 h-full bg-[#00f0ff] w-[80%] border-r border-white/50" />
                  </div>
                  <div className="text-[9px] text-[#00f0ff] tracking-widest font-bold uppercase animate-pulse">
                     PROGRESS ACTIVE
                  </div>
               </div>

            </aside>
               
         </div>
         
         <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar {
               width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
               background: rgba(255, 255, 255, 0.05); 
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
               background: rgba(0, 240, 255, 0.5); 
               border-radius: 4px;
            }
         `}} />
      </main>
   );
}
