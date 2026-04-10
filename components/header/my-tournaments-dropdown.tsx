'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trophy } from 'lucide-react';

interface DropdownTournament {
  id: string;
  name: string;
}

interface TournamentDropdownProps {
  ownTournaments: DropdownTournament[];
  joinedTournaments: DropdownTournament[];
}

export default function TournamentDropdown({
  ownTournaments,
  joinedTournaments,
}: TournamentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleTournamentClick = (tournamentId: string) => {
    router.push(`/tournaments/${tournamentId}`);
    setIsOpen(false);
  };

  const renderTournamentList = (
    tournaments: DropdownTournament[],
    type: 'joined' | 'owned'
  ) => (
    <div className="space-y-1">
      {tournaments.map((tournament) => (
        <DropdownMenuItem
          key={tournament.id}
          onClick={() => handleTournamentClick(tournament.id)}
          className="cursor-pointer"
        >
          {tournament.name}
        </DropdownMenuItem>
      ))}
      {tournaments.length === 0 && (
        <>
          <DropdownMenuItem disabled>No tournaments found</DropdownMenuItem>
          <DropdownMenuItem disabled className="text-cyan-200/70">
            {type === 'joined'
              ? 'Demo: ⚔ Neon Knockout League'
              : 'Demo: 🏆 Cyber Champions Cup'}
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="text-cyan-200/70">
            {type === 'joined'
              ? 'Demo: 🎮 Weekend Scrim Arena'
              : 'Demo: ⚡ Midnight Sports Showdown'}
          </DropdownMenuItem>
        </>
      )}
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="cyber-btn">🎮 My Tournaments</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 cyber-card">
        <DropdownMenuLabel className="neon-title flex items-center gap-2">
          <Trophy className="h-4 w-4" /> My Tournaments 🕹️
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Tabs defaultValue="joined" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="joined" className="text-xs">
              Joined 🤝
            </TabsTrigger>
            <TabsTrigger value="owned" className="text-xs">
              Owned 👑
            </TabsTrigger>
          </TabsList>
          <TabsContent value="joined">
            {renderTournamentList(joinedTournaments, 'joined')}
          </TabsContent>
          <TabsContent value="owned">
            {renderTournamentList(ownTournaments, 'owned')}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
