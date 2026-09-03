"use client";

import { useMemo, useState } from "react";
import { Download, Upload, Plus, Copy, Trash2, Eye, Archive, X } from "lucide-react";
import type { Category, Prompt } from "@/lib/types";

const blank = (categories: Category[]): Partial<Prompt> => ({
  title: "",
  slug: "",
  short_description: "",
  content: "",
  category: categories[0] ?? null,
  tags: [],
  tools: [],
  prompt_type: "text",
  is_featured: false,
  is_new: true,
  is_public: false,
  is_archived: false,
});

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function AdminStudio({ initialPrompts, categories }: { initialPrompts: Prompt[]; categories: Category[] }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [selected, setSelected] = useState<Partial<Prompt> | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      prompts.filter((p) =>
        `${p.title} ${p.short_description} ${p.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [prompts, query]
  );

  const save = async () => {
    if (!selected?.title || !selected.content) return setNotice("A title and full prompt are required.");
    setSaving(true);
    const payload = { ...selected, category_id: selected.category?.id ?? null };
    const response = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setSaving(false);
    if (!response.ok) return setNotice(json.error ?? "Could not save prompt.");

    const category = categories.find((c) => c.id === json.category_id) ?? selected.category ?? null;
    const fresh = {
      ...json,
      category,
      tags: json.tags ?? [],
      tools: json.tools ?? [],
    } as Prompt;

    setPrompts((items) =>
      selected.id
        ? items.map((item) => (item.id === fresh.id ? fresh : item))
        : [fresh, ...items]
    );
    setSelected(null);
    setNotice("Prompt saved. It is live immediately when published.");
  };

  const remove = async (id: string) => {
    const response = await fetch("/api/prompts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setPrompts((items) => items.filter((p) => p.id !== id));
      setNotice("Prompt deleted.");
    } else {
      setNotice("Could not delete prompt.");
    }
    setConfirm(null);
  };

  const exportData = (kind: "json" | "csv") => {
    const data =
      kind === "json"
        ? JSON.stringify(prompts, null, 2)
        : [
            "title,slug,description,content,category,tags,tools,type,public",
            ...prompts.map((p) =>
              [
                p.title,
                p.slug,
                p.short_description,
                p.content,
                p.category?.slug,
                p.tags.join("|"),
                p.tools.join("|"),
                p.prompt_type,
                p.is_public,
              ]
                .map(csvEscape)
                .join(",")
            ),
          ].join("\n");

    const blob = new Blob([data], { type: kind === "json" ? "application/json" : "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `mosaic-prompts.${kind}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importFile = async (file: File) => {
    try {
      const text = await file.text();
      const rows: Partial<Prompt>[] = file.name.endsWith(".json")
        ? JSON.parse(text)
        : text
            .split("\n")
            .slice(1)
            .filter(Boolean)
            .map((line) => {
              const values =
                line
                  .match(/("(?:[^"]|"")*"|[^,]*)(?:,|$)/g)
                  ?.map((v) =>
                    v.replace(/,$/, "").replace(/^"|"$/g, "").replaceAll('""', '"')
                  ) ?? [];
              return {
                title: values[0],
                slug: values[1],
                short_description: values[2],
                content: values[3],
                category: categories.find((c) => c.slug === values[4]) ?? null,
                tags: values[5]?.split("|").filter(Boolean),
                tools: values[6]?.split("|").filter(Boolean),
                prompt_type: values[7] === "image" ? "image" : "text",
                is_public: values[8] === "true",
              };
            });

      for (const row of rows) {
        const res = await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...blank(categories),
            ...row,
            category_id: row.category?.id ?? null,
          }),
        });
        if (!res.ok) throw new Error();
      }
      location.reload();
    } catch {
      setNotice("Import failed. Use the export format as your template.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest">Mosaic admin</p>
          <h1 className="display mt-1 text-5xl">Prompt studio</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportData("json")} className="chip bg-paper">
            <Download size={14} className="mr-1 inline" /> JSON
          </button>
          <button onClick={() => exportData("csv")} className="chip bg-paper">
            <Download size={14} className="mr-1 inline" /> CSV
          </button>
          <label className="chip cursor-pointer bg-paper">
            <Upload size={14} className="mr-1 inline" /> Import
            <input
              type="file"
              accept=".json,.csv"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])}
            />
          </label>
          <button
            onClick={() => setSelected(blank(categories))}
            className="rounded-full border-2 border-ink bg-mint px-4 py-2 text-sm font-black"
          >
            <Plus size={16} className="mr-1 inline" /> New prompt
          </button>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-5 flex items-center justify-between rounded-xl border-2 border-ink bg-sun px-4 py-3 text-sm font-bold"
        >
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        {/* Prompt list */}
        <section className="rounded-2xl border-2 border-ink bg-paper p-4">
          <label className="sr-only" htmlFor="admin-search">
            Search prompts
          </label>
          <input
            id="admin-search"
            className="editor-input"
            placeholder="Search your prompts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="mt-4 text-xs font-black uppercase tracking-wider">
            {filtered.length} prompts
          </p>
          <div className="mt-3 max-h-[65vh] space-y-2 overflow-auto pr-1">
            {filtered.map((item) => (
              <div key={item.id} className="rounded-xl border-2 border-ink p-3">
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => setSelected(item)}
                    className="text-left"
                  >
                    <strong className="block">{item.title}</strong>
                    <span className="text-xs text-ink/60">
                      {item.category?.name ?? "No category"} ·{" "}
                      {item.is_public ? "Public" : "Private"}
                    </span>
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelected(item)}
                      aria-label={`Edit ${item.title}`}
                      className="rounded-full border-2 border-ink p-1.5 hover:bg-mint"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => setConfirm(item.id)}
                      aria-label={`Delete ${item.title}`}
                      className="rounded-full border-2 border-ink p-1.5 hover:bg-coral"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-ink/50 py-8">
                No prompts found. Create one to get started.
              </p>
            )}
          </div>
        </section>

        {/* Editor */}
        {selected ? (
          <Editor
            value={selected}
            categories={categories}
            saving={saving}
            onChange={setSelected}
            onSave={save}
            onCancel={() => setSelected(null)}
          />
        ) : (
          <section className="rounded-2xl border-2 border-dashed border-ink/30 bg-cream p-5 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-ink/40 text-sm">Select a prompt to edit, or create a new one.</p>
            </div>
          </section>
        )}
      </div>

      {/* Delete confirmation */}
      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4">
          <div className="rounded-2xl border-2 border-ink bg-cream p-6 max-w-sm w-full shadow-[8px_8px_0_#17251f]">
            <h2 className="text-xl font-bold mb-2">Delete prompt?</h2>
            <p className="text-sm text-ink/70 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirm(null)} className="chip">Cancel</button>
              <button onClick={() => remove(confirm)} className="rounded-full border-2 border-ink bg-coral px-4 py-2 text-xs font-black">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Editor({
  value,
  categories,
  saving,
  onChange,
  onSave,
  onCancel,
}: {
  value: Partial<Prompt>;
  categories: Category[];
  saving: boolean;
  onChange: (v: Partial<Prompt>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = (key: keyof Prompt, item: unknown) => onChange({ ...value, [key]: item });

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (text: string) => {
    set("title", text);
    if (!value.id && !value.slug) {
      set("slug", generateSlug(text));
    }
  };

  return (
    <section className="rounded-2xl border-2 border-ink bg-cream p-5">
      <div className="flex justify-between">
        <h2 className="display text-3xl">{value.id ? "Edit prompt" : "New prompt"}</h2>
        <button onClick={onCancel} aria-label="Close editor">
          <X />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="editor-label sm:col-span-2">
          Title
          <input
            className="editor-input normal-case tracking-normal"
            value={value.title ?? ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="The crisp first draft"
          />
        </label>

        <label className="editor-label">
          Slug
          <input
            className="editor-input normal-case tracking-normal"
            value={value.slug ?? ""}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="the-crisp-first-draft"
          />
        </label>

        <label className="editor-label">
          Category
          <select
            className="editor-input normal-case tracking-normal"
            value={value.category?.id ?? ""}
            onChange={(e) =>
              set(
                "category",
                categories.find((c) => c.id === e.target.value) ?? null
              )
            }
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-label sm:col-span-2">
          Short description
          <textarea
            className="editor-input min-h-20 normal-case tracking-normal"
            value={value.short_description ?? ""}
            onChange={(e) => set("short_description", e.target.value)}
            placeholder="Turn a loose idea into a confident draft..."
          />
        </label>

        <label className="editor-label sm:col-span-2">
          Full prompt
          <textarea
            className="editor-input min-h-64 font-mono text-sm normal-case tracking-normal"
            value={value.content ?? ""}
            onChange={(e) => set("content", e.target.value)}
            placeholder="You are an expert collaborator..."
          />
        </label>

        <label className="editor-label">
          Tags <span className="normal-case tracking-normal text-ink/60">comma separated</span>
          <input
            className="editor-input normal-case tracking-normal"
            value={value.tags?.join(", ") ?? ""}
            onChange={(e) =>
              set(
                "tags",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            placeholder="writing, drafting, voice"
          />
        </label>

        <label className="editor-label">
          Tools <span className="normal-case tracking-normal text-ink/60">comma separated</span>
          <input
            className="editor-input normal-case tracking-normal"
            value={value.tools?.join(", ") ?? ""}
            onChange={(e) =>
              set(
                "tools",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            placeholder="ChatGPT, Claude"
          />
        </label>

        <label className="editor-label">
          Type
          <select
            className="editor-input normal-case tracking-normal"
            value={value.prompt_type ?? "text"}
            onChange={(e) => set("prompt_type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </label>

        <div className="flex flex-wrap gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.is_featured ?? false}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="w-4 h-4 rounded border-ink"
            />
            <span className="text-sm font-medium">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.is_new ?? false}
              onChange={(e) => set("is_new", e.target.checked)}
              className="w-4 h-4 rounded border-ink"
            />
            <span className="text-sm font-medium">New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.is_public ?? false}
              onChange={(e) => set("is_public", e.target.checked)}
              className="w-4 h-4 rounded border-ink"
            />
            <span className="text-sm font-medium">Public</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.is_archived ?? false}
              onChange={(e) => set("is_archived", e.target.checked)}
              className="w-4 h-4 rounded border-ink"
            />
            <span className="text-sm font-medium">Archived</span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-2 justify-end">
        <button onClick={onCancel} className="chip">
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-full border-2 border-ink bg-mint px-4 py-2 text-sm font-black disabled:opacity-50"
        >
          {saving ? "Saving..." : value.id ? "Update prompt" : "Create prompt"}
        </button>
      </div>
    </section>
  );
}
