import { signUpAction } from '@/lib/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { GithubSignUpButton } from '@/components/auth/github-signup-button';
import { AnimatedBackground } from '@/components/auth/animated-background';

export default async function Signup(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) as Message;
  if ('message' in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4 bg-[#050914] relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10">
          <FormMessage message={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050914] relative overflow-hidden">
      {/* Animated background layers */}
      <AnimatedBackground />

      {/* Signup card with glowing aura */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glow aura behind card */}
        <div
          className="absolute -inset-4 rounded-2xl opacity-40 blur-xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, rgba(0,240,255,0.08) 40%, transparent 70%)',
          }}
        />

        {/* Card */}
        <div className="relative bg-[#0a1128]/90 backdrop-blur-xl border border-[#8b5cf6]/20 rounded-2xl p-8 space-y-6 shadow-[0_0_40px_rgba(139,92,246,0.08),0_0_80px_rgba(0,240,255,0.05)]">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8b5cf6]/40 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8b5cf6]/40 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]/30 rounded-br-2xl" />

          {/* Header */}
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#8b5cf6] rounded-full shadow-[0_0_8px_#8b5cf6] animate-pulse" />
              <span className="text-[10px] text-[#8b5cf6]/60 font-mono tracking-[0.3em] uppercase">
                Create New Node
              </span>
              <div className="w-2 h-2 bg-[#8b5cf6] rounded-full shadow-[0_0_8px_#8b5cf6] animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-white to-[#8b5cf6]">
                KhelSync
              </span>
            </h1>
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <Link
                className="font-semibold text-[#8b5cf6] hover:text-[#8b5cf6]/80 transition-colors hover:underline underline-offset-4"
                href="/sign-in"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs text-[#8b5cf6]/80 uppercase tracking-widest font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  minLength={3}
                  maxLength={20}
                  required
                  placeholder="Choose a callsign"
                  className="bg-[#0d1a2d]/80 border-white/10 text-white placeholder:text-white/20 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 transition-all h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-[#8b5cf6]/80 uppercase tracking-widest font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-[#0d1a2d]/80 border-white/10 text-white placeholder:text-white/20 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 transition-all h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-[#8b5cf6]/80 uppercase tracking-widest font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  className="bg-[#0d1a2d]/80 border-white/10 text-white placeholder:text-white/20 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 transition-all h-11 rounded-lg"
                />
              </div>
            </div>

            {/* Sign up button with neon glow */}
            <SubmitButton
              formAction={signUpAction}
              pendingText="Initializing Node..."
              className="w-full h-11 bg-gradient-to-r from-[#8b5cf6]/20 to-[#00f0ff]/20 border border-[#8b5cf6]/40 text-[#8b5cf6] font-bold uppercase tracking-[0.15em] text-sm rounded-lg hover:from-[#8b5cf6]/30 hover:to-[#00f0ff]/30 hover:border-[#8b5cf6]/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:text-white transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign up
              </span>
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>

          {/* Separator */}
          <div className="relative my-2">
            <Separator className="bg-white/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a1128] px-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">
              Or
            </span>
          </div>

          {/* GitHub button */}
          <GithubSignUpButton />

          {/* Footer accent */}
          <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />
        </div>

        {/* System status line under card */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399] animate-pulse" />
          <span className="text-[9px] text-white/25 font-mono tracking-[0.2em] uppercase">
            System Online • Encrypted Connection
          </span>
        </div>
      </div>
    </div>
  );
}
