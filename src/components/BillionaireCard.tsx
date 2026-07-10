"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartLineUp, ClockCounterClockwise, Ruler, UsersThree } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Billionaire } from "@/types/economics";
import {
  calculateLifetimeEquivalents,
  calculatePersonalFortuneComparison,
  calculatePhysicalScaleDistanceMeters,
} from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import {
  formatCurrencyEUR,
  formatDecimal,
  formatDurationYears,
  formatLargeNumber,
  formatPhysicalDistance,
  formatRatio,
  formatTinyPercentage,
} from "@/lib/formatters/numbers";
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
  const lifetimeCount = calculateLifetimeEquivalents(billionaire.netWorthEUR, amountToCompare);
  const physicalDistance = calculatePhysicalScaleDistanceMeters(
    compareMode === "salary" ? yearlySalary : amountToCompare,
    billionaire.netWorthEUR,
  );
  const secondaryValue = compareMode === "salary"
    ? `${formatLargeNumber(lifetimeCount)} vies de 83 ans`
    : formatTinyPercentage(personal.percentage);

  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.32 }}
      className="overflow-hidden rounded-2xl border border-black/10 bg-white/66 shadow-[0_12px_50px_rgba(31,24,18,0.08)]"
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        className="grid w-full gap-4 p-4 text-left transition-colors hover:bg-white/56 active:translate-y-px sm:grid-cols-[96px_1fr_auto] sm:items-center sm:p-5"
      >
        <span className="relative h-24 overflow-hidden rounded-xl bg-black">
          <Image src={billionaire.imageSrc} alt={billionaire.imageAlt} fill sizes="96px" className="object-cover grayscale-[8%]" />
        </span>
        <span className="min-w-0">
          <span className="display-type block text-4xl font-medium uppercase leading-[0.94] sm:text-5xl">{billionaire.name}</span>
          <span className="mt-2 block text-sm text-[var(--muted)]">Estimation indicative. À actualiser avant publication.</span>
          <span className="mt-4 grid gap-3 sm:grid-cols-2">
            <span>
              <span className="block text-xs font-semibold text-[var(--muted)]">Fortune estimée</span>
              <strong className="mt-1 block text-xl text-[var(--accent)]">{formatLargeNumber(billionaire.netWorthEUR)} €</strong>
            </span>
            <span>
              <span className="block text-xs font-semibold text-[var(--muted)]">{compareMode === "salary" ? "Temps nécessaire" : "Part de la fortune"}</span>
              <strong className="mt-1 block text-xl">{mainValue}</strong>
            </span>
          </span>
        </span>
        <span className={`inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold ${selected ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--panel)]" : "border-black/15 bg-white"}`}>
          {selected ? "Réduire" : "Détails"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.38 }}
            className="overflow-hidden border-t border-black/10"
          >
            <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr_1.1fr_auto] lg:items-stretch">
              <div className="rounded-2xl bg-[var(--foreground)] p-5 text-[var(--panel)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  {compareMode === "salary" ? <ClockCounterClockwise size={24} weight="bold" /> : <ChartLineUp size={24} weight="bold" />}
                  <p className="text-sm font-semibold text-white/62">Lecture principale</p>
                </div>
                <p className="display-type mt-6 text-4xl font-medium leading-[0.9]">{mainValue}</p>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {compareMode === "salary" ? `avec ${formatCurrencyEUR(amountToCompare)} nets par mois` : "de la fortune estimée"}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-[var(--panel)]/76 p-5">
                <UsersThree className="text-[var(--accent-dark)]" size={24} weight="bold" />
                <p className="mt-6 text-2xl font-semibold">{secondaryValue}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{compareMode === "salary" ? "au même salaire, sans aucune dépense" : "part exacte du montant saisi"}</p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/76 p-5">
                <Ruler className="text-[var(--accent-dark)]" size={24} weight="bold" />
                <p className="display-type mt-6 text-3xl font-medium leading-none">{formatPhysicalDistance(physicalDistance)}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {compareMode === "salary" ? "si une année de salaire mesurait 1 mm" : "si ton épargne mesurait 1 mm"}
                </p>
              </div>

              <div className="grid min-w-48 content-between gap-5 rounded-2xl border border-[var(--accent)]/20 bg-[rgba(213,31,18,0.07)] p-5">
                <div>
                  <p className="text-sm font-semibold text-[var(--accent-dark)]">1% d'une année estimée</p>
                  <p className="mt-3 text-lg font-semibold">{formatLargeNumber(onePercentAnnualGain.concrete.childrenFedOneYear)} enfants nourris un an</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">ou {formatDecimal(onePercentAnnualGain.concrete.schoolsBuilt, 1)} écoles théoriques</p>
                </div>
                <Link href="/comparateur" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--panel)] transition hover:-translate-y-0.5 hover:bg-black active:translate-y-px">
                  Comparer
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
