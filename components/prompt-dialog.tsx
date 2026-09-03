"use client";

import { useEffect, useRef, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import type { Prompt } from "@/lib/types";

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
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
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-4 py-2 text-xs font-black"
      aria-label="Copy prompt"
    >
      {copied ? (
        <>
          <Check size={15} /> Copied
        </>
      ) : (
        <>
          <Copy size={15} /> Copy prompt
        </>
      )}
    </button>
  );
}

export function PromptDialog({ prompt, onClose }: { prompt: Prompt; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const esc = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-title"
        className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-2xl border-2 border-ink bg-cream p-5 shadow-[8px_8px_0_#17251f] animate-scale-in"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest">
              {prompt.category?.name}
            </p>
            <h1 id="prompt-title" className="display mt-1 text-4xl">
              {prompt.title}
            </h1>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close prompt details"
            className="rounded-full border-2 border-ink p-2"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-sm text-ink/75">{prompt.short_description}</p>

        <div className="mt-5 rounded-xl border-2 border-ink bg-white p-4 max-h-80 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-6">{prompt.content}</pre>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map((tag) => (
              <span key={tag} className="chip">
                #{tag}
              </span>
            ))}
          </div>
          <CopyButton content={prompt.content} />
        </div>

        <p className="mt-4 text-xs text-ink/60">
          Last updated{" "}
          {new Intl.DateTimeFormat("en", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(prompt.updated_at))}{" "}
          · {prompt.tools.join(", ")}
        </p>
      </section>
    </div>
  );
}
