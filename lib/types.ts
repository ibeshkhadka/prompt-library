export type PromptType = "text" | "image";
export type Category = { id: string; name: string; slug: string; color: string };
export type Prompt = {
  id: string; title: string; slug: string; short_description: string; content: string;
  category: Category | null; tags: string[]; prompt_type: PromptType; tools: string[];
  is_featured: boolean; is_new: boolean; is_public: boolean; is_archived: boolean;
  updated_at: string; created_at: string;
};

export type PromptInput = Omit<Prompt, "id" | "created_at" | "updated_at" | "category"> & { category_id: string | null };
