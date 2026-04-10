'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SingleEliminationMatch } from '@/app/types/types';

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
}: {
  matches: SingleEliminationMatch[] | null;
}) {
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
  const schedulePool =
    schedulableMatches.length > 0 ? schedulableMatches : DEMO_MATCHES;

  const [generated, setGenerated] = useState(false);
  const [durationMins, setDurationMins] = useState(60);
  const [slotInput, setSlotInput] = useState('10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM');
  const [groundsInput, setGroundsInput] = useState('Ground 1');
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
    setMatchOrder(schedulePool.map((m) => m.id));
  };

  const handleReschedule = (matchId: string) => {
    setGenerated(true);
    setMatchOrder((prev) => {
      const index = prev.indexOf(matchId);
      if (index === -1 || index === prev.length - 1) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(index + 1, 0, item);
      return next;
    });
  };

  return (
    <Card className="hover-lift-glow">
      <CardHeader>
        <CardTitle>Smart Match Scheduler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Fixes organizer pain: generates conflict-free schedules from players,
          time slots, and optional grounds.
        </p>
        {schedulableMatches.length === 0 && (
          <div className="rounded-md border border-blue-500/40 bg-blue-500/10 p-3 text-sm">
            Demo data loaded for hackathon preview (3 sample matches).
          </div>
        )}

        <div className="grid gap-3">
          <div>
            <p className="text-xs mb-1 text-muted-foreground">
              Available time slots (comma-separated)
            </p>
            <Input
              value={slotInput}
              onChange={(e) => setSlotInput(e.target.value)}
              placeholder="10:00 AM, 11:00 AM, 12:00 PM"
            />
          </div>
          <div>
            <p className="text-xs mb-1 text-muted-foreground">Grounds (optional)</p>
            <Input
              value={groundsInput}
              onChange={(e) => setGroundsInput(e.target.value)}
              placeholder="Ground 1, Ground 2"
            />
          </div>
          <div>
            <p className="text-xs mb-1 text-muted-foreground">Match duration (minutes)</p>
            <Input
              type="number"
              min={15}
              step={5}
              value={durationMins}
              onChange={(e) => setDurationMins(Number(e.target.value || 60))}
            />
          </div>
          <Button onClick={handleGenerate} className="w-full">
            ⚡ Generate Smart Schedule
          </Button>
        </div>

        {generated && (
          <div className="space-y-3">
            {schedule.autoFixedConflicts > 0 && (
              <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
                ⚠ Player conflict detected and auto-fixed ({schedule.autoFixedConflicts}{' '}
                shift{schedule.autoFixedConflicts > 1 ? 's' : ''})
              </div>
            )}

            {schedule.rows.map((row, idx) => (
              <div key={row.matchId} className="rounded-md border p-3">
                <p className="font-medium">
                  Match {idx + 1}: {row.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  📅 {row.slotLabel} • {row.ground}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleReschedule(row.matchId)}
                  className="mt-2"
                >
                  🔄 Reschedule Match
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
