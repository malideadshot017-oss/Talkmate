'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Loader2, MessageSquare, Mic, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const LANGUAGES = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Arabic',
  'Portuguese',
  'Mandarin',
];

const COUNTRIES = [
  { code: '', label: 'Prefer not to share' },
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'JP', label: 'Japan' },
  { code: 'KR', label: 'South Korea' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'ES', label: 'Spain' },
  { code: 'BR', label: 'Brazil' },
];

const INTEREST_OPTIONS = [
  'Daily Life',
  'Travel',
  'Technology',
  'Gaming',
  'Anime & Manga',
  'Movies & TV',
  'Music',
  'Career & Business',
  'Fitness',
  'Books',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [hideCountry, setHideCountry] = useState(false);
  const [nativeLanguage, setNativeLanguage] = useState('Hindi');
  const [practiceLanguage, setPracticeLanguage] = useState('English');
  const [proficiency, setProficiency] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [preferredMode, setPreferredMode] = useState<'voice' | 'text'>('voice');
  const [interests, setInterests] = useState<string[]>(['Daily Life']);
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setDisplayName(profile.display_name || '');
        setCountryCode(profile.country_code || '');
        setHideCountry(Boolean(profile.hide_country));
        setNativeLanguage(profile.native_languages?.[0] || 'Hindi');
        setPracticeLanguage(profile.practice_languages?.[0] || 'English');
        setProficiency(profile.proficiency_level || 'intermediate');
        setPreferredMode(profile.preferred_mode || 'voice');
        setInterests(profile.interests?.length ? profile.interests : ['Daily Life']);
        setIsAdult(Boolean(profile.is_adult_confirmed));
      }
      setInitializing(false);
    }

    loadProfile();
  }, [router]);

  function toggleInterest(tag: string) {
    setInterests((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : prev.length < 5
          ? [...prev, tag]
          : prev
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanName = displayName.trim();
    if (cleanName.length < 2 || cleanName.length > 32) {
      setError('Display name must be between 2 and 32 characters.');
      return;
    }
    if (!isAdult) {
      setError('Please confirm that you are 18 or older to use TalkMate.');
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { error: saveError } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          display_name: cleanName,
          country_code: countryCode || null,
          hide_country: hideCountry,
          native_languages: [nativeLanguage],
          practice_languages: [practiceLanguage],
          proficiency_level: proficiency,
          preferred_mode: preferredMode,
          interests,
          is_adult_confirmed: true,
          onboarding_completed: true,
        },
        { onConflict: 'id' }
      );

      if (saveError) {
        setError(saveError.message);
        setSaving(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Could not save profile. Please try again.');
      setSaving(false);
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#6C8CFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-[#5DDCFF]">
            Profile Setup
          </span>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Set up how you want to talk
          </h1>
          <p className="text-sm text-slate-400">
            This helps match you with compatible speaking partners. You can change it anytime.
          </p>
        </div>

        <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Display Name</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={32}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name or nickname"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#6C8CFF] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Country (Optional)</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#101522] px-3.5 py-2.5 text-sm text-white focus:border-[#6C8CFF] focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {countryCode && (
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hideCountry}
                onChange={(e) => setHideCountry(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#6C8CFF]"
              />
              Hide my country from conversation partners
            </label>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Native Language</label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#101522] px-3.5 py-2.5 text-sm text-white focus:border-[#6C8CFF] focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Language to Practice</label>
              <select
                value={practiceLanguage}
                onChange={(e) => setPracticeLanguage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#101522] px-3.5 py-2.5 text-sm text-white focus:border-[#6C8CFF] focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">
              Your {practiceLanguage} Speaking Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setProficiency(level)}
                  className={`rounded-xl border py-2.5 text-xs font-medium capitalize transition-all ${
                    proficiency === level
                      ? 'border-[#6C8CFF] bg-[#6C8CFF]/20 text-white'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Preferred Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreferredMode('voice')}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                  preferredMode === 'voice'
                    ? 'border-[#6C8CFF] bg-[#6C8CFF]/20 text-white'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="h-4 w-4" />
                Voice First
              </button>
              <button
                type="button"
                onClick={() => setPreferredMode('text')}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                  preferredMode === 'text'
                    ? 'border-[#6C8CFF] bg-[#6C8CFF]/20 text-white'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Text First
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Interests (up to 5)</label>
              <span className="text-[11px] text-slate-500">{interests.length}/5 selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((tag) => {
                const selected = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                      selected
                        ? 'border-[#5DDCFF]/60 bg-[#5DDCFF]/15 text-white'
                        : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {selected && <Check className="h-3 w-3 text-[#5DDCFF]" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-[#45D6A0]"
            />
            <span>
              I confirm I am <strong>18 or older</strong> and agree to treat every partner with
              respect.
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C8CFF] py-3.5 text-sm font-medium text-white hover:bg-[#5b7cf5] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Save &amp; Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#45D6A0]" />
            Your private email is never shown to partners.
          </div>
        </form>
      </div>
    </div>
  );
}
