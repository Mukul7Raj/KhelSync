import { getPublicMessages } from '@/lib/actions';
import { ChatBox } from './chatbox';

export default async function ChatComponent({
  tournamentId,
  canSendMessages = true,
}: {
  tournamentId: string;
  canSendMessages?: boolean;
}) {
  const { messages } = await getPublicMessages(tournamentId);
  const demoMessages = [
    {
      id: 'demo-chat-1',
      created_at: new Date().toISOString(),
      message: '🔥 What a start! Falcons looking sharp.',
      tournament_id: tournamentId,
      user_id: 'demo-user-1',
      users: { username: 'FanRohit' },
    },
    {
      id: 'demo-chat-2',
      created_at: new Date().toISOString(),
      message: '❤️ Titans comeback incoming!',
      tournament_id: tournamentId,
      user_id: 'demo-user-2',
      users: { username: 'CricketNerd' },
    },
    {
      id: 'demo-chat-3',
      created_at: new Date().toISOString(),
      message: '👏 Crowd energy is crazy today',
      tournament_id: tournamentId,
      user_id: 'demo-user-3',
      users: { username: 'StadiumLive' },
    },
  ];
  const displayMessages = messages && messages.length > 0 ? messages : demoMessages;

  return (
    <div>
      <ChatBox
        initMessages={displayMessages}
        tournamentId={tournamentId}
        canSendMessages={canSendMessages}
      />
    </div>
  );
}
