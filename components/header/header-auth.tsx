import { getPublicUserData, signOutAction } from '@/lib/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { createClient } from '@/utils/supabase/server';
import { LogIn, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationComponent from './notifications-server';
import RecentChatsList from './recentChats';

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: publicUser, error: publicUserError } = await getPublicUserData(user?.id);

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={'default'}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={'default'}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <RecentChatsList user={user} />
      <NotificationComponent user={user} />
      <a href="/profile">
        <Avatar>
          <AvatarImage src={publicUser?.avatar_url} alt={publicUser?.username || ""} />{" "}
          <AvatarFallback>
            {(publicUser?.username || user.email || "?").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </a>

      <form action={signOutAction}>
        <Button type="submit" variant={'outline'} className="cyber-btn">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out 🚪
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-3">
      <Button asChild size="sm" variant={'outline'} className="cyber-btn border-white/10 bg-white/5 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/50 group transition-all">
        <Link href="/sign-in" className="flex items-center gap-2">
          <LogIn className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Sign in</span>
        </Link>
      </Button>
      <Button asChild size="sm" className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all rounded-none px-4">
        <Link href="/sign-up" className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest">Access Protocol</span>
        </Link>
      </Button>
    </div>
  );
}
