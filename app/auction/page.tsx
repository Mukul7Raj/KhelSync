import { AuctionArena } from '@/components/auction/AuctionArena';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Auction Arena | KheSync',
  description: 'Real-time interactive player auction dashboard.',
};

export default function AuctionPage() {
  return (
    <main className="min-h-screen bg-black">
      <AuctionArena />
    </main>
  );
}
