'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { startTournament } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import TournamentStartAnimation from './TournamentStartAnimation';

interface StartTournamentButtonProps {
  tournamentId: string;
}

export default function StartTournamentButton({
  tournamentId,
}: StartTournamentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [resultState, setResultState] = useState<{
    success?: boolean;
    error?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (!resultState) return;

    const id = window.setTimeout(() => {
      if (resultState.success) {
        toast({
          title: 'Success',
          description: resultState.message,
        });
        router.refresh();
      } else if (resultState.error) {
        toast({
          title: 'Error',
          description: resultState.error,
          variant: 'destructive',
        });
      }
      setShowAnimation(false);
      setShowSuccessState(false);
      setResultState(null);
    }, 700);

    return () => window.clearTimeout(id);
  }, [resultState, router, toast]);

  const handleClick = () => {
    setShowAnimation(true);
    startTransition(async () => {
      const result = await startTournament(tournamentId);
      if (result.success) {
        setShowSuccessState(true);
        setResultState({ success: true, message: result.message });
      } else {
        setResultState({ error: result.error });
      }
    });
  };

  return (
    <div className="relative space-y-2">
      <TournamentStartAnimation open={showAnimation || isPending} success={showSuccessState} />
      <Button
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center space-x-2 w-full bg-cyan-500 text-black hover:bg-cyan-400 transition-transform hover:scale-105 font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      >
        <Trophy className={`w-4 h-4 ${isPending ? 'animate-bounce' : ''}`} />
        <span>
          {isPending ? 'Building Bracket Journey...' : 'Start Tournament'}
        </span>
      </Button>
      <p className="text-[10px] text-yellow-200/80">Bracket generation with animated flow</p>
    </div>
  );
}
