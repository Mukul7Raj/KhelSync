'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { SingleEliminationMatch } from '@/app/types/types';
import { Button } from '@/components/ui/button';

type LiveUpdate = {
  id: string;
  text: string;
  time: string;
};

const DEMO_UPDATES: LiveUpdate[] = [
  { id: 'demo-1', text: '⚡ Match started: Falcons vs Titans', time: 'Just now' },
  { id: 'demo-2', text: '🏆 Falcons won Round 1', time: '2 mins ago' },
  { id: 'demo-3', text: '🔥 Crowd momentum rising for Titans', time: '4 mins ago' },
];

export default function LiveHub({
  tournamentId,
  initialMatches,
  tournamentStarted,
}: {
  tournamentId: string;
  initialMatches: SingleEliminationMatch[] | null;
  tournamentStarted: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    '🔥': 0,
    '❤️': 0,
    '👏': 0,
  });
  const [predictionCounts, setPredictionCounts] = useState<Record<string, number>>({});
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const streamUrl = process.env.NEXT_PUBLIC_TOURNAMENT_STREAM_URL || '';
  const audienceChannelName = `audience-engagement-${tournamentId}`;
  const audienceChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const candidateOptions = useMemo(() => {
    const names = new Set<string>();
    for (const match of initialMatches ?? []) {
      if (match.homePlayerUsername) names.add(match.homePlayerUsername);
      if (match.awayPlayerUsername) names.add(match.awayPlayerUsername);
      if (names.size >= 4) break;
    }
    const options = Array.from(names).slice(0, 4);
    return options.length >= 2 ? options : ['Team Falcons', 'Team Titans'];
  }, [initialMatches]);

  useEffect(() => {
    const seedUpdates: LiveUpdate[] = (initialMatches ?? [])
      .filter((match) => !!match.winner_id)
      .slice(-6)
      .map((match) => {
        const winner =
          match.winner_id === match.home_player_id
            ? match.homePlayerUsername
            : match.awayPlayerUsername;
        return {
          id: `seed-${match.id}`,
          text: `🏆 ${winner || 'A player'} won Round ${match.round}`,
          time: 'Earlier',
        };
      });
    setUpdates(seedUpdates.length > 0 ? seedUpdates.reverse() : DEMO_UPDATES);

    if ((initialMatches?.length ?? 0) === 0) {
      setReactionCounts({ '🔥': 18, '❤️': 11, '👏': 14 });
      setPredictionCounts({ 'Team Falcons': 22, 'Team Titans': 18 });
      setSelectedPrediction('Team Falcons');
    }
  }, [initialMatches]);

  useEffect(() => {
    const channel = supabase
      .channel(`live-updates-${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'single_elimination_matches',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        (payload) => {
          const match = payload.new as SingleEliminationMatch;
          if (!match.winner_id) return;
          const winner =
            match.winner_id === match.home_player_id
              ? match.homePlayerUsername
              : match.awayPlayerUsername;

          const update: LiveUpdate = {
            id: `${match.id}-${Date.now()}`,
            text: `⚡ Live update: ${winner || 'A player'} won Round ${match.round}`,
            time: 'Just now',
          };
          setUpdates((prev) => [update, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, tournamentId]);

  useEffect(() => {
    const engagementChannel = supabase
      .channel(audienceChannelName)
      .on('broadcast', { event: 'reaction' }, ({ payload }) => {
        const emoji = payload?.emoji as string | undefined;
        if (!emoji) return;
        setReactionCounts((prev) => ({
          ...prev,
          [emoji]: (prev[emoji] ?? 0) + 1,
        }));
      })
      .on('broadcast', { event: 'prediction' }, ({ payload }) => {
        const pick = payload?.pick as string | undefined;
        if (!pick) return;
        setPredictionCounts((prev) => ({
          ...prev,
          [pick]: (prev[pick] ?? 0) + 1,
        }));
      })
      .subscribe();
    audienceChannelRef.current = engagementChannel;

    return () => {
      supabase.removeChannel(engagementChannel);
      audienceChannelRef.current = null;
    };
  }, [supabase, audienceChannelName]);

  const sendReaction = async (emoji: '🔥' | '❤️' | '👏') => {
    if (!audienceChannelRef.current) return;
    await audienceChannelRef.current.send({
      type: 'broadcast',
      event: 'reaction',
      payload: { emoji },
    });
  };

  const sendPrediction = async (pick: string) => {
    if (!audienceChannelRef.current) return;
    setSelectedPrediction(pick);
    setPredictionCounts((prev) => ({ ...prev, [pick]: (prev[pick] ?? 0) + 1 }));
    await audienceChannelRef.current.send({
      type: 'broadcast',
      event: 'prediction',
      payload: { pick },
    });
  };

  const totalPredictions = Object.values(predictionCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="space-y-4">
      <Card className="hover-lift-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Match Stream</span>
            {tournamentStarted && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-500 font-semibold animate-pulse">
                LIVE
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tournamentStarted && streamUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-md border">
              <iframe
                title="Tournament live stream"
                src={streamUrl}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              {tournamentStarted
                ? 'Live stream is not configured yet. Set `NEXT_PUBLIC_TOURNAMENT_STREAM_URL` to enable streaming.'
                : 'Stream goes live when the tournament starts.'}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="hover-lift-glow">
        <CardHeader>
          <CardTitle>Real-Time Match Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {updates.length > 0 ? (
            updates.map((item) => (
              <div key={item.id} className="rounded-md border p-3 slide-in-live">
                <p className="text-sm">{item.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No live updates yet. Match results will appear here automatically.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="hover-lift-glow">
        <CardHeader>
          <CardTitle>Live Chat + Reactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Tap a reaction and boost the energy in real time.
          </p>
          <div className="flex gap-2">
            {(['🔥', '❤️', '👏'] as const).map((emoji) => (
              <Button
                key={emoji}
                type="button"
                variant="outline"
                onClick={() => sendReaction(emoji)}
                className="text-base"
              >
                {emoji} {reactionCounts[emoji] ?? 0}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift-glow">
        <CardHeader>
          <CardTitle>Live Polls and Audience Predictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">📊 Who will win?</p>
          <div className="space-y-2">
            {candidateOptions.map((option) => {
              const count = predictionCounts[option] ?? 0;
              const percent = totalPredictions ? Math.round((count / totalPredictions) * 100) : 0;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => sendPrediction(option)}
                  className={`w-full rounded-md border p-3 text-left transition ${
                    selectedPrediction === option
                      ? 'border-primary ring-1 ring-primary/50'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span>{option}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded bg-muted overflow-hidden">
                    <div className="grid grid-cols-10 h-full gap-[2px]">
                      {Array.from({ length: 10 }).map((_, idx) => {
                        const active = idx < Math.max(Math.round(percent / 10), percent > 0 ? 1 : 0);
                        return (
                          <div
                            key={`${option}-bar-${idx}`}
                            className={active ? 'bg-primary transition-colors duration-500' : 'bg-muted'}
                          />
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            🎯 {totalPredictions} total predictions
          </p>
          <p className="text-sm font-semibold text-primary">
            “Audience becomes part of the match”
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
