"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { AmountInput } from "@/components/AmountInput";
import { ExampleAmountButtons } from "@/components/ExampleAmountButtons";
import { ResultGrid } from "@/components/ResultGrid";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

const savingsRates = [0.1, 0.2, 0.3, 0.5, 1] as const;
const AVERAGE_FULL_CAREER_YEARS = 42;

export function ComparatorTool({ initialAmount = "1 milliard" }: { initialAmount?: string }) {
  const [amountInput, setAmountInput] = useState(initialAmount);
  const [customMonthlyIncome, setCustomMonthlyIncome] = useState("2000");
  const [savingsRate, setSavingsRate] = useState<number>(1);
  const parsed = useMemo(() => parseAmountInput(amountInput), [amountInput]);
  const monthlyIncome = Number(customMonthlyIncome.replace(",", "."));

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

          <div className="grid gap-2">
            <label htmlFor="income" className="text-sm font-semibold">
              Revenu mensuel net personnalisé
            </label>
            <input
              id="income"
              inputMode="decimal"
              value={customMonthlyIncome}
              onChange={(event) => setCustomMonthlyIncome(event.target.value)}
              className="h-12 rounded-none border border-black/25 bg-white px-3 font-semibold"
            />
            <p className="text-xs leading-5 text-[var(--muted)]">
              Sert à comparer la somme à un revenu net concret.
            </p>
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold">Taux d'épargne théorique</legend>
            <div className="grid grid-cols-3 gap-1 rounded-2xl border border-black/15 bg-white p-1 sm:grid-cols-[repeat(5,minmax(0,1fr))] sm:rounded-full">
              {savingsRates.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSavingsRate(rate)}
                  className={`h-9 min-w-0 rounded-full text-sm font-semibold transition ${
                    savingsRate === rate ? "bg-[var(--foreground)] text-[var(--panel)]" : "hover:bg-black/5"
                  }`}
                >
                  {Math.round(rate * 100)}
                </button>
              ))}
            </div>
          </fieldset>

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
          customMonthlyIncome={Number.isFinite(monthlyIncome) && monthlyIncome > 0 ? monthlyIncome : undefined}
          careerYears={AVERAGE_FULL_CAREER_YEARS}
          savingsRate={savingsRate}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-black/25 bg-white/40 p-8">
          <p className="text-lg font-semibold">Entrez une somme positive pour lancer la comparaison.</p>
        </div>
      )}
    </div>
  );
}
