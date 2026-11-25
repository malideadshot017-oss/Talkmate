import Link from 'next/link';
import { ArrowRight, Globe2, MessageSquare, Mic, ShieldCheck, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Mic,
    title: 'Speak Without Pressure',
    description:
      'Practice conversations with real people in a relaxed environment.',
  },
  {
    icon: Globe2,
    title: 'Meet the World',
    description:
      'Connect with people from different countries, cultures, and backgrounds.',
  },
  {
    icon: MessageSquare,
    title: 'Find Your Conversation',
    description:
      'Choose your purpose and get matched with someone who wants the same.',
  },
  {
    icon: Sparkles,
    title: 'Get Better Every Day',
    description:
      'Build confidence by having real conversations, not just studying theory.',
  },
];

const STEPS = [
  { number: '01', title: 'Choose your mode', detail: 'Voice or text, language, and purpose.' },
  { number: '02', title: 'Find a partner', detail: 'Matched live with someone compatible.' },
  { number: '03', title: 'Start talking', detail: 'Optional topic starters if you ever get stuck.' },
  { number: '04', title: 'Improve naturally', detail: 'Reflect after each session at your own pace.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080B12]/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C8CFF] to-[#9B7BFF] text-sm font-semibold text-white">
              TM
            </span>
            <span className="text-base font-semibold tracking-tight text-white">
              TalkMate
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <Link href="/practice" className="hover:text-white transition-colors">
              Practice
            </Link>
            <Link href="/explore" className="hover:text-white transition-colors">
              Explore
            </Link>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/auth/login"
              className="rounded-xl px-3.5 py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#6C8CFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5b7cf5] transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-[#45D6A0]" />
                People ready to talk
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
                Real conversations.
                <br />
                <span className="bg-gradient-to-r from-[#6C8CFF] via-[#9B7BFF] to-[#5DDCFF] bg-clip-text text-transparent">
                  Real confidence.
                </span>
              </h1>

              <p className="max-w-lg text-base text-slate-300 sm:text-lg leading-relaxed">
                Meet people around the world. Speak freely. Practice naturally. Become more
                confident with every conversation.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6C8CFF] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#5b7cf5] transition-all active:scale-[0.98]"
                >
                  Start Talking
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="glass-panel-interactive inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-medium text-slate-200"
                >
                  Explore how it works
                </a>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-[#45D6A0]" />
                Pseudonym friendly · Consent-based voice · Zero auto-recording
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-6 border-b border-white/[0.07]">
                  <span>Speaking Practice · English</span>
                  <span className="inline-flex items-center gap-1.5 text-[#45D6A0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#45D6A0]" />
                    Voice &amp; Text Ready
                  </span>
                </div>

                <div className="relative my-8 flex items-center justify-between gap-4">
                  <div className="glass-panel flex flex-col items-center gap-2 rounded-2xl px-4 py-4 w-32 sm:w-36">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C8CFF]/20 border border-[#6C8CFF]/40 text-sm font-semibold text-[#6C8CFF]">
                      AK
                    </div>
                    <span className="text-xs font-medium text-white">Alex</span>
                    <span className="text-[11px] text-slate-400">Practicing EN</span>
                  </div>

                  <div className="relative flex-1 flex flex-col items-center">
                    <div className="h-px w-full bg-gradient-to-r from-[#6C8CFF]/50 via-[#5DDCFF]/70 to-[#9B7BFF]/50" />
                    <span className="mt-2 rounded-full border border-white/10 bg-[#101522] px-2.5 py-0.5 text-[10px] text-slate-300">
                      Direct Match
                    </span>
                  </div>

                  <div className="glass-panel flex flex-col items-center gap-2 rounded-2xl px-4 py-4 w-32 sm:w-36">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9B7BFF]/20 border border-[#9B7BFF]/40 text-sm font-semibold text-[#9B7BFF]">
                      MK
                    </div>
                    <span className="text-xs font-medium text-white">Mina</span>
                    <span className="text-[11px] text-slate-400">Fluent EN</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-slate-200">
                    “If you could live in any country for one year, where would you go?”
                  </div>
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm border border-[#6C8CFF]/25 bg-[#6C8CFF]/15 px-4 py-2.5 text-xs text-slate-100">
                    “Probably Japan or Switzerland—I want to test my daily speaking skills there.”
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              More than random chatting
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-panel rounded-2xl p-5 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#6C8CFF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl mb-10">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="glass-panel rounded-2xl p-5 space-y-2">
                <span className="text-xs font-mono text-[#5DDCFF]">{step.number}</span>
                <h3 className="text-base font-medium text-white">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Your next conversation starts with one click.
            </h2>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#6C8CFF] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#5b7cf5] transition-all active:scale-[0.98]"
              >
                Find Someone to Talk To
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08] py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} TalkMate</span>
          <div className="flex flex-wrap gap-5">
            {['About', 'Safety', 'Privacy', 'Community Guidelines', 'Contact', 'Terms', 'Feedback'].map(
              (item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-white transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
