"use client";

import { useState } from "react";
import { Copy, ShareNetwork } from "@phosphor-icons/react";

type ShareResultButtonProps = {
  summary: string;
};

export function ShareResultButton({ summary }: ShareResultButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: "Combien de SMIC", text: summary, url: window.location.href });
      return;
    }
    await copy();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--panel)] transition hover:bg-black active:translate-y-px"
      >
        <Copy size={18} weight="bold" />
        {copied ? "Résumé copié" : "Copier le résumé"}
      </button>
      <button
        type="button"
        onClick={share}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 text-sm font-semibold transition hover:border-[var(--accent)] active:translate-y-px"
      >
        <ShareNetwork size={18} weight="bold" />
        Partager
      </button>
    </div>
  );
}
