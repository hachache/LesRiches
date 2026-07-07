"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BowlFood, ChartPieSlice, TrendUp } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { billionaires } from "@/data/billionaires";
import { economicReferences } from "@/data/economicReferences";
import { calculatePersonalFortuneComparison } from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatLargeNumber, formatTinyPercentage } from "@/lib/formatters/numbers";
import { FortuneFractionPie } from "@/components/FortuneFractionPie";
import { ShareResultButton } from "@/components/ShareResultButton";
import { TaxScenarioPanel } from "@/components/TaxScenarioPanel";

type PersonalFortuneComparatorProps = {
  compact?: boolean;
  showSecondaryLink?: boolean;
};

function readMoneyInput(value: string): number {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function PersonalFortuneComparator({ compact = false, showSecondaryLink = true }: PersonalFortuneComparatorProps) {
  const reduce = useReducedMotion();
  const [amountInput, setAmountInput] = useState("10000");
  const [selectedSlug, setSelectedSlug] = useState("elon-musk");
  const referenceMonthlyIncome = economicReferences.medianNetSalaryMonthly.value;
  const amountToCompare = readMoneyInput(amountInput);
  const selected = billionaires.find((person) => person.slug === selectedSlug) ?? billionaires[0];

  const comparison = useMemo(
    () =>
      calculatePersonalFortuneComparison({
        salaryMonthly: referenceMonthlyIncome,
        savingsTotal: amountToCompare,
        netWorthEUR: selected.netWorthEUR,
      }),
    [amountToCompare, referenceMonthlyIncome, selected.netWorthEUR],
  );
  const onePercentAnnualGain = useMemo(
    () => calculateTaxScenario(selected.annualGainEUR, 0.01, selected.annualGainLabel),
    [selected.annualGainEUR, selected.annualGainLabel],
  );

  const summary = `${formatCurrencyEUR(amountToCompare)} représente ${formatTinyPercentage(
    comparison.percentage,
  )} de la fortune estimée de ${selected.name}. Au revenu net médian de référence, cette fortune représente environ ${formatLargeNumber(
    comparison.salaryYears,
  )} années de revenu. Calculé sur L'Écart.`;

  return (
    <section className={compact ? "grid gap-5" : "grid gap-8"}>
      <div
        className={`grid overflow-hidden rounded-none border-black/35 ${
          compact ? "border bg-white/88 shadow-[8px_8px_0_rgba(0,0,0,0.18)] backdrop-blur-sm" : "paper-panel"
        } lg:grid-cols-[340px_1fr]`}
      >
        <div className="grid gap-4 border-b border-black/15 p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
              Moi vs ultra-riches
            </p>
            <h2 className="display-type mt-2 text-3xl font-semibold uppercase leading-[0.98] sm:text-4xl">
              Une somme. Trois repères.
            </h2>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">Somme à comparer</span>
            <div className="grid grid-cols-[48px_1fr] border border-black/25 bg-white">
              <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
              <input
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                className="h-12 bg-white px-3 text-xl font-semibold"
                aria-label="Somme à comparer"
              />
            </div>
          </label>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold">Fortune comparée</legend>
            <select
              value={selectedSlug}
              onChange={(event) => setSelectedSlug(event.target.value)}
              className="h-12 border border-black/25 bg-white px-3 text-base font-semibold sm:hidden"
              aria-label="Fortune comparée"
            >
              {billionaires.map((person) => (
                <option key={person.slug} value={person.slug}>
                  {person.name} - {formatLargeNumber(person.netWorthEUR)} €
                </option>
              ))}
            </select>
            <div className="hidden gap-2 sm:grid">
              {billionaires.map((person) => (
                <button
                  key={person.slug}
                  type="button"
                  onClick={() => setSelectedSlug(person.slug)}
                  className={`grid grid-cols-[44px_1fr_auto] items-center gap-3 border p-2 text-left transition active:translate-y-px ${
                    selected.slug === person.slug
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-black/15 bg-white/70 hover:border-black/40"
                  }`}
                >
                  <span className="relative h-11 w-11 overflow-hidden bg-black">
                    <Image src={person.imageSrc} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{person.name}</span>
                    <span className="block text-xs opacity-75">{formatLargeNumber(person.netWorthEUR)} €</span>
                  </span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <motion.div
          key={selected.slug + amountToCompare}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid gap-5 p-4 sm:p-6"
        >
          <div className="grid gap-5 xl:grid-cols-[1fr_220px] xl:items-center">
            <div className="grid gap-5">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-black/30 bg-black sm:h-24 sm:w-24">
                  <Image src={selected.imageSrc} alt={selected.imageAlt} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--muted)]">Fortune estimée de {selected.name}</p>
                  <p className="display-type mt-1 text-5xl font-semibold leading-none text-[var(--accent)] sm:text-7xl">
                    {formatLargeNumber(selected.netWorthEUR)} €
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                    Variation annuelle estimée : {formatLargeNumber(selected.annualGainEUR)} €
                  </p>
                </div>
              </div>

              <div>
                <p className="display-type text-4xl font-semibold uppercase leading-[0.95] sm:text-5xl xl:text-6xl">
                  Cette somme représente{" "}
                  <span className="text-[var(--accent)]">{formatTinyPercentage(comparison.percentage)}</span>.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                  Un seul montant en entrée. Le reste traduit l'écart en repères simples.
                </p>
              </div>
            </div>

            <div className="mx-auto">
              <FortuneFractionPie percentage={comparison.percentage} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              [
                ChartPieSlice,
                "Ta part",
                formatTinyPercentage(comparison.percentage),
                "de la fortune estimée",
              ],
              [
                TrendUp,
                "Revenu médian",
                `${formatLargeNumber(comparison.salaryYears)} ans`,
                `référence : ${formatCurrencyEUR(referenceMonthlyIncome)}/mois`,
              ],
              [
                BowlFood,
                "1% de son année",
                `${formatLargeNumber(onePercentAnnualGain.amount)} €`,
                `${formatLargeNumber(onePercentAnnualGain.concrete.childrenFedOneYear)} enfants nourris 1 an, ou ${formatLargeNumber(onePercentAnnualGain.concrete.schoolsBuilt)} écoles théoriques`,
              ],
            ].map(([Icon, title, value, text]) => (
              <article key={String(title)} className="border border-black/15 bg-white/68 p-4">
                <Icon size={22} weight="bold" className="text-[var(--accent-dark)]" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{String(title)}</p>
                <strong className="display-type mt-2 block text-4xl font-semibold leading-none">{String(value)}</strong>
                <p className="mt-2 text-sm text-[var(--muted)]">{String(text)}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 border-t border-black/10 pt-4 md:grid-cols-[1fr_auto] md:items-center">
            <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Les équivalents sont théoriques : ils servent à sentir l'ordre de grandeur, pas à promettre un résultat
              automatique.
            </p>
            <div className="flex flex-wrap gap-2">
              <ShareResultButton summary={summary} />
              {showSecondaryLink ? (
                <Link
                  href="/comparateur"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 text-sm font-semibold transition hover:border-[var(--accent)] active:translate-y-px"
                >
                  Comparer en détail
                  <ArrowRight size={16} weight="bold" />
                </Link>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
      {!compact ? (
        <TaxScenarioPanel
          baseAmountEUR={selected.annualGainEUR}
          baseLabel={selected.annualGainLabel}
          ownerName={selected.name}
        />
      ) : null}
    </section>
  );
}
