'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type FeedComment = {
  id: string;
  message: string;
  created_at: string;
  users: {
    username: string;
  };
};

type FeedMatch = {
  id: string;
  round: number;
  tournaments: { name: string };
  homePlayerUsername: string;
  awayPlayerUsername: string;
  winnerId: string;
  homePlayerId: string;
  awayPlayerId: string;
};

type FeedTournament = {
  id: string;
  name: string;
  started: boolean;
};

type ActivityItem = {
  id: string;
  message: string;
  timeLabel: string;
};

export default function LiveActivityFeed({
  comments,
  pastMatches,
  tournaments,
  liveMode = false,
}: {
  comments: FeedComment[];
  pastMatches: FeedMatch[];
  tournaments: FeedTournament[];
  liveMode?: boolean;
}) {
  const previousMatchIdsRef = useRef<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const commentEvents: ActivityItem[] = comments.slice(0, 6).map((comment) => ({
    id: `comment-${comment.id}`,
    message: `💬 ${comment.users.username}: ${comment.message}`,
    timeLabel: new Date(comment.created_at).toLocaleString(),
  }));

  const matchEvents: ActivityItem[] = pastMatches.slice(0, 6).map((match) => {
    const winnerName =
      match.winnerId === match.homePlayerId
        ? match.homePlayerUsername
        : match.awayPlayerUsername;
    return {
      id: `match-${match.id}`,
      message: `🏆 ${winnerName} won Round ${match.round} in ${match.tournaments.name}`,
      timeLabel: 'Recently',
    };
  });

  const tournamentEvents: ActivityItem[] = tournaments
    .filter((t) => t.started)
    .slice(0, 4)
    .map((tournament) => ({
      id: `tournament-${tournament.id}`,
      message: `⚡ Match started in ${tournament.name}`,
      timeLabel: 'Live',
    }));

  const liveItems = [...tournamentEvents, ...matchEvents, ...commentEvents].slice(
    0,
    12
  );
  const matchIds = useMemo(() => pastMatches.map((m) => m.id), [pastMatches]);

  useEffect(() => {
    const previousIds = previousMatchIdsRef.current;
    if (!previousIds.length) {
      previousMatchIdsRef.current = matchIds;
      return;
    }

    const hasNewMatchResult = matchIds.some((id) => !previousIds.includes(id));
    if (hasNewMatchResult && liveMode) {
      setShowConfetti(true);
      const timer = window.setTimeout(() => setShowConfetti(false), 900);
      previousMatchIdsRef.current = matchIds;
      return () => window.clearTimeout(timer);
    }

    previousMatchIdsRef.current = matchIds;
  }, [matchIds, liveMode]);

  return (
    <Card className={`relative hover-lift-glow ${liveMode ? 'ring-1 ring-primary/40' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Activity Feed</CardTitle>
          {liveMode && (
            <span className="flex items-center gap-2 text-xs text-red-500 animate-pulse font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              LIVE
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showConfetti && (
          <div className="confetti-pop" aria-hidden>
            <span className="confetti-piece confetti-1">🎉</span>
            <span className="confetti-piece confetti-2">✨</span>
            <span className="confetti-piece confetti-3">🎉</span>
            <span className="confetti-piece confetti-4">🏆</span>
            <span className="confetti-piece confetti-5">✨</span>
            <span className="confetti-piece confetti-6">🎊</span>
            <span className="confetti-piece confetti-7">🎉</span>
            <span className="confetti-piece confetti-8">✨</span>
          </div>
        )}
        <ScrollArea className="h-[280px] pr-3">
          <div className="space-y-3">
            {liveItems.length > 0 ? (
              liveItems.map((item) => (
                <div key={item.id} className="rounded-lg border p-3 slide-in-live hover-lift-glow">
                  <p className="text-sm">{item.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.timeLabel}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No live activity yet. Once matches and comments come in, events will
                appear here.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
