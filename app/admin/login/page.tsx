"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/admin");
    });
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!supabase) {
      setError("The admin connection is not configured.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/prompt-library/admin/`,
        shouldCreateUser: true,
      },
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--cream)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--ink)] flex items-center justify-center mx-auto mb-4">
            <LogoMark size={36} />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-[var(--ink)]/60 mt-2">Get a secure sign-in link to manage your prompts</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}
          {sent ? (
            <div className="rounded-xl border-2 border-[var(--ink)] bg-[var(--mint)] p-4 text-center">
              <Mail className="mx-auto mb-2" size={24} />
              <p className="font-bold">Check your email</p>
              <p className="mt-1 text-sm text-[var(--ink)]/70">Open the secure link we sent to {email}.</p>
              <button onClick={() => setSent(false)} className="mt-3 text-sm font-bold underline">Use another email</button>
            </div>
          ) : <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="editor-label">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="editor-input"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] px-5 py-3 text-sm font-black hover:bg-[#2a3d35] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Sending link..." : (
                <>
                  <Mail size={18} />
                  Email me a sign-in link
                </>
              )}
            </button>
          </form>}
        </div>

        <p className="text-center text-sm text-[var(--ink)]/40 mt-6">
          <a href="/" className="hover:text-[var(--ink)]">
            ← Back to library
          </a>
        </p>
      </div>
    </div>
  );
}
