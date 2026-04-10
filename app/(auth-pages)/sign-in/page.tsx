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
    <div className="flex items-center justify-center min-h-screen bg-[#050914] relative overflow-hidden">
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
        <div className="relative bg-[#0a1128]/90 backdrop-blur-xl border border-[#00f0ff]/20 rounded-2xl p-8 space-y-6 shadow-[0_0_40px_rgba(0,240,255,0.08),0_0_80px_rgba(139,92,246,0.05)]">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]/40 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]/40 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff2e88]/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff2e88]/30 rounded-br-2xl" />

          {/* Header */}
          <div className="space-y-3 text-center">
            {/* Brand */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse" />
              <span className="text-[10px] text-[#00f0ff]/60 font-mono tracking-[0.3em] uppercase">
                Secure Access Portal
              </span>
              <div className="w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-white to-[#00f0ff]">
                KhelSync
              </span>
            </h1>
            <p className="text-sm text-white/40">
              {"Don't have an account? "}
              <Link
                className="font-semibold text-[#00f0ff] hover:text-[#00f0ff]/80 transition-colors hover:underline underline-offset-4"
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-[#00f0ff]/80 uppercase tracking-widest font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-[#0d1a2d]/80 border-white/10 text-white placeholder:text-white/20 focus:border-[#00f0ff]/50 focus:ring-[#00f0ff]/20 transition-all h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs text-[#00f0ff]/80 uppercase tracking-widest font-semibold">
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
                  className="bg-[#0d1a2d]/80 border-white/10 text-white placeholder:text-white/20 focus:border-[#00f0ff]/50 focus:ring-[#00f0ff]/20 transition-all h-11 rounded-lg"
                />
              </div>
            </div>

            {/* Sign in button with neon glow */}
            <SubmitButton
              pendingText="Authenticating..."
              formAction={signInAction}
              className="w-full h-11 bg-gradient-to-r from-[#00f0ff]/20 to-[#8b5cf6]/20 border border-[#00f0ff]/40 text-[#00f0ff] font-bold uppercase tracking-[0.15em] text-sm rounded-lg hover:from-[#00f0ff]/30 hover:to-[#8b5cf6]/30 hover:border-[#00f0ff]/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:text-white transition-all duration-300 relative overflow-hidden group"
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
            <Separator className="bg-white/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a1128] px-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">
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
          <span className="text-[9px] text-white/25 font-mono tracking-[0.2em] uppercase">
            System Online • Encrypted Connection
          </span>
        </div>
      </div>
    </div>
  );
}
