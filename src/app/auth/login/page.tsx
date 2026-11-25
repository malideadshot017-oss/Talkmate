'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<'email' | 'guest' | null>(null);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') ? 'Authentication failed. Please try again.' : null
  );

  async function redirectAfterAuth(userId: string) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .maybeSingle();

    router.push(profile?.onboarding_completed ? nextPath : '/onboarding');
    router.refresh();
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading('email');

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.user) {
        setError(authError?.message || 'Invalid email or password.');
        setLoading(null);
        return;
      }

      await redirectAfterAuth(data.user.id);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(null);
    }
  }

  async function handleGuestLogin() {
    setError(null);
    setLoading('guest');

    try {
      const supabase = createClient();
      const { data, error: guestError } = await supabase.auth.signInAnonymously();

      if (guestError || !data.user) {
        setError(
          guestError?.message ||
            'Guest mode is not enabled yet. Enable Anonymous Sign-ins in Supabase.'
        );
        setLoading(null);
        return;
      }

      await redirectAfterAuth(data.user.id);
    } catch {
      setError('Could not start guest session.');
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C8CFF] to-[#9B7BFF] text-sm font-semibold text-white">
              TM
            </span>
            <span className="text-lg font-semibold text-white">TalkMate</span>
          </Link>
          <h1 className="text-2xl font-semibold text-white pt-2">Welcome back</h1>
          <p className="text-sm text-slate-400">
            Sign in to continue practicing or jump in as a guest.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#6C8CFF] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#6C8CFF] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C8CFF] py-3 text-sm font-medium text-white hover:bg-[#5b7cf5] transition-colors disabled:opacity-60"
            >
              {loading === 'email' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-white/10" />
            <span className="mx-3 text-xs text-slate-500">or</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading !== null}
            className="glass-panel-interactive flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-slate-200 disabled:opacity-60"
          >
            {loading === 'guest' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#5DDCFF]" />
                Continue as Guest
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            New to TalkMate?{' '}
            <Link href="/auth/signup" className="font-medium text-[#6C8CFF] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#6C8CFF]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
