"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { AmountInput } from "@/components/AmountInput";
import { ExampleAmountButtons } from "@/components/ExampleAmountButtons";
import { compareAmount } from "@/lib/calculations/compare";
import { formatLargeNumber } from "@/lib/formatters/numbers";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

export function HomeQuickCompare() {
  const [value, setValue] = useState("1 milliard");
  const parsed = useMemo(() => parseAmountInput(value), [value]);
  const result = useMemo(() => (parsed.amount ? compareAmount({ amount: parsed.amount }) : null), [parsed.amount]);

  return (
    <div className="paper-panel relative overflow-hidden rounded-none border-black/70 p-4 shadow-[8px_8px_0_rgba(0,0,0,0.95)] md:p-6">
      <AmountInput value={value} onChange={setValue} error={parsed.error} warning={parsed.warning} />
      <div className="mt-4">
        <ExampleAmountButtons onSelect={setValue} />
      </div>
      {parsed.amount && result ? (
        <div className="mt-6 border-t border-black/10 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            Cette somme représente environ
          </p>
          <p className="display-type mt-3 text-6xl font-bold uppercase leading-[0.86] text-[var(--accent)] md:text-7xl">
            {formatLargeNumber(result.smic.years)} SMIC
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Soit {formatLargeNumber(result.smic.years)} années de SMIC net, sans dépenser un centime.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-black/10 bg-white p-3">
              <span className="block text-[var(--muted)]">Carrières</span>
              <strong>{formatLargeNumber(result.workingLives.bySmic)}</strong>
            </div>
            <div className="rounded-lg border border-black/10 bg-white p-3">
              <span className="block text-[var(--muted)]">Patrimoines</span>
              <strong>{formatLargeNumber(result.wealth.medianWealthMultiplier)}</strong>
            </div>
          </div>
        </div>
      ) : null}
      <Link
        href={`/comparateur?amount=${encodeURIComponent(value)}`}
        className="mt-6 inline-flex h-14 w-full items-center justify-between gap-2 rounded-none bg-[var(--accent)] px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--accent-dark)] active:translate-y-px"
      >
        Voir les comparaisons concrètes
        <ArrowRight size={18} weight="bold" />
      </Link>
    </div>
  );
}
