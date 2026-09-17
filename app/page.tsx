import { Header } from "@/components/header";
import { Library } from "@/components/library";
import { getCategories, getPublicPrompts } from "@/lib/prompts";
import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";

export default async function Home() {
  const [prompts, categories] = await Promise.all([getPublicPrompts(), getCategories()]);
  return <div className="library-page">
    <Header />
    <main><Library prompts={prompts} categories={categories} /></main>
    <footer className="library-footer"><div className="library-container">
      <Link href="/" aria-label="Prompt Library home" className="brand-mark"><LogoMark size={30} /></Link>
      <p>New inspiration starts here. Check back often.</p>
    </div></footer>
  </div>;
}
