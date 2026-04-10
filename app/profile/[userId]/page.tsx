import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  getAllUserMatchResults,
  getAllUserOwnedPublicTournaments,
  getAuthUser,
  getProfileComments,
  getPublicUserData,
  getUserStatistics,
} from '@/lib/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SendMessageButton from '@/components/profile/send-message-button';
import { notFound } from 'next/navigation';
import ProfileLiveDashboard from '@/components/profile/profile-live-dashboard';
import TournamentsSmartList from '@/components/profile/tournaments-smart-list';
import QuickActionsFab from '@/components/profile/quick-actions-fab';

type Params = {
  userId: string;
};

const UserPage = async ({
  params,
}: {
  params: Promise<Params> | Params;
}) => {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.userId;

  const user = await getAuthUser(); // get user to check if it's the same as the public user
  //and also to check if the user is logged in

  if (!id || id === 'undefined' || id === 'null') {
    notFound();
  }

  const { data: publicUser } = await getPublicUserData(id);
  const { tournaments } = await getAllUserOwnedPublicTournaments(id);
  const { matchesWithUsernames: pastMatches } =
    await getAllUserMatchResults(id);
  const { data: statistics } = await getUserStatistics(id);

  if (!publicUser) {
    return <p>User not found</p>;
  }
  if (user && user.id === publicUser.id) {
    redirect('/profile');
  }
  const { comments } = await getProfileComments(id);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="cursor-pointer" style={{ width: 120, height: 120 }}>
          <AvatarImage src={publicUser.avatar_url || ''} alt="Profile" />
          <AvatarFallback>
            {publicUser.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Label className="text-2xl">
            {publicUser.username}{' '}
            {user && <SendMessageButton userId={publicUser.id} />}
          </Label>
          <p className="text-gray-600">
            {publicUser.bio || 'No bio provided.'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="owned">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owned">Hosted Tournaments</TabsTrigger>
              <TabsTrigger value="results">Match Results</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[800px]  rounded-md  mt-2">
              <TabsContent value="owned">
                <TournamentsSmartList tournaments={tournaments ?? null} />
              </TabsContent>
              <TabsContent value="results">
                <div className="space-y-4">
                  {pastMatches != null ? (
                    pastMatches.map((match) => (
                      <Card key={match.id}>
                        <CardHeader>
                          <CardTitle>
                            <span> {match.tournaments.name} </span>- Round{' '}
                            {match.round}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-muted-foreground">
                                <span>{match.homePlayerUsername}</span> vs{' '}
                                <span>{match.awayPlayerUsername}</span>
                              </p>
                              <p>
                                Winner:{' '}
                                <span className="font-bold text-secondary">
                                  {match.winnerId === match.homePlayerId
                                    ? match.homePlayerUsername
                                    : match.awayPlayerUsername}
                                </span>
                              </p>
                            </div>
                            <Link href={`/tournaments/${match.tournament_id}`}>
                              <Button
                                variant="link"
                                className="mt-2 px-4 py-2 rounded"
                              >
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
                        <p>No matches available</p>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <div className="space-y-6">
          <ProfileLiveDashboard
            statistics={statistics}
            tournaments={tournaments}
            pastMatches={pastMatches}
            comments={comments ?? []}
          />
        </div>
      </div>
      <QuickActionsFab tournaments={tournaments ?? null} />
    </div>
  );
};

export default UserPage;
