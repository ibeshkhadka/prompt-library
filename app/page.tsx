import { Header } from "@/components/header";
import { Library } from "@/components/library";
import { getCategories, getPublicPrompts } from "@/lib/prompts";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    filter?: "all" | "new" | "text" | "image" | "favorites";
    category?: string;
  }>;
}) {
  const [prompts, categories, params] = await Promise.all([
    getPublicPrompts(),
    getCategories(),
    searchParams,
  ]);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="overflow-hidden border-b-2 border-ink bg-mint">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_.8fr] md:py-14">
            <div>
              <p className="inline-block rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs font-black uppercase tracking-widest">
                A practical collection for curious minds
              </p>
              <h1 className="display mt-5 max-w-3xl text-6xl leading-[.86] sm:text-8xl">
                The Prompt
                <br />
                <em>Library</em>
              </h1>
              <p className="mt-6 max-w-lg text-base font-medium leading-6">
                A bright little home for the prompts that help you make clearer work, bolder ideas, and fewer blank-page faces.
              </p>
              <a
                href="#search"
                className="mt-7 inline-block rounded-full border-2 border-ink bg-ink px-5 py-3 text-sm font-black text-cream shadow-[3px_3px_0_#fff8e8]"
              >
                Explore the collection ↓
              </a>
            </div>
            <div className="relative hidden min-h-64 md:block">
              <div className="absolute right-6 top-4 h-44 w-48 rotate-6 rounded-3xl border-2 border-ink bg-coral shadow-[6px_6px_0_#17251f]" />
              <div className="absolute bottom-1 left-4 grid h-48 w-52 -rotate-6 place-items-center rounded-3xl border-2 border-ink bg-lavender p-5 text-center shadow-[6px_6px_0_#17251f]">
                <span className="display text-4xl leading-none">
                  Useful ideas,
                  <br /> well filed.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Library */}
        <Library
          prompts={prompts}
          categories={categories}
          initialSearch={params.q}
          initialFilter={params.filter}
          initialCategory={params.category}
        />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-ink/10 py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink/50">
            © {new Date().getFullYear()} Prompt Library. Built with care.
          </p>
          <div className="flex items-center gap-4">
            <a href="/admin/login" className="text-sm text-ink/50 hover:text-ink">
              Admin
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
