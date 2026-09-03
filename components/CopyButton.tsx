"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
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
      className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--mint)] px-4 py-2 text-xs font-black"
      aria-label="Copy prompt"
    >
      {copied ? (
        <>
          <Check size={15} />
          Copied
        </>
      ) : (
        <>
          <Copy size={15} />
          Copy prompt
        </>
      )}
    </button>
  );
}
