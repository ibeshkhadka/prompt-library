"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, Prompt } from "@/lib/types";
import { PromptCard } from "@/components/prompt-card";

type Filter = "all" | "new" | "text" | "image" | "favorites";

export function Library({
  prompts,
  categories,
  initialSearch = "",
  initialFilter = "all",
  initialCategory = "",
}: {
  prompts: Prompt[];
  categories: Category[];
  initialSearch?: string;
  initialFilter?: Filter;
  initialCategory?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [category, setCategory] = useState(initialCategory);
  const [favorites, setFavorites] = useState<string[]>([]);

  const updateUrl = (q: string, f: Filter, c: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (f !== "all") params.set("filter", f);
    if (c) params.set("category", c);
    history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    updateUrl(value, filter, category);
  };

  const changeFilter = (value: Filter) => {
    setFilter(value);
    updateUrl(search, value, category);
  };

  const changeCategory = (value: string) => {
    setCategory(value);
    updateUrl(search, filter, value);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const results = useMemo(
    () =>
      prompts.filter((p) => {
        const haystack = [
          p.title,
          p.short_description,
          p.content,
          p.category?.name,
          ...p.tags,
          ...p.tools,
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!search || haystack.includes(search.toLowerCase())) &&
          (!category || p.category?.slug === category) &&
          (filter === "all" ||
            (filter === "new" && p.is_new) ||
            filter === p.prompt_type ||
            (filter === "favorites" && favorites.includes(p.id)))
        );
      }),
    [prompts, search, filter, category, favorites]
  );

  return (
    <>
      {/* Search box — full width */}
      <div id="search" className="w-fit mx-auto border-2 border-ink bg-lavender p-4 shadow-[5px_5px_0_#17251f]">
          <label className="sr-only" htmlFor="prompt-search">
            Search prompts
          </label>
          <div className="flex items-center gap-3 rounded-xl border-2 border-ink bg-paper px-3">
            <Search aria-hidden size={19} />
            <input
              id="prompt-search"
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Search by topic, task, tool, or tag…"
              className="h-12 w-full bg-transparent text-base outline-none"
            />
            {search && (
              <button
                onClick={() => changeSearch("")}
                aria-label="Clear search"
                className="text-ink/40 hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Prompt type filters">
            {(
              [
                ["all", "All"],
                ["new", "New"],
                ["text", "Text"],
                ["image", "Image"],
                ["favorites", "Favorites"],
              ] as [Filter, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => changeFilter(key)}
                aria-pressed={filter === key}
                className="chip bg-paper"
              >
                {label}
              </button>
            ))}
          </div>
      </div>

      {/* Category filters — compact */}
      <div className="mt-6 flex justify-center">
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 rounded-xl border-2 border-ink bg-mint p-3">
        <SlidersHorizontal size={18} className="shrink-0" />
        <button
          onClick={() => changeCategory("")}
          aria-pressed={!category}
          className="chip bg-paper"
        >
          All topics <span className="ml-1 opacity-60">{prompts.length}</span>
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => changeCategory(item.slug)}
            aria-pressed={category === item.slug}
            className="chip bg-paper"
          >
            {item.name}{" "}
            <span className="ml-1 opacity-60">
              {prompts.filter((p) => p.category?.slug === item.slug).length}
            </span>
          </button>
        ))}
      </div>
      </div>

      {/* Rest of the library — constrained */}
      <section id="browse" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      {/* Results header */}
      <div className="mt-8 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em]">Your creative shelf</p>
          <h2 className="display mt-1 text-4xl sm:text-5xl">Find your next move.</h2>
        </div>
        <p className="hidden text-sm font-bold sm:block">{results.length} prompts</p>
      </div>

      {/* Grid */}
      {results.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isFavorited={favorites.includes(prompt.id)}
              onToggleFavorite={() => toggleFavorite(prompt.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center py-16">
          <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-ink/30" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
          <p className="text-ink/50 max-w-md mx-auto">
            Try adjusting your search or filters to find what you are looking for.
          </p>
        </div>
      )}
      </section>
    </>
  );
}
