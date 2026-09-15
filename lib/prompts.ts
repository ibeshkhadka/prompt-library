import { samplePrompts, sampleCategories } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import type { Category, Prompt } from "@/lib/types";
import supabaseRows from "@/lib/supabase-prompts.json";

const supabaseCategoryMap: Record<string, string> = {
  "6b8f0d93-7fe6-4bf4-bcb2-317f77471460": "writing",
  "0c381357-9fd5-4714-8798-df2744bc9e11": "business",
  "cc4774cb-1c3e-4aa5-a44d-f288d9e4c8fb": "growth",
  "24e7e2c2-5a41-4f7a-b1f6-566307b4b104": "visual",
  "fd2c3e1d-08d0-4b3e-bb32-e6365e2db164": "code",
  "13fa0030-9241-4774-b4d7-94596434eadc": "creative",
  "6694f33d-e9b6-4a21-b784-19e363675bae": "career"
};

function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
    } catch { return []; }
  }
  return [];
}

const exportedPrompts: Prompt[] = (supabaseRows as Record<string, unknown>[]).map((row) => ({
  id: String(row.id), title: String(row.title), slug: String(row.slug),
  short_description: String(row.short_description), content: String(row.content),
  category: sampleCategories.find((category) => category.id === supabaseCategoryMap[String(row.category_id)]) ?? null,
  tags: parseArray(row.tags), tools: parseArray(row.tools),
  prompt_type: row.prompt_type === "image" ? "image" : row.prompt_type === "video" ? "video" : "text",
  is_featured: Boolean(row.is_featured), is_new: Boolean(row.is_new),
  is_public: Boolean(row.is_public), is_archived: Boolean(row.is_archived),
  updated_at: String(row.updated_at), created_at: String(row.created_at)
}));

function normalize(row: Record<string, unknown>): Prompt {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  return { ...row, category: (row.categories as Category | null) ?? null, tags: tags.map((t) => typeof t === "string" ? t : (t as { name: string }).name), tools: Array.isArray(row.tools) ? row.tools as string[] : [], prompt_type: row.prompt_type as Prompt["prompt_type"] } as Prompt;
}
export async function getPublicPrompts(): Promise<Prompt[]> {
  const supabase = await createClient();
  if (!supabase) return exportedPrompts;
  const { data, error } = await supabase.from("prompts").select("*, categories(*)").eq("is_public", true).eq("is_archived", false).order("sort_order").order("updated_at", { ascending: false });
  return error || !data?.length ? exportedPrompts : data.map(normalize);
}
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  if (!supabase) return sampleCategories;
  const { data } = await supabase.from("categories").select("*").order("name");
  return data?.length ? data as Category[] : sampleCategories;
}
export async function getPromptBySlug(slug: string) { return (await getPublicPrompts()).find((item) => item.slug === slug); }
