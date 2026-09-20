"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminStudio } from "@/components/admin-studio";
import { createClient } from "@/lib/supabase/client";
import { normalizePrompt } from "@/lib/normalize-prompt";
import type { Category, Prompt } from "@/lib/types";

export function AdminDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError("The admin connection is not configured.");
      return;
    }
    const client = supabase;

    let active = true;
    async function load() {
      const { data: { user } } = await client.auth.getUser();
      if (!active) return;
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!active) return;
      if (profileError || profile?.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      const [promptResult, categoryResult] = await Promise.all([
        client.from("prompts").select("*, categories(*)").order("sort_order").order("updated_at", { ascending: false }),
        client.from("categories").select("*").order("name"),
      ]);

      if (!active) return;
      if (promptResult.error || categoryResult.error) {
        setError(promptResult.error?.message ?? categoryResult.error?.message ?? "Could not load the admin library.");
        return;
      }

      setPrompts((promptResult.data ?? []).map((row) => normalizePrompt(row as Record<string, unknown>)));
      setCategories((categoryResult.data ?? []) as Category[]);
    }

    void load();
    return () => { active = false; };
  }, [router, supabase]);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (error) {
    return <main className="min-h-screen grid place-items-center bg-cream px-4">
      <section className="max-w-md rounded-2xl border-2 border-ink bg-paper p-6 text-center shadow-[6px_6px_0_#17251f]">
        <h1 className="display text-3xl">Admin access</h1>
        <p className="mt-3 text-sm text-ink/70">{error}</p>
        <button onClick={signOut} className="mt-5 rounded-full border-2 border-ink bg-mint px-4 py-2 text-sm font-black">Return to sign in</button>
      </section>
    </main>;
  }

  if (!prompts) {
    return <main className="min-h-screen grid place-items-center bg-cream"><p className="font-bold">Loading admin panel…</p></main>;
  }

  return <AdminStudio initialPrompts={prompts} categories={categories} onSignOut={signOut} />;
}
