import HeaderAuth from '@/components/header/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { robotoBlack } from '@/components/ui/fonts';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import TournamentFormModal from '@/components/tournament-form-modal';
import { Toaster } from '@/components/ui/toaster';
import TournamentDropdownList from '@/components/header/tournament-dropdown-list';
import { Trophy } from 'lucide-react';
import { getAuthUser } from '@/lib/actions';
import { ChatProvider } from '../utils/context/ChatContext';
import { PrivateChat } from '@/components/private-chat';
import { Separator } from '@/components/ui/separator';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'KhelSync',
  description: 'The Ultimate Real-Time College Tournament Ecosystem',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  return (
    <html lang="en" className={robotoBlack.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ChatProvider>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                <header className="w-full relative z-50">
                  {/* Top glass layer */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60" />
                  
                  {/* Bottom gradient border */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_1px_10px_rgba(0,240,255,0.3)]" />

                  <div className="relative mx-auto px-6 max-w-7xl">
                    <nav className="flex items-center justify-between h-14 md:h-16">
                      {/* Left: Brand */}
                      <div className="flex items-center gap-6">
                        <Link
                          href="/"
                          className="flex items-center space-x-3 group transition-all"
                        >
                          <div className="relative">
                            <Trophy className="h-6 w-6 text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all" />
                            <div className="absolute -inset-1 bg-cyan-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="flex flex-col">
                            <span className="text-sm font-black tracking-tighter uppercase leading-none cyber-gradient-text">
                              KhelSync
                            </span>
                            <span className="text-[8px] font-mono text-cyan-500/60 tracking-[0.2em] leading-none mt-1">
                              SECURE_GATEWAY
                            </span>
                          </span>
                        </Link>

                        <div className="hidden lg:flex items-center h-4 w-[1px] bg-white/10" />

                        <div className="hidden lg:flex items-center gap-4">
                          <TournamentDropdownList />
                          <Link
                            href="/auction"
                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-[#ff2e88]/50 text-[#ff2e88] hover:bg-[#ff2e88]/10 hover:border-[#ff2e88] transition-all flex items-center gap-2 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-[#ff2e88]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            <div className="w-1 h-1 bg-[#ff2e88] animate-pulse rounded-full shadow-[0_0_5px_#ff2e88]" />
                            <span className="relative z-10">Live Auction</span>
                          </Link>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:block">
                          <TournamentFormModal user={user} />
                        </div>
                        <div className="w-[1px] h-6 bg-white/5 hidden sm:block" />
                        <HeaderAuth />
                      </div>
                    </nav>
                  </div>

                  {/* Mobile nav (simple version for now) */}
                  <div className="md:hidden flex items-center justify-center py-2 px-4 gap-4 border-t border-white/5 bg-black/20">
                    <TournamentDropdownList />
                    <Link href="/auction" className="text-[9px] font-bold uppercase tracking-widest text-[#ff2e88]">Live</Link>
                  </div>
                </header>
                <div className="w-full flex flex-col">{children}</div>
                {user && <PrivateChat user={user} />}

                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-5 mt-auto">
                  <ThemeSwitcher />
                </footer>
              </div>
            </main>
            <Toaster />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
