"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartLineUp, ClockCounterClockwise } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Billionaire } from "@/types/economics";
import { calculatePersonalFortuneComparison } from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatDurationYears, formatLargeNumber, formatMultiplier, formatRatio, formatTinyPercentage } from "@/lib/formatters/numbers";
import { economicReferences } from "@/data/economicReferences";

function formatEpicYears(value: number): string {
  if (value >= 1_000_000) return `${formatLargeNumber(value)} d'années`;
  return formatDurationYears(value);
}

export function BillionaireCard({
  billionaire,
  amountToCompare,
  compareMode,
  selected,
  onSelect,
}: {
  billionaire: Billionaire;
  amountToCompare: number;
  compareMode: "salary" | "savings";
  selected: boolean;
  onSelect: () => void;
}) {
  const reduce = useReducedMotion();
  const yearlySalary = amountToCompare > 0 ? amountToCompare * 12 : 0;
  const salaryYears = yearlySalary > 0 ? billionaire.netWorthEUR / yearlySalary : 0;
  const personal = calculatePersonalFortuneComparison({
    salaryMonthly: economicReferences.medianNetSalaryMonthly.value,
    savingsTotal: compareMode === "savings" ? amountToCompare : 0,
    netWorthEUR: billionaire.netWorthEUR,
  });
  const onePercentAnnualGain = calculateTaxScenario(billionaire.annualGainEUR, 0.01, billionaire.annualGainLabel);
  const mainValue = compareMode === "salary" ? formatEpicYears(salaryYears) : formatRatio(personal.ratioDenominator);
  const mainDetail = compareMode === "salary" ? `avec ${formatCurrencyEUR(amountToCompare)} nets par mois` : "de la fortune estimée";

  return (
    <motion.article layout={!reduce} className="overflow-hidden rounded-2xl border border-black/10 bg-white/64 shadow-[0_12px_50px_rgba(31,24,18,0.08)]">
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        className="grid w-full gap-4 p-4 text-left transition hover:bg-white/45 active:translate-y-px sm:grid-cols-[110px_1fr_auto] sm:items-center sm:p-5"
      >
        <span className="relative h-24 overflow-hidden rounded-xl bg-black sm:h-28">
          <Image src={billionaire.imageSrc} alt={billionaire.imageAlt} fill sizes="128px" className="object-cover grayscale-[8%]" />
        </span>
        <span className="min-w-0">
          <span className="display-type block text-4xl font-medium uppercase leading-[0.95] sm:text-5xl">{billionaire.name}</span>
          <span className="mt-2 block text-sm text-[var(--muted)]">Donnée démo. À mettre à jour depuis Forbes ou Bloomberg.</span>
          <span className="mt-4 grid gap-3 sm:grid-cols-2">
            <span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Fortune estimée</span>
              <strong className="mt-1 block text-xl text-[var(--accent)]">{formatLargeNumber(billionaire.netWorthEUR)} €</strong>
            </span>
            <span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{compareMode === "salary" ? "Temps théorique" : "Ta part"}</span>
              <strong className="mt-1 block text-xl">{mainValue}</strong>
            </span>
          </span>
        </span>
        <span className={`inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold ${selected ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--panel)]" : "border-black/15 bg-white"}`}>
          {selected ? "Réduire" : "Voir"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-black/10"
          >
            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <div className="flex items-start gap-3">
                {compareMode === "salary" ? (
                  <ClockCounterClockwise className="mt-0.5 shrink-0 text-[var(--accent)]" size={24} weight="bold" />
                ) : (
                  <ChartLineUp className="mt-0.5 shrink-0 text-[var(--accent)]" size={24} weight="bold" />
                )}
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">Lecture principale</p>
                  <p className="mt-2 text-base font-semibold">{mainValue}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{mainDetail}</p>
                </div>
              </div>

              <div className="border-l-2 border-[var(--accent)] pl-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">1% d'une année estimée</p>
                <p className="mt-2 text-lg font-semibold">{formatLargeNumber(onePercentAnnualGain.concrete.childrenFedOneYear)} enfants</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">nourris un an, comme équivalent budgétaire théorique.</p>
              </div>

              <Link href="/comparateur" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--panel)] transition hover:bg-black active:translate-y-px">
                Comparer précisément
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
            {compareMode === "savings" ? (
              <p className="px-5 pb-5 text-sm text-[var(--muted)]">La fortune vaut environ {formatMultiplier(personal.savingsMultiplier)} le montant saisi, soit {formatTinyPercentage(personal.percentage)} exactement.</p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
