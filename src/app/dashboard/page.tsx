'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe2, Loader2, LogOut, MessageSquare, Mic, Settings, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Profile = {
  id: string;
  display_name: string;
  native_languages: string[];
  practice_languages: string[];
  proficiency_level: string;
  preferred_mode: 'voice' | 'text';
  interests: string[];
  onboarding_completed: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      setIsGuest(Boolean(user.is_anonymous));

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!data || !data.onboarding_completed) {
        router.replace('/onboarding');
        return;
      }

      setProfile(data as Profile);
      setLoading(false);
    }

    load();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#6C8CFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080B12]/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C8CFF] to-[#9B7BFF] text-sm font-semibold text-white">
              TM
            </span>
            <span className="text-base font-semibold text-white">TalkMate</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.08]"
            >
              <Settings className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 space-y-6">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-[#45D6A0]" />
              {isGuest ? 'Guest Session Active' : 'Verified Account'}
            </div>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              Hey, {profile.display_name}
            </h1>
            <p className="text-sm text-slate-400">
              Practicing{' '}
              <span className="text-white font-medium">
                {profile.practice_languages[0] || 'English'}
              </span>{' '}
              ({profile.proficiency_level}) · Native:{' '}
              <span className="text-slate-200">{profile.native_languages[0] || 'English'}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C8CFF]/15 border border-[#6C8CFF]/30 text-[#6C8CFF]">
              {profile.preferred_mode === 'voice' ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MessageSquare className="h-5 w-5" />
              )}
            </div>
            <h2 className="text-lg font-medium text-white">Live Matchmaking Ready Next</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your profile and database are live. In the next stage, we will wire the live queue,
              real-time chat, and WebRTC voice room right here.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#5DDCFF] pt-1">
              <Sparkles className="h-3.5 w-3.5" />
              Preferred mode: {profile.preferred_mode === 'voice' ? 'Voice' : 'Text'}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9B7BFF]/15 border border-[#9B7BFF]/30 text-[#9B7BFF]">
              <Globe2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-medium text-white">Account &amp; Security Check</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Protected routes, Supabase Auth sessions, and Row Level Security are active on your
              profile.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
