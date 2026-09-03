import { samplePrompts, sampleCategories } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import type { Category, Prompt } from "@/lib/types";

function normalize(row: Record<string, unknown>): Prompt {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  return { ...row, category: (row.categories as Category | null) ?? null, tags: tags.map((t) => typeof t === "string" ? t : (t as { name: string }).name), tools: Array.isArray(row.tools) ? row.tools as string[] : [], prompt_type: row.prompt_type as Prompt["prompt_type"] } as Prompt;
}
export async function getPublicPrompts(): Promise<Prompt[]> {
  const supabase = await createClient();
  if (!supabase) return samplePrompts;
  const { data, error } = await supabase.from("prompts").select("*, categories(*)").eq("is_public", true).eq("is_archived", false).order("sort_order").order("updated_at", { ascending: false });
  return error || !data?.length ? samplePrompts : data.map(normalize);
}
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  if (!supabase) return sampleCategories;
  const { data } = await supabase.from("categories").select("*").order("name");
  return data?.length ? data as Category[] : sampleCategories;
}
export async function getPromptBySlug(slug: string) { return (await getPublicPrompts()).find((item) => item.slug === slug); }
