import { AdminStudio } from "@/components/admin-studio";
import { getCategories, getPublicPrompts } from "@/lib/prompts";

export default async function AdminPage() {
  const [prompts, categories] = await Promise.all([
    getPublicPrompts(),
    getCategories(),
  ]);

  return <AdminStudio initialPrompts={prompts} categories={categories} />;
}
