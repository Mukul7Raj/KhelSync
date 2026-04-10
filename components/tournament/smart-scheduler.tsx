'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SingleEliminationMatch } from '@/app/types/types';
import { updateMatchSchedule } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, MapPin, Zap, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SchedulableMatch = SingleEliminationMatch & {
  id: string;
  home_player_id: string;
  away_player_id: string;
};

type ScheduleRow = {
  matchId: string;
  title: string;
  slotLabel: string;
  ground: string;
  rawMinutes: number;
};

const DEMO_MATCHES: SchedulableMatch[] = [
  {
    id: 'demo-match-1',
    tournament_id: 'demo-tournament',
    round: 1,
    home_player_id: 'demo-falcons',
    away_player_id: 'demo-titans',
    homePlayerUsername: 'Team Falcons',
    awayPlayerUsername: 'Team Titans',
  },
  {
    id: 'demo-match-2',
    tournament_id: 'demo-tournament',
    round: 1,
    home_player_id: 'demo-hawks',
    away_player_id: 'demo-warriors',
    homePlayerUsername: 'Team Hawks',
    awayPlayerUsername: 'Team Warriors',
  },
  {
    id: 'demo-match-3',
    tournament_id: 'demo-tournament',
    round: 2,
    home_player_id: 'demo-falcons',
    away_player_id: 'demo-hawks',
    homePlayerUsername: 'Team Falcons',
    awayPlayerUsername: 'Team Hawks',
  },
];

function toMinutes(label: string): number | null {
  const trimmed = label.trim().toUpperCase();
  const parsed = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);
  if (!parsed) return null;
  let hours = Number(parsed[1]);
  const minutes = Number(parsed[2]);
  const meridiem = parsed[3];
  if (minutes > 59 || hours > 23) return null;
  if (meridiem) {
    if (hours === 12) hours = 0;
    if (meridiem === 'PM') hours += 12;
  }
  return hours * 60 + minutes;
}

function toLabel(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(normalized / 60);
  const m = normalized % 60;
  const meridiem = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${meridiem}`;
}

export default function SmartScheduler({
  matches,
  isCreator,
}: {
  matches: SingleEliminationMatch[] | null;
  isCreator: boolean | null;
}) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Detect if there's already a saved schedule
  const hasExistingSchedule = useMemo(() => 
    (matches ?? []).some(m => m.scheduled_time),
    [matches]
  );

  const [generated, setGenerated] = useState(hasExistingSchedule);

  const schedulableMatches = useMemo(
    () =>
      (matches ?? [])
        .filter(
          (match): match is SchedulableMatch =>
            !!match.id && !!match.home_player_id && !!match.away_player_id
        )
        .sort((a, b) => a.round - b.round),
    [matches]
  );
  
  const isDemo = schedulableMatches.length === 0;
  const schedulePool = isDemo ? DEMO_MATCHES : schedulableMatches;

  const [durationMins, setDurationMins] = useState(60);
  const [slotInput, setSlotInput] = useState('10:00 AM, 11:00 AM, 12:00 PM, 01:00 PM');
  const [groundsInput, setGroundsInput] = useState('Ground 1, Ground 2');
  const [matchOrder, setMatchOrder] = useState<string[]>(
    schedulePool.map((m) => m.id)
  );

  useEffect(() => {
    setMatchOrder(schedulePool.map((m) => m.id));
  }, [schedulePool]);

  const slotMinutes = useMemo(() => {
    const parsed = slotInput
      .split(',')
      .map((v) => toMinutes(v))
      .filter((v): v is number => v !== null)
      .sort((a, b) => a - b);
    return parsed.length > 0 ? parsed : [600, 660, 720];
  }, [slotInput]);

  const grounds = useMemo(() => {
    const parsed = groundsInput
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    return parsed.length > 0 ? parsed : ['Main Ground'];
  }, [groundsInput]);

  const orderedMatches = useMemo(() => {
    const map = new Map(schedulePool.map((m) => [m.id, m]));
    const ordered = matchOrder.map((id) => map.get(id)).filter(Boolean) as SchedulableMatch[];
    if (ordered.length === schedulePool.length) return ordered;
    return schedulePool;
  }, [schedulePool, matchOrder]);

  const schedule = useMemo(() => {
    let autoFixedConflicts = 0;
    let cursor = 0;
    const rows: ScheduleRow[] = [];
    const bookings = new Map<number, Set<string>>();

    const getSlotAt = (index: number) => {
      if (index < slotMinutes.length) return slotMinutes[index];
      const extra = index - slotMinutes.length + 1;
      return slotMinutes[slotMinutes.length - 1] + extra * Math.max(durationMins, 15);
    };

    for (let i = 0; i < orderedMatches.length; i++) {
      const match = orderedMatches[i];
      let slotIndex = cursor;
      const players = [match.home_player_id, match.away_player_id];

      while (true) {
        const slot = getSlotAt(slotIndex);
        const booked = bookings.get(slot) ?? new Set<string>();
        const hasConflict = players.some((playerId) => booked.has(playerId));
        if (!hasConflict) {
          players.forEach((playerId) => booked.add(playerId));
          bookings.set(slot, booked);
          rows.push({
            matchId: match.id,
            title: `${match.homePlayerUsername || 'Team A'} vs ${match.awayPlayerUsername || 'Team B'}`,
            slotLabel: toLabel(slot),
            ground: grounds[i % grounds.length],
            rawMinutes: slot
          });
          cursor = slotIndex + 1;
          break;
        }
        autoFixedConflicts += 1;
        slotIndex += 1;
      }
    }

    return { rows, autoFixedConflicts };
  }, [orderedMatches, slotMinutes, grounds, durationMins]);

  const handleGenerate = () => {
    setGenerated(true);
    setSaveSuccess(false);
    setMatchOrder(schedulePool.map((m) => m.id));
    toast({
      title: "Schedule Optimized",
      description: "Match times have been aligned to avoid player overlaps.",
    });
  };

  const handleReschedule = (matchId: string) => {
    setSaveSuccess(false);
    setMatchOrder((prev) => {
      const index = prev.indexOf(matchId);
      if (index === -1 || index === prev.length - 1) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(index + 1, 0, item);
      return next;
    });
  };

  const handleSaveSchedule = async () => {
    if (isDemo) {
      toast({
        title: "Demo Mode",
        description: "Cannot save schedule in demo mode.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const today = new Date();
      for (const row of schedule.rows) {
        const scheduledTime = new Date(today);
        scheduledTime.setHours(Math.floor(row.rawMinutes / 60), row.rawMinutes % 60, 0, 0);
        
        await updateMatchSchedule(row.matchId, scheduledTime.toISOString(), row.ground);
      }
      
      setSaveSuccess(true);
      toast({
        title: "Schedule Published",
        description: "All matches have been updated with their new times and grounds.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "An error occurred while persisting the schedule.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="hover-lift-glow border-cyan-500/30 bg-black/60 backdrop-blur-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono tracking-tighter">
          <Zap className="w-5 h-5 fill-cyan-500 animate-pulse" />
          SMART_SCHEDULER.exe
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-xs text-cyan-100/60 font-mono leading-relaxed">
          // Automates fixture timing to prevent player fatigue and venue conflicts.
          // Optimized for real-time synchronization.
        </p>

        {isDemo && isCreator && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded border border-yellow-500/40 bg-yellow-500/5 p-3 text-[10px] font-mono text-yellow-200/80 flex items-start gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1 animate-ping" />
            <span>SANDBOX_MODE: Loading virtual matches for preview. Real-time persistence disabled.</span>
          </motion.div>
        )}

        {isCreator && (
          <div className="grid gap-4 bg-white/5 p-4 border border-white/10 rounded-lg">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Time Windows
              </label>
              <Input
                value={slotInput}
                onChange={(e) => setSlotInput(e.target.value)}
                className="bg-black/40 border-cyan-500/20 text-cyan-100 placeholder:text-cyan-900/50 h-9 text-sm"
                placeholder="09:00 AM, 10:30 AM..."
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Designated Grounds
              </label>
              <Input
                value={groundsInput}
                onChange={(e) => setGroundsInput(e.target.value)}
                className="bg-black/40 border-cyan-500/20 text-cyan-100 placeholder:text-cyan-900/50 h-9 text-sm"
                placeholder="Arena 1, Court B..."
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Match Duration (min)</label>
                <Input
                  type="number"
                  min={15}
                  step={5}
                  value={durationMins}
                  onChange={(e) => setDurationMins(Number(e.target.value || 60))}
                  className="bg-black/40 border-cyan-500/20 text-cyan-100 h-9 text-sm"
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono uppercase tracking-widest text-xs h-10 group"
            >
              <Zap className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
              Initialize Schedule
            </Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {generated && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono uppercase text-cyan-400/80">Computed Timeline</h3>
                {schedule.autoFixedConflicts > 0 && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                    {schedule.autoFixedConflicts} CONFLICTS_RESOLVED
                  </span>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {schedule.rows.map((row, idx) => (
                  <motion.div 
                    layout
                    key={row.matchId} 
                    className="group relative rounded-md border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-mono text-cyan-100 truncate w-[180px]">
                          [{idx + 1}] {row.title}
                        </p>
                        <div className="flex gap-3 mt-1.5">
                          <span className="text-[10px] text-cyan-400/60 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {row.slotLabel}
                          </span>
                          <span className="text-[10px] text-cyan-400/60 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {row.ground}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReschedule(row.matchId)}
                        className="h-6 w-6 text-cyan-400/40 hover:text-cyan-400 hover:bg-cyan-500/10"
                        title="Shift priority down"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {!isDemo && (
                <Button 
                  onClick={handleSaveSchedule}
                  disabled={isSaving || saveSuccess}
                  className={`w-full mt-4 font-mono uppercase tracking-widest text-xs h-10 transition-all ${
                    saveSuccess 
                    ? 'bg-green-600/20 text-green-400 border border-green-500/40' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : saveSuccess ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'UPLOADING...' : saveSuccess ? 'PUBLISHED' : 'SYNC_TO_DATABASE'}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.4);
        }
      `}</style>
    </Card>
  );
}
