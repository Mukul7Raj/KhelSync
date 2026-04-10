'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatisticsPanel from '@/components/profile/statistics-panel';
import LiveActivityFeed from '@/components/profile/live-activity-feed';

type UserStatistics = {
  tournamentCount: number;
  wonCount: number;
  matchesWon: number;
  matchesLost: number;
};

type PastMatch = {
  id: string;
  round: number;
  tournaments: { name: string };
  homePlayerUsername: string;
  awayPlayerUsername: string;
  winnerId: string;
  homePlayerId: string;
  awayPlayerId: string;
};

type FeedComment = {
  id: string;
  message: string;
  created_at: string;
  users: {
    username: string;
  };
};

type FeedTournament = {
  id: string;
  name: string;
  started: boolean;
  player_count?: number;
};

function RealTimeLeaderboard({
  pastMatches,
  liveMode,
}: {
  pastMatches: PastMatch[];
  liveMode: boolean;
}) {
  const leaders = useMemo(() => {
    const winsByPlayer: Record<string, number> = {};

    for (const match of pastMatches) {
      const winnerName =
        match.winnerId === match.homePlayerId
          ? match.homePlayerUsername
          : match.awayPlayerUsername;
      if (!winnerName) continue;
      winsByPlayer[winnerName] = (winsByPlayer[winnerName] ?? 0) + 1;
    }

    const sorted = Object.entries(winsByPlayer)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const max = Math.max(1, ...sorted.map(([, wins]) => wins));

    return sorted.map(([name, wins], index) => ({
      rank: index + 1,
      name,
      wins,
      segments: Math.max(Math.round((wins / max) * 10), 1),
    }));
  }, [pastMatches]);

  return (
    <Card className={`hover-lift-glow ${liveMode ? 'ring-1 ring-primary/40' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Real-Time Leaderboard</CardTitle>
          {liveMode && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-500 font-semibold animate-pulse">
              LIVE
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaders.length > 0 ? (
          leaders.map((leader) => (
            <div key={leader.name} className="space-y-1 hover-lift-glow rounded-md p-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  #{leader.rank} {leader.name}
                </span>
                <span className="text-muted-foreground">{leader.wins} wins</span>
              </div>
              <div className="h-2 rounded bg-muted overflow-hidden">
                <div className="grid grid-cols-10 h-full gap-[2px]">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={`${leader.name}-${idx}`}
                      className={`${
                        idx < leader.segments ? 'bg-primary' : 'bg-muted'
                      } transition-colors duration-500 ${
                        liveMode && idx < leader.segments ? 'animate-pulse' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No match results yet to build leaderboard.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProfileLiveDashboard({
  statistics,
  tournaments,
  pastMatches,
  comments,
}: {
  statistics?: UserStatistics;
  tournaments: FeedTournament[] | null;
  pastMatches: PastMatch[] | null;
  comments: FeedComment[] | null;
}) {
  const router = useRouter();
  const [liveMode, setLiveMode] = useState(false);
  useEffect(() => {
    if (!liveMode) return;

    const id = window.setInterval(() => {
      router.refresh();
    }, 8000);

    return () => window.clearInterval(id);
  }, [liveMode, router]);

  return (
    <div className="space-y-6">
      <Card className={`hover-lift-glow ${liveMode ? 'ring-1 ring-green-500/40' : ''}`}>
        <CardContent className="pt-6 flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Live Mode</p>
            <p className="text-xs text-muted-foreground">
              {liveMode
                ? 'Auto-refreshing scores and activity'
                : 'Turn on to watch live updates'}
            </p>
          </div>
          <Button
            onClick={() => setLiveMode((v) => !v)}
            variant={liveMode ? 'default' : 'outline'}
            className={liveMode ? 'animate-pulse' : ''}
          >
            {liveMode ? '🟢 Live Mode ON' : 'Live Mode OFF'}
          </Button>
        </CardContent>
      </Card>

      <StatisticsPanel
        statistics={statistics}
        tournaments={tournaments}
        pastMatches={pastMatches}
        liveMode={liveMode}
      />

      <RealTimeLeaderboard pastMatches={pastMatches ?? []} liveMode={liveMode} />

      <LiveActivityFeed
        comments={comments ?? []}
        pastMatches={pastMatches ?? []}
        tournaments={tournaments ?? []}
        liveMode={liveMode}
      />
    </div>
  );
}
