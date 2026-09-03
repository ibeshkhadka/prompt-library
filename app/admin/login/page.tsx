"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--cream)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--ink)] flex items-center justify-center mx-auto mb-4">
            <span className="text-[var(--mint)] text-xl font-bold">M</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-[var(--ink)]/60 mt-2">Sign in to manage your prompt library</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label htmlFor="password" className="editor-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="editor-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink)]/40 hover:text-[var(--ink)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] px-5 py-3 text-sm font-black hover:bg-[#2a3d35] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : (
                <>
                  <LogIn size={18} />
                  Sign in
                </>
              )}
            </button>
          </form>
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
