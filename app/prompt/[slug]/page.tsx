import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPromptBySlug } from "@/lib/prompts";
import { ArrowLeft, Calendar, Tag, Wrench, FileText, Image, Sparkles, Star } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return { title: "Prompt not found" };
  return {
    title: `${prompt.title} — Prompt Library`,
    description: prompt.short_description,
  };
}

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const categoryColor = prompt.category?.color ?? "#6ee7c1";

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--cream)]/95 backdrop-blur-sm border-b-2 border-[var(--ink)]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-[var(--ink)]/40">←</span>
              Prompt Library
            </Link>
            <Link href="/admin/login" className="rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] px-4 py-2 text-xs font-black">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--ink)]/60 hover:text-[var(--ink)] mb-6">
          <ArrowLeft size={16} />
          Back to library
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {prompt.category && (
              <span className="rounded-full border border-[var(--ink)] px-2 py-1 text-[10px] font-black uppercase tracking-wider" style={{ backgroundColor: `${categoryColor}30` }}>
                {prompt.category.name}
              </span>
            )}
            <span className="rounded-full border border-[var(--ink)] px-2 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              {prompt.prompt_type === "image" ? <Image size={12} /> : <FileText size={12} />}
              {prompt.prompt_type === "image" ? "Image" : "Text"}
            </span>
            {prompt.is_featured && <span className="rounded-full border border-[var(--ink)] bg-[var(--sun)] px-2 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><Star size={12} /> Featured</span>}
            {prompt.is_new && <span className="rounded-full border border-[var(--ink)] bg-[var(--mint)] px-2 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><Sparkles size={12} /> New</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{prompt.title}</h1>
          <p className="text-lg text-[var(--ink)]/70 leading-relaxed">{prompt.short_description}</p>
        </div>

        {/* Prompt content */}
        <div className="bg-white rounded-2xl border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--ink)]/60 uppercase tracking-wide">Prompt</h2>
            <CopyButton text={prompt.content} />
          </div>
          <div className="bg-[var(--cream)] rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="prose-prompt text-sm text-[var(--ink)]/90">{prompt.content}</pre>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {prompt.tools && prompt.tools.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-[var(--ink)]/10 p-4">
              <h3 className="text-sm font-semibold text-[var(--ink)]/60 uppercase tracking-wide mb-3 flex items-center gap-1">
                <Wrench size={14} />
                Compatible with
              </h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-[var(--ink)] px-2 py-1 text-[10px] font-bold">{tool}</span>
                ))}
              </div>
            </div>
          )}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-[var(--ink)]/10 p-4">
              <h3 className="text-sm font-semibold text-[var(--ink)]/60 uppercase tracking-wide mb-3 flex items-center gap-1">
                <Tag size={14} />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="text-sm text-[var(--ink)]/60">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Updated date */}
        <div className="flex items-center gap-2 text-sm text-[var(--ink)]/50 mb-8">
          <Calendar size={14} />
          <span>Last updated {new Date(prompt.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[var(--ink)]/10 py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-sm text-[var(--ink)]/50">
          © {new Date().getFullYear()} Prompt Library
        </div>
      </footer>
    </div>
  );
}
