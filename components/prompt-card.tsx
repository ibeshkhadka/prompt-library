"use client";

import { useState } from "react";
import { Check, Copy, Heart, Eye } from "lucide-react";
import type { Prompt } from "@/lib/types";
import { PromptDialog } from "@/components/prompt-dialog";

export function CopyButton({ content, compact = false }: { content: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    let success = false;
    try { await navigator.clipboard.writeText(content); success = true; }
    catch {
      const area = document.createElement("textarea");
      area.value = content; area.style.position = "fixed"; area.style.opacity = "0";
      document.body.appendChild(area); area.select();
      try { success = document.execCommand("copy"); } catch { success = false; }
      area.remove();
    }
    setError(!success); setCopied(success);
    setTimeout(() => { setCopied(false); setError(false); }, 1800);
  }
  return <button onClick={copy} className={"pink-button copy-button" + (compact ? " compact" : "")} aria-label="Copy prompt">
    {copied ? <Check size={14} /> : <Copy size={14} />}<span aria-live="polite">{copied ? "Copied!" : error ? "Try again" : "Copy prompt"}</span>
  </button>;
}

export function PromptCard({ prompt, isFavorited = false, onToggleFavorite }: {
  prompt: Prompt; isFavorited?: boolean; onToggleFavorite?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return <article className="prompt-card">
    <div className="card-topline">
      <span className="category-badge" style={{ backgroundColor: prompt.category?.color ?? "#e4def5" }}><span>●</span> {prompt.category?.name ?? "General"}</span>
      <button onClick={onToggleFavorite} aria-label={isFavorited ? "Remove favorite" : "Add favorite"} aria-pressed={isFavorited} className="favorite-button"><Heart size={14} fill={isFavorited ? "currentColor" : "none"} /></button>
    </div>
    <h2>{prompt.title}</h2>
    <p className="card-description">{prompt.short_description}</p>
    <p className="card-tools">{prompt.tools.length ? "For " + prompt.tools.join(" · ") : "For any LLM"}</p>
    <div className="card-actions"><CopyButton content={prompt.content} /><button onClick={() => setOpen(true)} className="view-button"><Eye size={14} /> View</button></div>
    {open && <PromptDialog prompt={prompt} onClose={() => setOpen(false)} />}
  </article>;
}
