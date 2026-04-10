import TournmamentsBrowser from '@/components/browse-tournaments/tournament-browser';
import { getPublicTournaments } from '@/lib/actions';
import { Tournament } from '../types/types';

export interface TournamentWithStatus extends Tournament {
  status: 'waiting_for_players' | 'ongoing' | 'ended';
}

const Tournaments = async () => {
  const { tournaments: tournaments } = await getPublicTournaments();
  if (!tournaments) {
    return null;
  }

  let updatedTournaments = tournaments.map(
    (tournament): TournamentWithStatus => ({
      ...tournament,
      status: tournament.finished
        ? 'ended'
        : tournament.started
          ? 'ongoing'
          : 'waiting_for_players',
    })
  );

  // If DB is empty, provide demo stadiums for preview
  if (updatedTournaments.length === 0) {
    updatedTournaments = [
      {
        id: 'demo-1',
        name: 'Cyber Clash Open 2024',
        description: 'Elite level competition in the heart of Data City. Top tier matchmaking and real-time analytics active.',
        max_player_count: 16,
        player_count: 12,
        started: false,
        finished: false,
        created_at: new Date().toISOString(),
        status: 'waiting_for_players'
      },
      {
        id: 'demo-2',
        name: 'Neon Sprint Blitz',
        description: 'Fast-paced elimination tournament. No room for errors. Low latency battleground.',
        max_player_count: 8,
        player_count: 8,
        started: true,
        finished: false,
        created_at: new Date().toISOString(),
        status: 'ongoing'
      },
      {
        id: 'demo-3',
        name: 'Iron Circuit Legacy',
        description: 'The historic circuit returns. High stakes, higher rewards. Historical data archived.',
        max_player_count: 32,
        player_count: 32,
        started: true,
        finished: true,
        created_at: new Date().toISOString(),
        status: 'ended'
      }
    ] as any;
  }

  return <TournmamentsBrowser tournaments={updatedTournaments} />;
};

export default Tournaments;
