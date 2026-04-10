import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { MatchNode } from './single-elimination-bracket';
import { MatchModal } from './match-modal';
import { User } from '@supabase/supabase-js';
import clsx from 'clsx';

export interface MatchCardClientProps {
  match: MatchNode;
  user: User | null;
  isCreator: boolean;
}

export const MatchCard: React.FC<MatchCardClientProps> = ({
  match,
  user,
  isCreator,
}) => {
  const actualMatch = match.match;
  const userIsPlayer =
    user &&
    (user.id === actualMatch.home_player_id ||
      user.id === actualMatch.away_player_id);
  const creatorIsOverriding = userIsPlayer
    ? isCreator && !!actualMatch.winner_id
    : isCreator;

  if (
    actualMatch.winner_id &&
    actualMatch.round === 1 &&
    actualMatch.id === 'bye'
  ) {
    return (
      <Card className="w-[200px]">
        <CardContent className="pt-6 space-y-4">
          <p className="text-pretty text-muted-foreground truncate max-w-full">
            {actualMatch.home_player_id == actualMatch.winner_id
              ? actualMatch.homePlayerUsername
              : actualMatch.awayPlayerUsername}{' '}
            advances automatically
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[200px] relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-500 bg-black/40 backdrop-blur-md border-white/10">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <CardContent className="pt-6 space-y-4">
        {(actualMatch.scheduled_time || actualMatch.ground) && (
          <div className="flex flex-wrap gap-2 mb-2">
            {actualMatch.scheduled_time && (
              <div className="flex items-center gap-1 text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 border border-cyan-500/20 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                {new Date(actualMatch.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {actualMatch.ground && (
              <div className="flex items-center gap-1 text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 border border-indigo-500/20 font-mono">
                {actualMatch.ground}
              </div>
            )}
          </div>
        )}
        <p
          className={clsx('truncate max-w-full font-mono text-sm', {
            'text-green-700 dark:text-green-400':
              actualMatch.winner_id &&
              actualMatch.home_player_id === actualMatch.winner_id,
            'text-destructive':
              actualMatch.winner_id &&
              actualMatch.home_player_id !== actualMatch.winner_id,
            'text-muted-foreground': !actualMatch.home_player_id,
          })}
        >
          {actualMatch.home_player_id ? actualMatch.homePlayerUsername : 'TBD'}
        </p>
        <Separator className="bg-white/10" />
        <p
          className={clsx('truncate max-w-full font-mono text-sm', {
            'text-green-700 dark:text-green-400':
              actualMatch.winner_id &&
              actualMatch.away_player_id === actualMatch.winner_id,
            'text-destructive':
              actualMatch.winner_id &&
              actualMatch.away_player_id !== actualMatch.winner_id,
            'text-muted-foreground': !actualMatch.away_player_id,
          })}
        >
          {actualMatch.away_player_id ? actualMatch.awayPlayerUsername : 'TBD'}
        </p>
      </CardContent>
      {(userIsPlayer || creatorIsOverriding) && (
        <div
          className={clsx(
            'absolute inset-0 bg-accent/0 hover:bg-accent/50 transition-all duration-300 flex items-center justify-center',
            userIsPlayer && 'border-4 border-accent'
          )}
        >
          <MatchModal
            match={actualMatch}
            user={user}
            creatorIsOverriding={creatorIsOverriding}
          />
        </div>
      )}
    </Card>
  );
};
