import { AdminStudio } from "@/components/admin-studio";
import { getCategories } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import type { Category, Prompt } from "@/lib/types";

function normalize(row: Record<string, unknown>): Prompt {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  return {
    ...row,
    category: (row.categories as Category | null) ?? null,
    tags: tags.map((t) => (typeof t === "string" ? t : (t as { name: string }).name)),
    tools: Array.isArray(row.tools) ? (row.tools as string[]) : [],
    prompt_type: row.prompt_type as Prompt["prompt_type"],
  } as Prompt;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("prompts").select("*, categories(*)").order("sort_order").order("updated_at", { ascending: false })
    : { data: null };
  const [categories] = await Promise.all([getCategories()]);

  const prompts = data ? data.map(normalize) : [];
  return <AdminStudio initialPrompts={prompts} categories={categories} />;
}
