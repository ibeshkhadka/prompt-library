import type { Category, Prompt } from "@/lib/types";

export function normalizePrompt(row: Record<string, unknown>): Prompt {
  const rawTags = Array.isArray(row.tags) ? row.tags : [];

  return {
    ...row,
    category: (row.categories as Category | null) ?? null,
    tags: rawTags.map((tag) =>
      typeof tag === "string" ? tag : (tag as { name: string }).name
    ),
    tools: Array.isArray(row.tools) ? (row.tools as string[]) : [],
    prompt_type: row.prompt_type as Prompt["prompt_type"],
  } as Prompt;
}
