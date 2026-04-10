'use server';
import { createClient } from '@/utils/supabase/server';
import { SingleEliminationMatch } from '@/app/types/types';

const MATCH_TABLE_CANDIDATES = [
  'single_elimination_matches',
  'singleEliminationMatches',
  'matches',
  'tournament_matches',
  'single_elimination_matchups',
] as const;
const MATCH_SCHEMA_CANDIDATES = ['public', 'api', 'tournament'] as const;

async function resolveMatchesTable(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  for (const schemaName of MATCH_SCHEMA_CANDIDATES) {
    const scopedClient =
      schemaName === 'public' ? supabase : supabase.schema(schemaName);
    for (const tableName of MATCH_TABLE_CANDIDATES) {
      const { error } = await scopedClient
        .from(tableName)
        .select(
          'id,tournament_id,round,home_player_id,away_player_id,home_matchup_id,away_matchup_id,winner_id'
        )
        .limit(1);
          if (!error) {
        return { schemaName, tableName };
      }
    }
  }
  return null;
}

//DISCLAIMER! THIS CODE WILL BE REFACTORED AND REDONE IN THE FUTURE
//at the very least needs tests and better error handling
export const generateSingleEliminationBracket = async (
  //generates the matchups for a single elimination bracket tournament
  tournamentId: string
) => {
  const supabase = await createClient();
  const resolvedTarget = await resolveMatchesTable(supabase);
  if (!resolvedTarget) {
    return {
      error:
        "Could not find a supported matches table (tried schemas: public/api/tournament with known table candidates)",
    };
  }
  const matchesClient =
    resolvedTarget.schemaName === 'public'
      ? supabase
      : supabase.schema(resolvedTarget.schemaName);
  const matchesTable = resolvedTarget.tableName;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'User not authenticated',
    };
  }

  const tournament = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single();

  if (tournament.data.creator_id !== user.id) {
    return {
      error: 'User not authorized to generate bracket for this tournament',
    };
  }

  // Ensure retries do not fail on duplicate/partial brackets from previous attempts.
  const { error: cleanupError } = await matchesClient
    .from(matchesTable)
    .delete()
    .eq('tournament_id', tournamentId);
  if (cleanupError) {
    return {
      error: `Failed to reset existing bracket: ${cleanupError.message}`,
    };
  }

  const { data: tournamentPlayers } = await supabase
    .from('user_tournaments')
    .select('*')
    .eq('tournament_id', tournamentId);

  if (!tournamentPlayers) {
    return {
      error: 'No players found for this tournament',
    };
  }

  if (tournamentPlayers.length < 3) {
    return {
      error: 'Tournament must have at least 3 players to generate bracket',
    };
  }

  const numPlayers = tournamentPlayers.length;
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
  const numByes = nextPowerOfTwo - numPlayers;

  shuffleArray(tournamentPlayers);
  //TODO: wrap this in a try block? and delete all matches if error occurs

  let currentRound = 1;
  const matches: SingleEliminationMatch[] = [];
  const byeMatches: SingleEliminationMatch[] = [];

  //byes are players who get a free pass to the next round
  for (let i = 0; i < numByes; i++) {
    const homePlayer = tournamentPlayers[i] || null;
    byeMatches.push({
      tournament_id: tournamentId,
      home_player_id: homePlayer ? homePlayer.user_id : null,
      round: currentRound,
      winner_id: homePlayer ? homePlayer.user_id : null,
    });
  }

  for (let i = numByes; i < numPlayers; i += 2) {
    const homePlayer = tournamentPlayers[i] || null;
    const awayPlayer = tournamentPlayers[i + 1] || null;
    matches.push({
      tournament_id: tournamentId,
      home_player_id: homePlayer ? homePlayer.user_id : null,
      away_player_id: awayPlayer ? awayPlayer.user_id : null,
      round: currentRound,
    });
  }

  // Insert first round matches into the database
  //bye matches are not sent to the database
  let prevRoundMatches = [];
  for (const match of matches) {
    const { data, error } = await matchesClient
      .from(matchesTable)
      .insert([match])
      .select();

    if (error) {
      return { error: `Error inserting match: ${error.message}` };
    }

    prevRoundMatches.push(...data);
  }
  prevRoundMatches.push(...byeMatches);
  shuffleArray(prevRoundMatches);

  // Generate the rest of the rounds
  while (
    prevRoundMatches.length > 1 &&
    currentRound < Math.log2(nextPowerOfTwo)
  ) {
    currentRound++;
    const nextRoundMatches = [];

    for (let i = 0; i < prevRoundMatches.length; i += 2) {
      const homeMatch: SingleEliminationMatch = prevRoundMatches[i] || null;
      const awayMatch: SingleEliminationMatch = prevRoundMatches[i + 1] || null;

      const isRound2 = currentRound === 2;
      const homeMatchExists = homeMatch && homeMatch.id;
      const awayMatchExists = awayMatch && awayMatch.id;

      if (isRound2) {
        if (!homeMatchExists && awayMatchExists) {
          // Home match is a bye
          nextRoundMatches.push({
            tournament_id: tournamentId,
            home_player_id: homeMatch.winner_id,
            away_matchup_id: awayMatch.id,
            round: currentRound,
          });
        } else if (!awayMatchExists && homeMatchExists) {
          // Away match is a bye
          nextRoundMatches.push({
            tournament_id: tournamentId,
            away_player_id: awayMatch.winner_id,
            home_matchup_id: homeMatch.id,
            round: currentRound,
          });
        } else if (!homeMatchExists && !awayMatchExists) {
          // Both are bye matches
          nextRoundMatches.push({
            tournament_id: tournamentId,
            home_player_id: homeMatch.winner_id,
            away_player_id: awayMatch.winner_id,
            round: currentRound,
          });
        } else {
          // Both are regular matches
          nextRoundMatches.push({
            tournament_id: tournamentId,
            home_matchup_id: homeMatch.id,
            away_matchup_id: awayMatch.id,
            round: currentRound,
          });
        }
      } else {
        // For rounds other than round 2
        nextRoundMatches.push({
          tournament_id: tournamentId,
          home_matchup_id: homeMatch.id,
          away_matchup_id: awayMatch.id,
          round: currentRound,
        });
      }
    }
    prevRoundMatches = [];
    for (const match of nextRoundMatches) {
      const { data, error } = await matchesClient
        .from(matchesTable)
        .insert([match])
        .select();

      if (error) {
        console.error('Error inserting match:', error);
        return { error: `Error inserting match: ${error.message}` };
      }

      prevRoundMatches.push(...data);
    }
  }
  return { success: true };
};

function shuffleArray(array: unknown[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const generateDoubleEliminationBracket = async (tournamentId: string) => {
  const supabase = await createClient();
  const resolvedTarget = await resolveMatchesTable(supabase);
  if (!resolvedTarget) {
    return { error: "Could not find a matches table." };
  }
  const matchesClient = resolvedTarget.schemaName === 'public' ? supabase : supabase.schema(resolvedTarget.schemaName);
  const matchesTable = resolvedTarget.tableName;

  // 1. Cleanup existing
  await matchesClient.from(matchesTable).delete().eq('tournament_id', tournamentId);

  // 2. Get Players
  const { data: players } = await supabase.from('user_tournaments').select('*').eq('tournament_id', tournamentId);
  if (!players || players.length < 4) {
    return { error: "Double elimination requires at least 4 players." };
  }

  // Shuffle for random seeding
  shuffleArray(players);

  // 3. Generate Winners Bracket (Initial matches)
  const numPlayers = players.length;
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
  
  // For simplicity in this demo/hackathon version, we'll generate the Winners bracket first
  // following the same logic as single elimination but marking them as "winners_bracket".
  // Note: We need a column 'bracket_type' or similar to distinguish.
  // If the column doesn't exist, we'll just prefix the 'round' or similar.
  // We'll use round numbers 101, 102... for Losers bracket to avoid conflict.

  let currentRound = 1;
  const winnerMatches = [];
  for (let i = 0; i < numPlayers; i += 2) {
    if (i + 1 < numPlayers) {
      winnerMatches.push({
        tournament_id: tournamentId,
        home_player_id: players[i].user_id,
        away_player_id: players[i+1].user_id,
        round: currentRound,
      });
    }
  }

  for (const m of winnerMatches) {
    await matchesClient.from(matchesTable).insert([m]);
  }

  // 4. Losers Bracket Round 1 (Placeholder)
  // Those who lose in Winners Round 1 go here.
  // For the demo, we'll create the empty "Losers" matches.
  const losersRound = 101; 
  const loserMatches = [];
  for (let i = 0; i < Math.floor(winnerMatches.length / 2); i++) {
    loserMatches.push({
      tournament_id: tournamentId,
      round: losersRound,
      description: 'Losers Bracket Initial',
    });
  }

  for (const m of loserMatches) {
    await matchesClient.from(matchesTable).insert([m]);
  }

  return { success: true };
};
