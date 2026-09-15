"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Category, Prompt } from "@/lib/types";
import { PromptCard } from "@/components/prompt-card";

export type Filter = "all" | "new" | "text" | "image" | "video" | "favorites";
const PAGE_SIZE = 24;
const FILTERS: [Filter, string][] = [["all", "All"], ["new", "★ New"], ["text", "Text"], ["image", "Image"], ["video", "Video"], ["favorites", "♡ Saved"]];
const matchesFilter = (p: Prompt, filter: Filter, favorites: string[]) => filter === "all" ||
  (filter === "new" && p.is_new) || filter === p.prompt_type ||
  (filter === "favorites" && favorites.includes(p.id)) ||
  (filter === "video" && p.prompt_type === "video");

export function Library({ prompts, categories, initialSearch = "", initialFilter = "all", initialCategory = "" }: {
  prompts: Prompt[]; categories: Category[]; initialSearch?: string; initialFilter?: Filter; initialCategory?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<Filter>(FILTERS.some(([key]) => key === initialFilter) ? initialFilter : "all");
  const [category, setCategory] = useState(initialCategory);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("q") || "");
    const requestedFilter = params.get("filter");
    if (FILTERS.some(([key]) => key === requestedFilter)) setFilter(requestedFilter as Filter);
    setCategory(params.get("category") || "");
    try { const saved: unknown = JSON.parse(localStorage.getItem("prompt-favorites") || "[]"); if (Array.isArray(saved)) setFavorites(saved.filter((id): id is string => typeof id === "string")); } catch { /* Storage is optional. */ }
  }, []);
  function update(q: string, f: Filter, c: string) {
    setSearch(q); setFilter(f); setCategory(c); setVisible(PAGE_SIZE);
    const params = new URLSearchParams();
    if (q) params.set("q", q); if (f !== "all") params.set("filter", f); if (c) params.set("category", c);
    history.replaceState(null, "", location.pathname + (params.size ? "?" + params : ""));
  }
  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(next);
    try { localStorage.setItem("prompt-favorites", JSON.stringify(next)); } catch { /* Storage is optional. */ }
  }
  const results = useMemo(() => prompts.filter(p => {
    const haystack = [p.title, p.short_description, p.content, p.category?.name, ...p.tags, ...p.tools].join(" ").toLowerCase();
    return haystack.includes(search.trim().toLowerCase()) && (!category || p.category?.slug === category) && matchesFilter(p, filter, favorites);
  }), [prompts, search, category, filter, favorites]);
  const textCount = prompts.filter(p => p.prompt_type === "text").length;

  return <>
    <section className="library-hero" aria-labelledby="library-title">
      <div className="library-container">
        <p className="hero-eyebrow">// Your next great idea</p>
        <h1 id="library-title">The Prompt Library</h1>
        <p className="hero-description">{prompts.length} everyday prompts for your life and work: {textCount} for text, {prompts.length - textCount} for images.<br />Search, filter, and copy any one in a click. Make something great.</p>
        <div id="search" className="library-search">
          <Search size={21} aria-hidden="true" />
          <label htmlFor="prompt-search" className="sr-only">Search prompts</label>
          <input id="prompt-search" placeholder="Search prompts…" value={search} onChange={e => update(e.target.value, filter, category)} />
          {search && <button aria-label="Clear search" onClick={() => update("", filter, category)}><X size={18} /></button>}
        </div>
        <div className="type-filters" role="group" aria-label="Prompt type filters">
          {FILTERS.map(([key, label]) => <button key={key} aria-pressed={filter === key} onClick={() => update(search, key, category)}>{label} ({prompts.filter(p => matchesFilter(p, key, favorites)).length})</button>)}
        </div>
      </div>
    </section>
    <div className="category-bar"><div className="library-container category-filters" role="group" aria-label="Categories">
      <button aria-pressed={!category} onClick={() => update(search, filter, "")}>All categories</button>
      {categories.map((item, index) => <button key={item.id} aria-pressed={category === item.slug} onClick={() => update(search, filter, item.slug)}>
        <span className="category-dot" style={{ background: ["#8270e8", "#ef6245", "#20b991", "#5096cc", "#efb22b", "#52a64c", "#d45d99"][index % 7] }} />
        {item.name} <span className="category-count">{prompts.filter(p => p.category?.slug === item.slug).length}</span>
      </button>)}
    </div></div>
    <section id="browse" className="library-container library-results" aria-label="Prompt collection">
      <p className="results-count" role="status">{results.length} {results.length === 1 ? "prompt" : "prompts"}{search && " · “" + search + "”"}{category && " · " + (categories.find(c => c.slug === category)?.name || category)}</p>
      {results.length ? <div className="prompt-grid">{results.slice(0, visible).map(prompt => <PromptCard key={prompt.id} prompt={prompt} isFavorited={favorites.includes(prompt.id)} onToggleFavorite={() => toggleFavorite(prompt.id)} />)}</div> :
        <div className="empty-results"><Search size={28} /><h2>No prompts found</h2><p>Try another search or reset your filters.</p><button className="pink-button" onClick={() => update("", "all", "")}>Reset filters</button></div>}
      {results.length > visible && <div className="load-more"><button onClick={() => setVisible(count => count + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, results.length - visible)} more · {results.length - visible} left</button></div>}
    </section>
  </>;
}
