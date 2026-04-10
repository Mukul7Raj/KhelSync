'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

export function Timer({ initialTime, onTimeUp }: { initialTime: number; onTimeUp: () => void }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const hasCalled = useRef(false);

  useEffect(() => {
    setTimeLeft(initialTime);
    hasCalled.current = false;
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft === 0 && !hasCalled.current) {
      hasCalled.current = true;
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const isLowTime = timeLeft <= 5;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2 text-[#00f0ff]/50 uppercase text-[10px] font-mono tracking-widest">
        <Clock className="w-3 h-3" /> Auction Clock
      </div>
      <div className={`relative px-8 py-4 border-2 ${isLowTime ? 'border-[#ff2e88] text-[#ff2e88]' : 'border-[#00f0ff] text-[#00f0ff]'} bg-black/60 backdrop-blur-md overflow-hidden group transition-colors duration-300`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={timeLeft}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-6xl font-black italic tracking-tighter"
          >
            {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
          </motion.div>
        </AnimatePresence>
        
        {/* Scanning line effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scanline" />
        
        {/* Indicator lights */}
        <div className="absolute bottom-1 right-2 flex gap-1">
          <div className={`w-1 h-1 rounded-full ${isLowTime ? 'bg-[#ff2e88] animate-pulse' : 'bg-[#00f0ff]'}`} />
          <div className={`w-1 h-1 rounded-full ${isLowTime ? 'bg-[#ff2e88] animate-pulse' : 'bg-[#00f0ff]/40'}`} />
          <div className={`w-1 h-1 rounded-full ${isLowTime ? 'bg-[#ff2e88] animate-pulse' : 'bg-[#00f0ff]/20'}`} />
        </div>
      </div>
      
      <div className="mt-4">
        <AnimatePresence>
          {timeLeft <= 10 && timeLeft > 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-[#00f0ff] font-mono text-xs uppercase tracking-[0.2em]"
            >
              Going once...
            </motion.div>
          )}
          {timeLeft <= 5 && timeLeft > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-[#ff2e88] font-mono text-sm font-bold uppercase tracking-[0.3em] animate-pulse"
            >
              Going twice!!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
