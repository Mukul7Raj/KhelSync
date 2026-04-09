import { getUserTournaments } from '@/lib/actions';
import TournamentDropdown from './my-tournaments-dropdown';
import { createClient } from '@/utils/supabase/server';

export default async function TournamentDropdownList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { ownTournaments, joinedTournaments } = await getUserTournaments(user.id);
  
  if (!ownTournaments || !joinedTournaments) {
    return null;
  }

  return (
    <TournamentDropdown
      ownTournaments={ownTournaments}
      joinedTournaments={joinedTournaments}
    />
  );
}
