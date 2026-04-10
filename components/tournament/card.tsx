import { Tournament } from '@/app/types/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Sparkles, Play, Eye, Settings2 } from 'lucide-react';
import { Badge } from '../ui/badge';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const statusLabel = tournament.finished
    ? '🔴 Finished'
    : tournament.started
      ? '🟢 Live'
      : '🟡 Upcoming';

  const statusColors = {
    finished:
      'cyber-chip border-red-400/80 bg-red-600/20 text-red-200 shadow-[0_0_10px_rgba(255,0,77,0.35)]',
    started:
      'cyber-chip border-cyan-400/80 bg-cyan-500/20 text-cyan-100 shadow-[0_0_10px_rgba(0,240,255,0.35)]',
    waiting:
      'cyber-chip border-yellow-400/80 bg-yellow-500/20 text-yellow-100 shadow-[0_0_10px_rgba(255,214,0,0.35)]',
  };

  const maxPlayers = tournament.max_player_count || 10;
  const playerCount = tournament.player_count || 0;
  const progress = Math.max(0, Math.min(100, (playerCount / maxPlayers) * 100));
  const filledBlocks = Math.round(progress / 10);
  const bar = `${'█'.repeat(filledBlocks)}${'░'.repeat(10 - filledBlocks)}`;

  const getStatusBadge = (tournament: Tournament) => {
    if (tournament.finished) {
      return (
        <Badge variant="outline" className={statusColors.finished}>
          {statusLabel}
        </Badge>
      );
    } else if (tournament.started) {
      return (
        <Badge variant="outline" className={statusColors.started}>
          {statusLabel}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className={statusColors.waiting}>
          {statusLabel}
        </Badge>
      );
    }
  };

  return (
    <Card className="cyber-card group flex h-full flex-col transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(0,240,255,0.45)]">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start text-lg">
          <span className="overflow-hidden break-words mr-2 neon-title">
            {tournament.name}
          </span>
          {getStatusBadge(tournament)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {tournament.description || 'No description available'}
        </p>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-cyan-100">
            Players: {playerCount} / {maxPlayers}
          </p>
          <div className="h-2 w-full overflow-hidden border border-cyan-400/40 bg-[#081127]">
            <div
              className="h-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-[11px] tracking-wider text-cyan-200">{bar}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col pt-2">
        <div className="mb-2 flex w-full items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1 text-cyan-200">
            <Sparkles size={14} />
            <span>Arena Ready</span>
          </div>
          <span className="mr-1">
            {tournament.player_count}
            {tournament.max_player_count && ` / ${tournament.max_player_count}`}
          </span>
          <Users size={16} className="mr-1" />
        </div>
        <div className="grid w-full grid-cols-3 gap-2">
          <Link href={`/tournaments/${tournament.id}`} className="w-full">
            <Button size="sm" className="w-full cyber-btn text-[11px]">
              <Settings2 className="mr-1 h-3.5 w-3.5" />
              Manage
            </Button>
          </Link>
          <Link href={`/tournaments/${tournament.id}`} className="w-full">
            <Button size="sm" className="w-full cyber-btn text-[11px]">
              <Eye className="mr-1 h-3.5 w-3.5" />
              View
            </Button>
          </Link>
          <Link href={`/tournaments/${tournament.id}`} className="w-full">
            <Button size="sm" className="w-full cyber-btn text-[11px]">
              <Play className="mr-1 h-3.5 w-3.5" />
              Start
            </Button>
          </Link>
        </div>
        <p className="mt-2 text-[11px] text-fuchsia-200/80">
          ▶ Manage   👁 View   ⚡ Start Match
        </p>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
