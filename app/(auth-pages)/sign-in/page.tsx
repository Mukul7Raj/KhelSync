import { signInAction } from '@/lib/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { GithubSignUpButton } from '@/components/auth/github-signup-button';
import { Separator } from '@/components/ui/separator';
import { AnimatedBackground } from '@/components/auth/animated-background';

export default async function Login(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) as Message;
  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      {/* Animated background layers */}
      <AnimatedBackground />

      {/* Login card with glowing aura */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glow aura behind card */}
        <div
          className="absolute -inset-4 rounded-2xl opacity-40 blur-xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,240,255,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
          }}
        />

        {/* Card */}
        <div className="relative bg-card/70 dark:bg-[#0a1128]/90 backdrop-blur-xl border border-border/50 dark:border-[#00f0ff]/20 rounded-2xl p-8 space-y-6 shadow-xl dark:shadow-[0_0_40px_rgba(0,240,255,0.08),0_0_80px_rgba(139,92,246,0.05)]">
          {/* Top accent line with pulsing glow */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_15px_#00f0ff] animate-pulse" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]/40 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]/40 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff2e88]/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff2e88]/30 rounded-br-2xl" />

          {/* Header */}
          <div className="space-y-4 text-center relative overflow-hidden pb-2">
            {/* Subtle scanline for header only */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(0deg,transparent_0%,rgba(0,240,255,1)_50%,transparent_100%)] bg-[length:100%_4px] animate-[scanline_4s_linear_infinite]" />
            
            {/* Brand/System Tag */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#00f0ff]/40" />
              <span className="text-[9px] text-[#00f0ff] font-mono tracking-[0.4em] uppercase opacity-70">
                Authorized Personnel Only
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#00f0ff]/40" />
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter">
                <span className="glitch-text cyber-gradient-text" data-text="KhelSync">
                  KhelSync
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[8px] font-mono text-muted-foreground/40 tracking-widest uppercase">
                  Encrypted_Link: ESTABLISHED
                </span>
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground/60 pt-2">
              {"New operative? "}
              <Link
                className="font-bold text-primary hover:text-primary/80 transition-all hover:tracking-wider"
                href="/sign-up"
              >
                Request Access
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground dark:text-[#00f0ff]/80 uppercase tracking-widest font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-muted/30 dark:bg-[#0d1a2d]/80 border-border dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground/30 focus:border-primary dark:focus:border-[#00f0ff]/50 focus:ring-primary/20 transition-all h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs text-muted-foreground dark:text-[#00f0ff]/80 uppercase tracking-widest font-semibold">
                    Password
                  </Label>
                  <Link
                    className="text-[10px] text-[#ff2e88]/70 hover:text-[#ff2e88] transition-colors uppercase tracking-wider font-semibold"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  className="bg-muted/30 dark:bg-[#0d1a2d]/80 border-border dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground/30 focus:border-primary dark:focus:border-[#00f0ff]/50 focus:ring-primary/20 transition-all h-11 rounded-lg"
                />
              </div>
            </div>

            {/* Sign in button with neon glow */}
            <SubmitButton
              pendingText="Authenticating..."
              formAction={signInAction}
              className="w-full h-11 bg-primary text-primary-foreground dark:bg-gradient-to-r dark:from-[#00f0ff]/20 dark:to-[#8b5cf6]/20 border dark:border-[#00f0ff]/40 dark:text-[#00f0ff] font-bold uppercase tracking-[0.15em] text-sm rounded-lg hover:bg-primary/90 dark:hover:from-[#00f0ff]/30 dark:hover:to-[#8b5cf6]/30 dark:hover:border-[#00f0ff]/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] dark:hover:text-white transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Sign in
              </span>
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>

          {/* Separator */}
          <div className="relative my-2">
            <Separator className="bg-border/50 dark:bg-white/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card dark:bg-[#0a1128] px-3 text-[10px] text-muted-foreground/40 uppercase tracking-widest font-semibold">
              Or
            </span>
          </div>

          {/* Github button */}
          <GithubSignUpButton isLogin={true} />

          {/* Footer accent */}
          <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#ff2e88]/30 to-transparent" />
        </div>

        {/* System status line under card */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399] animate-pulse" />
          <span className="text-[9px] text-muted-foreground/40 font-mono tracking-[0.2em] uppercase">
            System Online • Encrypted Connection
          </span>
        </div>
      </div>
    </div>
  );
}
