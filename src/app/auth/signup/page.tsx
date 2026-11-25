'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Loader2, Lock, Mail, Sparkles, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<'signup' | 'guest' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanName = displayName.trim();
    if (cleanName.length < 2 || cleanName.length > 32) {
      setError('Display name must be between 2 and 32 characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading('signup');

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: cleanName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(null);
        return;
      }

      if (data.session) {
        router.push('/onboarding');
        router.refresh();
      } else {
        setEmailSent(true);
        setLoading(null);
      }
    } catch {
      setError('Could not create account. Please try again.');
      setLoading(null);
    }
  }

  async function handleGuest() {
    setError(null);
    setLoading('guest');

    try {
      const supabase = createClient();
      const { data, error: guestError } = await supabase.auth.signInAnonymously();
      if (guestError || !data.user) {
        setError(guestError?.message || 'Guest mode is disabled in Supabase settings.');
        setLoading(null);
        return;
      }
      router.push('/onboarding');
      router.refresh();
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
          <h1 className="text-2xl font-semibold text-white pt-2">Create your account</h1>
          <p className="text-sm text-slate-400">
            Use a pseudonym if you prefer—no real name required.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5">
          {emailSent ? (
            <div className="space-y-4 text-center py-4">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#45D6A0]" />
              <h2 className="text-lg font-medium text-white">Check your inbox</h2>
              <p className="text-sm text-slate-300">
                We sent a confirmation link to <span className="text-white">{email}</span>. Click it
                to activate your account and complete your profile.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6C8CFF] hover:underline"
              >
                Back to Sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Display Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={32}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#6C8CFF] focus:outline-none"
                    />
                  </div>
                </div>

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
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#6C8CFF] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading !== null}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C8CFF] py-3 text-sm font-medium text-white hover:bg-[#5b7cf5] transition-colors disabled:opacity-60"
                >
                  {loading === 'signup' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Create account
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
                onClick={handleGuest}
                disabled={loading !== null}
                className="glass-panel-interactive flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-slate-200 disabled:opacity-60"
              >
                {loading === 'guest' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-[#5DDCFF]" />
                    Try Instantly as Guest
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-[#6C8CFF] hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
