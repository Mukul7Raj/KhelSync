'use client';
import { createClient } from '@/utils/supabase/client';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';

interface GithubSignUpButtonProps {
  isLogin?: boolean;
}

export function GithubSignUpButton({
  isLogin = false,
}: GithubSignUpButtonProps) {
  const supabase = createClient();
  
  const handleGithubSignUp = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button 
      variant="outline" 
      className="w-full h-11 bg-muted/20 dark:bg-black/20 border border-border dark:border-white/10 text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white hover:border-black/40 dark:hover:border-white/40 hover:bg-muted/10 dark:hover:bg-white/5 transition-all duration-300 relative group overflow-hidden" 
      onClick={handleGithubSignUp}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
      <span className="relative z-10 flex items-center justify-center gap-2 font-semibold tracking-wider">
        <Github className="w-5 h-5" />
        {isLogin ? 'Sign in with GitHub' : 'Sign up with GitHub'}
      </span>
    </Button>
  );
}
