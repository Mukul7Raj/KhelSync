'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Send, CheckCircle2, Users, Lock, Grid, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { parseTournamentIntent } from '@/lib/actions';

interface QuickAssistantProps {
  onApply: (config: any) => void;
}

export default function QuickAssistant({ onApply }: QuickAssistantProps) {
  const [intent, setIntent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleProcess = async () => {
    if (!intent.trim()) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const response = await parseTournamentIntent(intent);
      if (response.success) {
        setResult(response);
      }
    } catch (error) {
      console.error('Failed to parse intent:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const iconMap: Record<string, any> = {
    users: Users,
    lock: Lock,
    grid: Grid,
    zap: Zap,
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <div className="absolute -top-3 left-4 px-2 bg-black text-[10px] font-mono text-cyan-400 uppercase tracking-widest z-10 border border-cyan-500/30">
          Neural_Input_v1.0
        </div>
        <div className="relative group">
          <Textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="e.g., '16 player single elimination named Cyber Clash, make it private'"
            className="min-h-[100px] bg-black/40 border-cyan-500/30 focus:border-cyan-400 text-cyan-50 placeholder:text-cyan-900/50 resize-none pt-4 transition-all duration-500 group-hover:border-cyan-400/60"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              size="sm"
              onClick={handleProcess}
              disabled={isProcessing || !intent.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-tighter h-8 group"
            >
              {isProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-3 h-3 mr-2 group-hover:animate-pulse" />
              )}
              {isProcessing ? 'Processing...' : 'Analyze Intent'}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 border border-cyan-500/20 bg-cyan-500/5 rounded-lg overflow-hidden relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent w-1/2 h-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
            <div className="flex items-center gap-3 text-cyan-400 font-mono text-xs">
              <span className="animate-pulse">SYNCHRONIZING_PARAMETERS...</span>
            </div>
          </motion.div>
        )}

        {result && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 border border-green-500/30 bg-green-500/5 rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> INTENT_DECODED_SUCCESSFULLY
              </h4>
              <span className="text-[10px] text-green-500/60 font-mono">CONFIDENCE: 98.4%</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {result.tokens.map((token: any, idx: number) => {
                const Icon = iconMap[token.icon] || Zap;
                return (
                  <div key={idx} className="flex items-center gap-2 px-2 py-1.5 bg-black/40 border border-green-500/20 rounded text-[11px] text-green-100 font-mono">
                    <Icon className="w-3 h-3 text-green-400" />
                    {token.label}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-green-500/10 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-green-400/70 font-mono">
                  Proposed Name: <span className="text-green-100 uppercase">{result.config.name}</span>
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px] font-mono border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black transition-all"
                  onClick={() => onApply(result.config)}
                >
                  APPLY_CONFIGURATION ⚡
                </Button>
              </div>

              {result.config.maxPlayers > 0 && (
                <div className="p-2 bg-black/60 rounded border border-green-500/10 font-mono text-[9px]">
                  <p className="text-green-500/60 mb-2 uppercase tracking-tighter">Bracket_Projection.log</p>
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <p className="text-green-400">R1: ROUND_OF_{Math.pow(2, Math.ceil(Math.log2(result.config.maxPlayers)))}</p>
                      <p className="text-green-400/60">R2: QUARTER_FINALS</p>
                      <p className="text-green-400/40">R3: SEMI_FINALS</p>
                    </div>
                    <div className="space-y-1 border-l border-green-500/20 pl-4">
                      <p className="text-green-100">{Math.floor(result.config.maxPlayers / 2)} Starting Matches</p>
                      <p className="text-green-100/60">{result.config.maxPlayers - Math.pow(2, Math.floor(Math.log2(result.config.maxPlayers))) > 0 ? 'BYES_DETECTED' : 'FULL_ROSTER'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
