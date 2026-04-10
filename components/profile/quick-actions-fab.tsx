'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TournamentQuick = {
  id: string;
  started: boolean;
  finished: boolean;
};

export default function QuickActionsFab({
  tournaments,
}: {
  tournaments: TournamentQuick[] | null;
}) {
  const [open, setOpen] = useState(false);

  const actionTargets = useMemo(() => {
    const activeTournament = (tournaments ?? []).find((t) => t.started && !t.finished);
    const pendingTournament = (tournaments ?? []).find((t) => !t.started && !t.finished);

    return {
      createHref: '/tournaments',
      addPlayerHref: pendingTournament
        ? `/tournaments/${pendingTournament.id}`
        : '/tournaments',
      startMatchHref: activeTournament ? `/tournaments/${activeTournament.id}` : '/tournaments',
    };
  }, [tournaments]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="space-y-2 rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur slide-in-live">
          <Link href={actionTargets.createHref} onClick={() => setOpen(false)}>
            <Button className="w-full justify-start">➕ Create Tournament</Button>
          </Link>
          <Link href={actionTargets.addPlayerHref} onClick={() => setOpen(false)}>
            <Button className="w-full justify-start" variant="outline">
              👥 Add Player
            </Button>
          </Link>
          <Link href={actionTargets.startMatchHref} onClick={() => setOpen(false)}>
            <Button className="w-full justify-start" variant="secondary">
              ⚡ Start Match
            </Button>
          </Link>
        </div>
      )}

      <Button
        onClick={() => setOpen((v) => !v)}
        className={`rounded-full h-14 w-14 p-0 text-lg shadow-xl ${
          open ? 'animate-pulse' : ''
        }`}
        aria-label="Quick actions"
      >
        {open ? '✕' : '⚡'}
      </Button>
    </div>
  );
}
