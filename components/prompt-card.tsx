"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Heart, ArrowUpRight } from "lucide-react";
import type { Prompt } from "@/lib/types";
import { PromptDialog } from "@/components/prompt-dialog";

export function CopyButton({ content, compact = false }: { content: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const area = document.createElement("textarea");
      area.value = content;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-ink bg-mint px-3 py-2 text-xs font-black ${compact ? "" : "flex-1"}`}
      aria-label="Copy prompt"
    >
      {copied ? (
        <>
          <Check size={15} /> Copied
        </>
      ) : (
        <>
          <Copy size={15} /> Copy
        </>
      )}
    </button>
  );
}

export function PromptCard({
  prompt,
  isFavorited = false,
  onToggleFavorite,
}: {
  prompt: Prompt;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className="card-lift flex min-h-[290px] flex-col rounded-2xl border-2 border-ink bg-paper p-4 shadow-[4px_5px_0_#17251f]">
      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-full border border-ink px-2 py-1 text-[10px] font-black uppercase tracking-wider"
          style={{ backgroundColor: prompt.category?.color ?? "#fff" }}
        >
          {prompt.category?.name ?? "General"}
        </span>
        <button
          onClick={onToggleFavorite}
          aria-label={isFavorited ? "Remove favorite" : "Add favorite"}
          className="rounded-full p-1.5 hover:bg-coral"
        >
          <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-5 flex-1">
        <h2 className="display text-3xl leading-[.95]">{prompt.title}</h2>
        <p className="mt-3 text-sm leading-5 text-ink/75">{prompt.short_description}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {prompt.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-ink/8 px-2 py-1 text-[10px] font-bold">
            #{tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-ink/60">
        {prompt.tools.join(" · ")}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border-2 border-ink bg-paper px-3 py-2 text-xs font-black"
        >
          View <ArrowUpRight size={14} />
        </button>
        <CopyButton content={prompt.content} />
      </div>

      {open && <PromptDialog prompt={prompt} onClose={() => setOpen(false)} />}
    </article>
  );
}
