'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TournamentItem = {
  id: string;
  name: string;
  description: string | null;
  player_count: number | null;
  started: boolean;
  finished: boolean;
};

type FilterMode = 'all' | 'active' | 'completed';

export default function TournamentsSmartList({
  tournaments,
}: {
  tournaments: TournamentItem[] | null;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = useMemo(() => {
    const list = tournaments ?? [];
    const term = search.trim().toLowerCase();

    return list.filter((tournament) => {
      const matchesSearch =
        !term ||
        tournament.name.toLowerCase().includes(term) ||
        (tournament.description ?? '').toLowerCase().includes(term);

      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'active'
            ? tournament.started && !tournament.finished
            : tournament.finished;

      return matchesSearch && matchesFilter;
    });
  }, [tournaments, search, filter]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournaments..."
            className="md:flex-1"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              type="button"
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              type="button"
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        filtered.map((tournament) => (
          <Card key={tournament.id} className="hover-lift-glow">
            <CardHeader>
              <CardTitle>{tournament.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <p>Players: {tournament.player_count ?? 0}</p>
                  <span>
                    {tournament.finished ? (
                      <span className="text-destructive">Tournament finished</span>
                    ) : tournament.started ? (
                      <span className="text-primary">Ongoing</span>
                    ) : (
                      <span className="text-secondary">Upcoming</span>
                    )}
                  </span>
                  <p className="text-muted-foreground line-clamp-2">
                    {tournament.description || 'No description yet.'}
                  </p>

                  {!tournament.started &&
                    !tournament.finished &&
                    (tournament.player_count ?? 0) === 0 && (
                      <div className="mt-3 rounded-md border border-dashed p-3 bg-muted/20">
                        <p className="font-medium">😴 No players yet</p>
                        <p className="text-sm text-muted-foreground">
                          Invite players to start the action!
                        </p>
                        <Link href={`/tournaments/${tournament.id}`}>
                          <Button size="sm" className="mt-2">
                            Invite Now
                          </Button>
                        </Link>
                      </div>
                    )}
                </div>
                <Link href={`/tournaments/${tournament.id}`}>
                  <Button variant="link" className="mt-2 px-4 py-2 rounded">
                    View Tournament
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No tournaments found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Try another search term or change the filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
