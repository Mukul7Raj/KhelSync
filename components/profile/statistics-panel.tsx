'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Swords } from 'lucide-react';

type UserStatistics = {
  tournamentCount: number;
  wonCount: number;
  matchesWon: number;
  matchesLost: number;
};

type PastMatch = {
  winnerId?: string;
  homePlayerId?: string;
  awayPlayerId?: string;
  homePlayerUsername?: string;
  awayPlayerUsername?: string;
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 24;
    const id = window.setInterval(() => {
      frame += 1;
      const next = Math.round((value * frame) / totalFrames);
      setDisplay(next);
      if (frame >= totalFrames) {
        window.clearInterval(id);
      }
    }, 25);

    return () => window.clearInterval(id);
  }, [value]);

  return <span>{display}</span>;
}

export default function StatisticsPanel({
  statistics,
  tournaments,
  pastMatches,
  liveMode = false,
}: {
  statistics?: UserStatistics;
  tournaments: { player_count?: number }[] | null;
  pastMatches: PastMatch[] | null;
  liveMode?: boolean;
}) {
  const totalMatches = (statistics?.matchesWon ?? 0) + (statistics?.matchesLost ?? 0);
  const winRate = totalMatches
    ? Math.round(((statistics?.matchesWon ?? 0) / totalMatches) * 100)
    : 0;

  const activePlayers = useMemo(
    () => (tournaments ?? []).reduce((sum, t) => sum + (t.player_count ?? 0), 0),
    [tournaments]
  );

  const topScorer = useMemo(() => {
    const scores: Record<string, number> = {};
    for (const match of pastMatches ?? []) {
      if (!match.winnerId) continue;
      const winnerName =
        match.winnerId === match.homePlayerId
          ? match.homePlayerUsername
          : match.awayPlayerUsername;
      if (!winnerName) continue;
      scores[winnerName] = (scores[winnerName] ?? 0) + 1;
    }

    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
  }, [pastMatches]);

  const chartData = [
    { label: 'Wins', value: statistics?.matchesWon ?? 0, color: 'bg-green-500' },
    { label: 'Losses', value: statistics?.matchesLost ?? 0, color: 'bg-red-500' },
    { label: 'Tourneys Won', value: statistics?.wonCount ?? 0, color: 'bg-yellow-500' },
  ];
  const chartMax = Math.max(1, ...chartData.map((d) => d.value));

  const circleRadius = 44;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (winRate / 100) * circumference;

  return (
    <Card className={`hover-lift-glow ${liveMode ? 'ring-1 ring-primary/40' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Statistics</CardTitle>
          {liveMode && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-500 font-semibold animate-pulse">
              LIVE
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3 hover-lift-glow">
            <p className="text-xs text-muted-foreground">Matches Played</p>
            <p className="text-2xl font-semibold">
              <AnimatedNumber value={totalMatches} />
            </p>
          </div>
          <div className="rounded-lg border p-3 hover-lift-glow">
            <p className="text-xs text-muted-foreground">Active Players</p>
            <p className="text-2xl font-semibold">
              <AnimatedNumber value={activePlayers} />
            </p>
          </div>
          <div className="rounded-lg border p-3 col-span-2 hover-lift-glow">
            <p className="text-xs text-muted-foreground mb-1">Top Scorer</p>
            <p className="text-lg font-semibold truncate">{topScorer}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border p-4 hover-lift-glow">
          <div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-semibold">
              <AnimatedNumber value={winRate} />%
            </p>
          </div>
          <div className="relative h-28 w-28">
            <svg
              viewBox="0 0 120 120"
              className={`h-28 w-28 -rotate-90 ${liveMode ? 'animate-pulse' : ''}`}
            >
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                stroke="currentColor"
                className="text-muted"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                stroke="currentColor"
                className="text-primary transition-all duration-700"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
              {winRate}%
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 hover-lift-glow">
          <p className="text-sm font-medium mb-3">Performance Breakdown</p>
          <div className="grid grid-cols-3 gap-3 items-end h-28">
            {chartData.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="h-20 w-full grid grid-rows-10 gap-1">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const segmentThreshold = ((10 - idx) / 10) * chartMax;
                    const isActive = item.value >= segmentThreshold;
                    return (
                      <div
                        key={`${item.label}-${idx}`}
                        className={`rounded-sm transition-colors duration-500 ${
                          isActive ? item.color : 'bg-muted'
                        } ${liveMode && isActive ? 'animate-pulse' : ''}`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-center text-muted-foreground leading-tight">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg border p-2 hover-lift-glow">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{statistics?.wonCount ?? 0} tournaments won</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-2 hover-lift-glow">
            <Swords className="h-4 w-4 text-green-600" />
            <span>{statistics?.matchesWon ?? 0} wins</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-2 col-span-2 hover-lift-glow">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{statistics?.tournamentCount ?? 0} tournaments participated</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
