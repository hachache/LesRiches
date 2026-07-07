"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  ArrowRight,
  Briefcase,
  ChartLineUp,
  ForkKnife,
  GraduationCap,
  Hospital,
  Mountains,
  ClockCounterClockwise,
  PiggyBank,
  ShareFat,
  WarningCircle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { billionaires } from "@/data/billionaires";
import { economicReferences } from "@/data/economicReferences";
import {
  calculatePersonalFortuneComparison,
  calculateSalaryYearsToFortune,
} from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import {
  formatCurrencyEUR,
  formatDurationYears,
  formatLargeNumber,
  formatMultiplier,
  formatRatio,
  formatTinyPercentage,
} from "@/lib/formatters/numbers";
import { parseAmountInput } from "@/lib/formatters/parseAmount";
import { ShareResultButton } from "@/components/ShareResultButton";
import { TaxScenarioPanel } from "@/components/TaxScenarioPanel";

type PersonalFortuneComparatorProps = {
  compact?: boolean;
  showSecondaryLink?: boolean;
};

type CompareMode = "salary" | "savings";
type ImpactTab = "buy" | "social" | "civil";
type ImpactCard = {
  title: string;
  value: string;
  detail: string;
  Icon: ComponentType<IconProps>;
};

const salaryExamples = [
  ["1 500 €", "1500"],
  ["2 000 €", "2000"],
  ["3 000 €", "3000"],
  ["5 000 €", "5000"],
] as const;

const savingsExamples = [
  ["10 000 €", "10 000"],
  ["100 000 €", "100 000"],
  ["1 million €", "1 million"],
  ["1 milliard €", "1 milliard"],
] as const;

const modeOptions = [
  { value: "salary", Icon: Briefcase, label: "Salaire net" },
  { value: "savings", Icon: PiggyBank, label: "Épargne" },
] as const;

function formatEpicYears(value: number): string {
  if (value >= 1_000_000) return `${formatLargeNumber(value)} d'années`;
  return formatDurationYears(value);
}

function TimeScale({ years, isSalaryMode, selectedName }: { years: number; isSalaryMode: boolean; selectedName: string }) {
  const markers = isSalaryMode
    ? [
        { label: "1 vie", value: 83, show: years >= 83 },
        { label: "Antiquité", value: 2_500, show: years >= 2_500 },
        { label: "Homo sapiens", value: 300_000, show: years >= 300_000 },
        { label: "Dinosaures", value: 66_000_000, show: years >= 66_000_000 },
      ]
    : [
        { label: "toi", value: 1, show: true },
        { label: "x1 000", value: 1_000, show: years >= 1_000 },
        { label: "x1 million", value: 1_000_000, show: years >= 1_000_000 },
        { label: selectedName, value: Math.max(years, 1), show: true },
      ];
  const visible = markers.filter((marker) => marker.show);
  const max = Math.max(years, 1);

  return (
    <article className="grid content-between gap-8 rounded-[2.25rem] bg-white/66 p-6 shadow-[0_24px_80px_rgba(31,24,18,0.1)] sm:p-8">
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent-dark)]">
            Timeline
          </p>
          <ClockCounterClockwise className="text-[var(--accent)]" size={25} weight="bold" />
        </div>
        <p className="mt-3 text-lg leading-7 text-[var(--muted)]">
          {isSalaryMode
            ? "Le résultat ne tient pas dans une vie humaine. Il traverse des repères historiques."
            : "La distance est affichée comme un ratio. Plus on avance, plus l'échelle se déforme."}
        </p>
      </div>
      <div className="grid gap-5">
        <div className="relative h-2 rounded-full bg-black/10">
          {visible.map((marker) => {
            const left = isSalaryMode
              ? Math.min(100, Math.max(0, (Math.log10(marker.value) / Math.log10(max)) * 100))
              : Math.min(100, Math.max(0, (Math.log10(marker.value) / Math.log10(max)) * 100));

            return (
              <span
                key={marker.label}
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)] shadow-[0_0_0_8px_rgba(17,16,14,0.08)] first:bg-[var(--accent)]"
                style={{ left: `${left}%` }}
              />
            );
          })}
        </div>
        <div className="grid gap-3">
          {visible.map((marker) => (
            <div key={marker.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-[var(--foreground)]">{marker.label}</span>
              <span className="text-right text-[var(--muted)]">
                {isSalaryMode ? formatEpicYears(marker.value) : marker.label === selectedName ? "fortune" : formatMultiplier(marker.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function ScaleStory({
  ownAmount,
  fortune,
}: {
  ownAmount: number;
  fortune: number;
}) {
  const ratio = ownAmount > 0 && fortune > 0 ? Math.max(1, fortune / ownAmount) : 0;
  const realWidth = ratio ? Math.max(0.2, Math.min(100, (ownAmount / fortune) * 100)) : 0;
  const compressedWidth = ratio ? Math.min(100, Math.max(6, (Math.log10(ownAmount) / Math.log10(fortune)) * 100)) : 0;

  return (
    <div className="grid gap-5 rounded-[2rem] bg-white/62 p-4 shadow-[0_22px_70px_rgba(31,24,18,0.09)] sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Échelle réelle puis compressée
        </p>
        <ChartLineUp className="text-[var(--accent)]" size={22} weight="bold" />
      </div>
      <div className="grid gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span>échelle réelle</span>
            <span>{formatRatio(ratio)}</span>
          </div>
          <div className="relative h-5 overflow-hidden rounded-full bg-black/10">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${realWidth}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <span className="absolute inset-y-0 right-0 w-full rounded-full border border-black/10" />
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            En réel, ta part est presque invisible. C'est le choc d'échelle.
          </p>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span>échelle compressée</span>
            <span>{formatCurrencyEUR(ownAmount)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-black/8">
            <motion.span
              className="block h-full rounded-full bg-[var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${compressedWidth}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span>Fortune</span>
            <span>{formatLargeNumber(fortune)} €</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-black/8">
            <motion.span
              className="block h-full rounded-full bg-[var(--foreground)]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            />
          </div>
        </div>
      </div>
      <p className="text-sm leading-6 text-[var(--muted)]">
        La seconde barre utilise une compression logarithmique pour rendre la distance lisible.
      </p>
    </div>
  );
}

export function PersonalFortuneComparator({ compact = false, showSecondaryLink = true }: PersonalFortuneComparatorProps) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<CompareMode>("salary");
  const [impactTab, setImpactTab] = useState<ImpactTab>("social");
  const [salaryInput, setSalaryInput] = useState("2000");
  const [savingsInput, setSavingsInput] = useState("10 000");
  const [selectedSlug, setSelectedSlug] = useState("elon-musk");
  const selected = billionaires.find((person) => person.slug === selectedSlug) ?? billionaires[0];

  const rawInput = mode === "salary" ? salaryInput : savingsInput;
  const parsed = useMemo(() => parseAmountInput(rawInput), [rawInput]);
  const activeAmount = parsed.amount ?? 0;
  const salaryMonthly = mode === "salary" ? activeAmount : economicReferences.medianNetSalaryMonthly.value;
  const savingsTotal = mode === "savings" ? activeAmount : 0;

  const comparison = useMemo(
    () =>
      calculatePersonalFortuneComparison({
        salaryMonthly,
        savingsTotal,
        netWorthEUR: selected.netWorthEUR,
      }),
    [salaryMonthly, savingsTotal, selected.netWorthEUR],
  );
  const salaryYears = useMemo(
    () => calculateSalaryYearsToFortune(selected.netWorthEUR, salaryMonthly),
    [salaryMonthly, selected.netWorthEUR],
  );
  const yearlySalary = salaryMonthly * 12;
  const onePercentAnnualGain = useMemo(
    () => calculateTaxScenario(selected.annualGainEUR, 0.01, selected.annualGainLabel),
    [selected.annualGainEUR, selected.annualGainLabel],
  );

  const ratioText = formatRatio(comparison.ratioDenominator);
  const multiplierText = formatMultiplier(comparison.savingsMultiplier);
  const isSalaryMode = mode === "salary";
  const examples = isSalaryMode ? salaryExamples : savingsExamples;
  const inputValue = isSalaryMode ? salaryInput : savingsInput;
  const setInputValue = isSalaryMode ? setSalaryInput : setSavingsInput;
  const primarySuffix = isSalaryMode ? "pour atteindre cette fortune" : "de cette fortune";
  const inputLabel = isSalaryMode ? "Salaire net mensuel" : "Épargne ou somme disponible";
  const inputHelp = isSalaryMode
    ? "Calcul théorique à 100% du salaire, sans dépense."
    : "Montant déjà disponible : épargne, héritage, prix, budget, vente.";
  const sceneKey = `${mode}-${selected.slug}`;

  const impactGroups: Record<ImpactTab, ImpactCard[]> = {
    buy: [
      {
        title: "Logements",
        value: formatLargeNumber(onePercentAnnualGain.concrete.socialHousingUnits),
        detail: "logements sociaux théoriques",
        Icon: Mountains,
      },
      {
        title: "Écoles",
        value: formatLargeNumber(onePercentAnnualGain.concrete.schoolsBuilt),
        detail: "constructions théoriques",
        Icon: GraduationCap,
      },
      {
        title: "Hôpitaux",
        value: formatLargeNumber(onePercentAnnualGain.concrete.localHospitalsBuilt),
        detail: "hôpitaux locaux théoriques",
        Icon: Hospital,
      },
    ],
    social: [
      {
        title: "Enfants",
        value: formatLargeNumber(onePercentAnnualGain.concrete.childrenFedOneYear),
        detail: "nourris pendant un an",
        Icon: ForkKnife,
      },
      {
        title: "Repas",
        value: formatLargeNumber(onePercentAnnualGain.concrete.foodAidMeals),
        detail: "repas solidaires théoriques",
        Icon: ForkKnife,
      },
      {
        title: "Faim mondiale",
        value: formatTinyPercentage(onePercentAnnualGain.concrete.globalHungerFundingShare * 100),
        detail: "d'un besoin annuel estimé",
        Icon: ChartLineUp,
      },
    ],
    civil: [
      {
        title: "Éducation",
        value: formatLargeNumber(onePercentAnnualGain.concrete.educationStudentYears),
        detail: "années d'élèves financées",
        Icon: GraduationCap,
      },
      {
        title: "Eau",
        value: formatLargeNumber(onePercentAnnualGain.concrete.waterWells),
        detail: "puits théoriques",
        Icon: Mountains,
      },
      {
        title: "État",
        value: formatTinyPercentage(onePercentAnnualGain.publicScale.stateNetRevenueShare * 100),
        detail: "des recettes nettes annuelles",
        Icon: ChartLineUp,
      },
    ],
  };

  const summary = isSalaryMode
    ? `Avec ${formatCurrencyEUR(salaryMonthly)} net par mois, il faudrait environ ${formatEpicYears(
        salaryYears,
      )} pour atteindre la fortune estimée de ${selected.name}, sans jamais rien dépenser. Calculé sur L'Écart.`
    : `${formatCurrencyEUR(savingsTotal)} représente environ ${ratioText} de la fortune estimée de ${
        selected.name
      }. Cette fortune vaut environ ${multiplierText} ce montant. Calculé sur L'Écart.`;

  return (
    <section className={compact ? "grid gap-6" : "grid gap-10"}>
      <div
        className={`relative overflow-hidden rounded-[2rem] border border-black/10 bg-[var(--panel)] ${
          compact ? "shadow-[0_22px_70px_rgba(31,24,18,0.1)]" : "paper-panel"
        }`}
      >
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="lg:pt-1">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-dark)]">
                Choisis ton point de départ
              </p>
              <h2 className="mt-2 max-w-[15ch] text-3xl font-black uppercase leading-[1.02] tracking-tight sm:text-4xl">
                Salaire ou épargne.
              </h2>
            </div>

          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[300px_1fr_260px] xl:items-end">
            <div className="grid grid-cols-2 gap-1 rounded-full border border-black/15 bg-white p-1 md:col-span-2 xl:col-span-1">
              {modeOptions.map(({ value, Icon, label }) => {
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold transition ${
                      mode === value ? "bg-[var(--foreground)] text-[var(--panel)]" : "hover:bg-black/5"
                    }`}
                  >
                    <Icon size={17} weight="bold" />
                    {label}
                  </button>
                );
              })}
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">{inputLabel}</span>
              <div className="grid grid-cols-[48px_1fr] border border-black/25 bg-white">
                <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
                <input
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="h-12 bg-white px-3 text-xl font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  aria-label={inputLabel}
                />
              </div>
              {parsed.error ? (
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--accent-dark)]">
                  <WarningCircle size={16} weight="bold" />
                  {parsed.error}
                </span>
              ) : parsed.warning ? (
                <span className="text-sm text-[var(--muted)]">{parsed.warning}</span>
              ) : (
                <span className="text-sm text-[var(--muted)]">{inputHelp}</span>
              )}
            </label>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="hidden grid-cols-2 gap-2 sm:grid md:col-span-2 xl:col-span-3 xl:grid-cols-4"
              >
                {examples.map(([label, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setInputValue(value)}
                    className="border border-black/15 bg-white/72 px-3 py-2 text-left text-sm font-semibold transition hover:border-[var(--accent)] hover:bg-white active:translate-y-px"
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Fortune de référence</span>
              <select
                value={selectedSlug}
                onChange={(event) => setSelectedSlug(event.target.value)}
                className="h-12 border border-black/25 bg-white px-3 text-base font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Fortune de référence"
              >
                {billionaires.map((person) => (
                  <option key={person.slug} value={person.slug}>
                    {person.name} - {formatLargeNumber(person.netWorthEUR)} €
                  </option>
                ))}
              </select>
            </label>

            <div className="hidden gap-2 sm:grid sm:grid-cols-2 md:col-span-2 xl:col-span-3">
              {billionaires.slice(0, 4).map((person) => (
                <button
                  key={person.slug}
                  type="button"
                  onClick={() => setSelectedSlug(person.slug)}
                  className={`grid grid-cols-[34px_1fr] items-center gap-2 border px-2 py-2 text-left transition active:translate-y-px ${
                    selected.slug === person.slug
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-black/12 bg-white/55 hover:border-black/35"
                  }`}
                >
                  <span className="relative h-8 w-8 overflow-hidden bg-black">
                    <Image src={person.imageSrc} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{person.name}</span>
                    <span className="block text-xs opacity-72">{formatLargeNumber(person.netWorthEUR)} €</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid gap-8 overflow-hidden rounded-[2.5rem] bg-[var(--panel)] p-5 shadow-[0_34px_120px_rgba(31,24,18,0.13)] sm:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          {!reduce ? (
            <motion.div
              key={sceneKey}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[rgba(213,31,18,0.10)] to-transparent"
              initial={{ x: "-20%", opacity: 0 }}
              animate={{ x: "430%", opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : null}
        </AnimatePresence>
            <div className="grid gap-8 xl:grid-cols-[1fr_300px] xl:items-start">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={sceneKey}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="grid gap-6"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      key={selected.slug}
                      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.32 }}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-black shadow-[0_18px_50px_rgba(17,16,14,0.18)] sm:h-20 sm:w-20"
                    >
                      <Image
                        src={selected.imageSrc}
                        alt={selected.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover"
                        loading={compact ? "eager" : "lazy"}
                      />
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--muted)]">Fortune estimée de {selected.name}</p>
                      <p className="display-type mt-1 text-4xl font-medium leading-none text-[var(--accent)] sm:text-5xl">
                        {formatLargeNumber(selected.netWorthEUR)} €
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 py-2 sm:py-4">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                      {isSalaryMode ? "Ton salaire" : "Ton épargne"}
                    </p>
                    <p className="display-type text-4xl font-medium leading-none sm:text-6xl">
                      {formatCurrencyEUR(activeAmount)}
                    </p>
                    <div className="flex h-12 items-center">
                      <motion.span
                        initial={reduce ? false : { scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="h-10 w-[3px] origin-top bg-[var(--accent)]"
                      />
                    </div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                      {isSalaryMode ? "Il te faudrait" : "Cela représente"}
                    </p>
                    <h2 className="display-type max-w-5xl text-[clamp(3.2rem,5.8vw,5.7rem)] font-medium uppercase leading-[0.94] tracking-normal text-[var(--foreground)]">
                      {isSalaryMode ? (
                        formatEpicYears(salaryYears)
                      ) : (
                        formatRatio(comparison.ratioDenominator)
                      )}
                    </h2>
                    <p className="max-w-2xl text-xl leading-8 text-[var(--muted)] sm:text-2xl">
                      {primarySuffix}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="grid gap-4">
                <ScaleStory
                  ownAmount={isSalaryMode ? yearlySalary : activeAmount}
                  fortune={selected.netWorthEUR}
                />
                <details className="rounded-[2rem] bg-white/55 p-4 text-sm leading-6 text-[var(--muted)] shadow-[0_18px_60px_rgba(31,24,18,0.08)]">
                  <summary className="cursor-pointer font-semibold text-[var(--foreground)]">
                    Hypothèse du calcul
                  </summary>
                  <p className="mt-3">
                    {isSalaryMode
                      ? `Calcul à ${formatCurrencyEUR(salaryMonthly)} net par mois, soit ${formatCurrencyEUR(
                          yearlySalary,
                        )} par an, sans aucune dépense.`
                      : `Le pourcentage exact est ${formatTinyPercentage(
                          comparison.percentage,
                        )}. Le ratio est affiché en premier parce qu'il se comprend plus vite.`}
                  </p>
                </details>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${sceneKey}-cards`}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
              >
                <article className="relative overflow-hidden rounded-[2.25rem] bg-[var(--foreground)] p-6 text-[var(--panel)] shadow-[0_30px_90px_rgba(17,16,14,0.2)] sm:p-8">
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)]/22 blur-3xl" />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                    Intuition immédiate
                  </p>
                  <div className="mt-8 grid gap-7">
                    {(isSalaryMode
                      ? [
                          ["Une vie humaine", `${formatLargeNumber(Math.max(salaryYears / 83, 0))}`, "vies de 83 ans"],
                          ["Générations", `${formatLargeNumber(Math.max(salaryYears / 25, 0))}`, "générations de 25 ans"],
                          [
                            "Histoire",
                            salaryYears > 300_000 ? "Avant sapiens" : formatEpicYears(salaryYears),
                            salaryYears > 300_000
                              ? "les premiers Homo sapiens n'existaient pas encore"
                              : "ordre de grandeur temporel",
                          ],
                        ]
                      : [
                          ["Ta part", ratioText, "lecture la plus simple"],
                          ["La fortune", multiplierText, "ce que vaut le montant saisi"],
                          ["Pourcentage", formatTinyPercentage(comparison.percentage), "valeur exacte"],
                        ]
                    ).map(([title, value, text], index) => (
                      <motion.div
                        key={title}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.06 }}
                        className="grid gap-1 border-t border-white/12 pt-4 first:border-t-0 first:pt-0"
                      >
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/48">
                          {title}
                        </p>
                        <strong className="display-type text-4xl font-medium leading-none sm:text-5xl">
                          {value}
                        </strong>
                        <p className="text-sm leading-6 text-white/62">{text}</p>
                      </motion.div>
                    ))}
                  </div>
                </article>

                <TimeScale
                  years={isSalaryMode ? salaryYears : comparison.ratioDenominator}
                  isSalaryMode={isSalaryMode}
                  selectedName={selected.name}
                />
              </motion.div>
            </AnimatePresence>

            <details className="group rounded-[2.5rem] bg-white/42 p-5 shadow-[0_24px_90px_rgba(31,24,18,0.08)] sm:p-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
                    Simulation secondaire
                  </span>
                  <span className="display-type mt-2 block text-3xl font-medium uppercase leading-none sm:text-4xl">
                    Voir ce que 1% représenterait
                  </span>
                </span>
                <span className="inline-flex h-11 shrink-0 items-center rounded-full bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--panel)] transition group-open:rotate-1">
                  Ouvrir
                </span>
              </summary>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
                    1% de sa variation annuelle
                  </p>
                  <p className="display-type mt-2 text-5xl font-medium leading-none text-[var(--accent)] sm:text-6xl">
                    {formatCurrencyEUR(onePercentAnnualGain.amount)}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-full border border-black/10 bg-white p-1 shadow-[0_12px_40px_rgba(31,24,18,0.08)]">
                  {[
                    ["buy", "Acheter"],
                    ["social", "Social"],
                    ["civil", "Civil"],
                  ].map(([candidate, label]) => (
                    <button
                      key={candidate}
                      type="button"
                      onClick={() => setImpactTab(candidate as ImpactTab)}
                      className={`h-10 rounded-full px-4 text-xs font-bold transition ${
                        impactTab === candidate ? "bg-[var(--foreground)] text-[var(--panel)]" : "hover:bg-black/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={impactTab}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0"
                >
                  {impactGroups[impactTab].map(({ title, value, detail, Icon }, index) => (
                    <motion.article
                      key={title}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.34, delay: index * 0.06 }}
                      className="min-w-[78%] snap-center rounded-[2rem] bg-[var(--panel)] p-5 shadow-[0_20px_70px_rgba(31,24,18,0.1)] sm:min-w-0 sm:p-6"
                    >
                      <Icon className="text-[var(--accent)]" size={34} weight="duotone" />
                      <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                        {title}
                      </p>
                      <strong className="display-type mt-2 block text-5xl font-medium leading-none sm:text-6xl">
                        {value}
                      </strong>
                      <p className="mt-3 text-base leading-6 text-[var(--muted)]">{detail}</p>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </details>

            <div className="grid gap-5 rounded-[2.5rem] bg-[var(--foreground)] p-5 text-[var(--panel)] shadow-[0_28px_90px_rgba(17,16,14,0.18)] md:grid-cols-[1fr_auto] md:items-center md:p-7">
              <div>
                <ShareFat className="text-[var(--accent)]" size={30} weight="bold" />
                <p className="display-type mt-4 text-4xl font-medium uppercase leading-none sm:text-5xl">
                  Partage cette comparaison
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
                  Les équivalents sont des ordres de grandeur budgétaires. Ils ne décrivent ni une proposition fiscale,
                  ni un résultat automatique.
                </p>
              </div>
              <div className="grid gap-2">
                <ShareResultButton
                  summary={summary}
                  card={{
                    modeLabel: isSalaryMode ? "Salaire net mensuel" : "Épargne comparée",
                    amount: formatCurrencyEUR(activeAmount),
                    billionaireName: selected.name,
                    fortune: `${formatLargeNumber(selected.netWorthEUR)} €`,
                    result: isSalaryMode ? formatEpicYears(salaryYears) : ratioText,
                    resultLabel: primarySuffix,
                  }}
                />
                {showSecondaryLink ? (
                  <Link
                    href="/comparateur"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/16 bg-white/8 px-5 text-sm font-semibold text-white transition hover:bg-white/14 active:translate-y-px"
                  >
                    Voir le détail
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                ) : null}
              </div>
            </div>
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
