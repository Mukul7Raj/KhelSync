'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { joinTournament } from '@/lib/actions';
import JoinAnimation from './JoinAnimation';

interface JoinButtonProps {
  user: User | null;
  tournamentId: string;
}

export function JoinButton({ user, tournamentId }: JoinButtonProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [joinResponse, setJoinResponse] = useState<{
    success?: boolean;
    error?: string;
  } | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!joinResponse || !animationDone) return;

    if (joinResponse.success) {
      toast({
        title: 'Success',
        description: 'Joined Tournament Successfully',
      });
      router.refresh();
    } else if (joinResponse.error) {
      toast({
        title: 'Error',
        description: joinResponse.error,
      });
    }

    setShowJourney(false);
    setJoinResponse(null);
    setAnimationDone(false);
    setIsJoining(false);
  }, [joinResponse, animationDone, router, toast]);

  const handleJoin = async () => {
    setIsJoining(true);
    setShowJourney(true);
    try {
      const response = await joinTournament(tournamentId);
      setJoinResponse(response);
    } finally {
      // resolved after animation completion effect
    }
  };

  const handleLoginRedirect = () => {
    // Redirect to login page
    //TODO: should remember the page user was on before login and return to that page after login
    router.push('/sign-in');
  };

  if (!user) {
    return (
      <div className="text-center">
        <Button
          onClick={handleLoginRedirect}
          className="w-full sm:w-auto cyber-btn"
        >
          Log in to Join Tournament 🔐
        </Button>
        <p className="mt-2 text-sm text-gray-600">
          You must be logged in to join the tournament.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-3">
      <JoinAnimation open={showJourney} onComplete={() => setAnimationDone(true)} />
      <Button
        onClick={handleJoin}
        disabled={isJoining}
        className="w-full sm:w-auto cyber-btn transition-transform hover:scale-105"
      >
        {isJoining ? 'Joining Journey... ⚡' : 'Join Tournament 🤝'}
      </Button>
    </div>
  );
}
