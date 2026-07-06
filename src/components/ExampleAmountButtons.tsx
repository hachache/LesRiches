"use client";

import { ArrowRight } from "@phosphor-icons/react";

export const exampleAmounts = [
  { label: "1 million €", shortLabel: "1 million", value: "1 million" },
  { label: "10 millions €", shortLabel: "10 millions", value: "10 millions" },
  { label: "1 milliard €", shortLabel: "1 milliard", value: "1 milliard" },
  { label: "100 milliards €", shortLabel: "100 milliards", value: "100 milliards" },
] as const;

export function ExampleAmountButtons({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 sm:flex sm:flex-wrap">
      {exampleAmounts.map((example) => (
        <button
          key={example.value}
          type="button"
          onClick={() => onSelect(example.value)}
          className="inline-flex h-11 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-none border border-black/25 bg-white/70 px-2 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent-dark)] active:translate-y-px sm:px-4"
        >
          <span className="sm:hidden">{example.shortLabel}</span>
          <span className="hidden sm:inline">{example.label}</span>
          <ArrowRight size={15} weight="bold" />
        </button>
      ))}
    </div>
  );
}
