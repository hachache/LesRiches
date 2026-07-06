"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { AmountInput } from "@/components/AmountInput";
import { ExampleAmountButtons } from "@/components/ExampleAmountButtons";
import { ResultGrid } from "@/components/ResultGrid";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

const AVERAGE_FULL_CAREER_YEARS = 42;

export function ComparatorTool({ initialAmount = "1 milliard" }: { initialAmount?: string }) {
  const [amountInput, setAmountInput] = useState(initialAmount);
  const parsed = useMemo(() => parseAmountInput(amountInput), [amountInput]);

  return (
    <div className="grid min-w-0 max-w-full gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
      <aside className="paper-panel mobile-safe-panel overflow-hidden rounded-none border-black/25 p-5 lg:sticky lg:top-24">
        <div className="grid gap-5">
          <div className="border-b border-black/10 pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-dark)]">
              Comparer une somme
            </p>
          </div>
          <AmountInput value={amountInput} onChange={setAmountInput} error={parsed.error} warning={parsed.warning} />
          <ExampleAmountButtons onSelect={setAmountInput} />

          <a
            href="/api/compare?amount=1000000000"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-dark)]"
          >
            Voir l'exemple API JSON
            <ArrowRight size={16} weight="bold" />
          </a>
        </div>
      </aside>

      {parsed.amount ? (
        <ResultGrid
          amount={parsed.amount}
          careerYears={AVERAGE_FULL_CAREER_YEARS}
          savingsRate={1}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-black/25 bg-white/40 p-8">
          <p className="text-lg font-semibold">Entrez une somme positive pour lancer la comparaison.</p>
        </div>
      )}
    </div>
  );
}
