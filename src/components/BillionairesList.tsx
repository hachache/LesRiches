"use client";

import { useMemo, useState } from "react";
import { Briefcase, PiggyBank, WarningCircle } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { billionaires } from "@/data/billionaires";
import { BillionaireCard } from "@/components/BillionaireCard";
import { formatCurrencyEUR } from "@/lib/formatters/numbers";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

type CompareMode = "salary" | "savings";

const modeOptions = [
  { value: "salary", label: "Salaire net", Icon: Briefcase },
  { value: "savings", label: "Épargne", Icon: PiggyBank },
] as const;

const orderedBillionaires = [...billionaires].sort((a, b) => b.netWorthEUR - a.netWorthEUR);

export function BillionairesList() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<CompareMode>("salary");
  const [amountInput, setAmountInput] = useState("2 000");
  const [selectedSlug, setSelectedSlug] = useState("elon-musk");
  const parsed = useMemo(() => parseAmountInput(amountInput), [amountInput]);
  const usableAmount = parsed.amount ?? 0;

  return (
    <section className="grid gap-6">
      <div className="grid gap-6 rounded-2xl border border-black/10 bg-[var(--panel)]/90 p-5 shadow-[0_18px_70px_rgba(31,24,18,0.1)] sm:p-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold text-[var(--accent-dark)]">Un seul repère</p>
          <h2 className="display-type mt-3 max-w-[13ch] text-4xl font-medium uppercase leading-[0.94] sm:text-5xl">
            Garde la même base pour toute la liste.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
            Cinq fortunes suffisent. La comparaison compte davantage que le classement.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-sm font-semibold">Ce que tu compares</span>
            <div className="grid grid-cols-2 rounded-full border border-black/15 bg-white p-1">
              {modeOptions.map(({ value, label, Icon }) => {
                const active = mode === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setMode(value);
                      setAmountInput(value === "salary" ? "2 000" : "10 000");
                    }}
                    className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    aria-pressed={active}
                  >
                    {active ? (
                      <motion.span
                        layoutId="billionaires-mode"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                      />
                    ) : null}
                    <Icon size={17} weight="bold" className={`relative z-10 ${active ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`} />
                    <span className={`relative z-10 ${active ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">{mode === "salary" ? "Salaire net mensuel" : "Épargne totale"}</span>
            <span className="grid grid-cols-[48px_1fr] overflow-hidden rounded-xl border border-black/20 bg-white">
              <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
              <input
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                className="h-12 min-w-0 bg-white px-3 text-xl font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label={mode === "salary" ? "Salaire net mensuel" : "Épargne totale"}
              />
            </span>
            <span className={`min-h-5 text-sm ${parsed.error ? "font-medium text-[var(--accent-dark)]" : "text-[var(--muted)]"}`}>
              {parsed.error ? (
                <span className="inline-flex items-center gap-2">
                  <WarningCircle size={16} weight="bold" />
                  {parsed.error}
                </span>
              ) : parsed.warning ? (
                parsed.warning
              ) : mode === "salary" ? (
                `${formatCurrencyEUR(usableAmount)} nets par mois, sans aucune dépense.`
              ) : (
                `${formatCurrencyEUR(usableAmount)} déjà disponibles.`
              )}
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-sm font-semibold">5 fortunes extrêmes</p>
        <p className="text-xs text-[var(--muted)]">Estimations indicatives à actualiser</p>
      </div>

      <motion.div layout className="grid gap-4">
        {orderedBillionaires.map((person) => (
          <BillionaireCard
            key={person.slug}
            billionaire={person}
            amountToCompare={usableAmount}
            compareMode={mode}
            selected={selectedSlug === person.slug}
            onSelect={() => setSelectedSlug(selectedSlug === person.slug ? "" : person.slug)}
          />
        ))}
      </motion.div>
    </section>
  );
}
