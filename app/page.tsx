import { Header } from "@/components/header";
import { Library, type Filter } from "@/components/library";
import { getCategories, getPublicPrompts } from "@/lib/prompts";
import { Terminal } from "lucide-react";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ q?: string; filter?: Filter; category?: string }>;
}) {
  const [prompts, categories, params] = await Promise.all([getPublicPrompts(), getCategories(), searchParams]);
  return <div className="library-page">
    <Header />
    <main><Library prompts={prompts} categories={categories} initialSearch={params.q} initialFilter={params.filter} initialCategory={params.category} /></main>
    <footer className="library-footer"><div className="library-container">
      <a href="/" aria-label="Prompt Library home" className="brand-mark"><Terminal size={16} /></a>
      <p>New inspiration starts here. Check back often.</p>
    </div></footer>
  </div>;
}
