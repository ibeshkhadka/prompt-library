import { Header } from "@/components/header";
import { Library } from "@/components/library";
import { getCategories, getPublicPrompts } from "@/lib/prompts";
import Link from "next/link";
import { Terminal } from "lucide-react";

export default async function Home() {
  const [prompts, categories] = await Promise.all([getPublicPrompts(), getCategories()]);
  return <div className="library-page">
    <Header />
    <main><Library prompts={prompts} categories={categories} /></main>
    <footer className="library-footer"><div className="library-container">
      <Link href="/" aria-label="Prompt Library home" className="brand-mark"><Terminal size={16} /></Link>
      <p>New inspiration starts here. Check back often.</p>
    </div></footer>
  </div>;
}
