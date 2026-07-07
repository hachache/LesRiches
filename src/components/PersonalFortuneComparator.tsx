"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Briefcase, PiggyBank, WarningCircle } from "@phosphor-icons/react";
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

function LogScaleBar({ amount, fortune, label }: { amount: number; fortune: number; label: string }) {
  const progress =
    amount > 0 && fortune > 0
      ? Math.min(100, Math.max(0, (Math.log10(amount) / Math.log10(fortune)) * 100))
      : 0;

  return (
    <div className="grid gap-2">
      <div className="relative h-3 overflow-hidden rounded-full bg-black/10">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
        <span>{label}</span>
        <span>fortune</span>
      </div>
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
  const primaryValue = isSalaryMode ? formatDurationYears(salaryYears) : ratioText;
  const primarySuffix = isSalaryMode ? "pour atteindre cette fortune" : "de cette fortune";
  const inputLabel = isSalaryMode ? "Salaire net mensuel" : "Épargne ou somme disponible";
  const inputHelp = isSalaryMode
    ? "Calcul théorique à 100% du salaire, sans dépense."
    : "Montant déjà disponible : épargne, héritage, prix, budget, vente.";

  const impactGroups = {
    buy: [
      ["Logements sociaux", formatLargeNumber(onePercentAnnualGain.concrete.socialHousingUnits), "unités théoriques"],
      ["Écoles", formatLargeNumber(onePercentAnnualGain.concrete.schoolsBuilt), "constructions théoriques"],
      ["Hôpitaux locaux", formatLargeNumber(onePercentAnnualGain.concrete.localHospitalsBuilt), "repères de construction"],
    ],
    social: [
      ["Enfants nourris 1 an", formatLargeNumber(onePercentAnnualGain.concrete.childrenFedOneYear), "1 repas/jour à 2 €"],
      ["Repas solidaires", formatLargeNumber(onePercentAnnualGain.concrete.foodAidMeals), "équivalent budgétaire"],
      [
        "Besoin faim mondiale",
        formatTinyPercentage(onePercentAnnualGain.concrete.globalHungerFundingShare * 100),
        "part d'un besoin annuel",
      ],
    ],
    civil: [
      ["Années d'élèves", formatLargeNumber(onePercentAnnualGain.concrete.educationStudentYears), "dépense annuelle moyenne"],
      ["Puits d'eau", formatLargeNumber(onePercentAnnualGain.concrete.waterWells), "hypothèse simplifiée"],
      [
        "Recettes de l'État",
        formatTinyPercentage(onePercentAnnualGain.publicScale.stateNetRevenueShare * 100),
        "ordre de grandeur",
      ],
    ],
  } as const;

  const summary = isSalaryMode
    ? `Avec ${formatCurrencyEUR(salaryMonthly)} net par mois, il faudrait environ ${formatDurationYears(
        salaryYears,
      )} pour atteindre la fortune estimée de ${selected.name}, sans jamais rien dépenser. Calculé sur L'Écart.`
    : `${formatCurrencyEUR(savingsTotal)} représente environ ${ratioText} de la fortune estimée de ${
        selected.name
      }. Cette fortune vaut environ ${multiplierText} ce montant. Calculé sur L'Écart.`;

  return (
    <section className={compact ? "grid gap-5" : "grid gap-7"}>
      <div
        className={`relative overflow-hidden border border-black/18 bg-[var(--panel)] ${
          compact ? "shadow-[10px_10px_0_rgba(17,16,14,0.13)]" : "paper-panel"
        }`}
      >
        <div className="grid lg:grid-cols-[minmax(280px,370px)_1fr]">
          <div className="grid content-start gap-5 border-b border-black/10 p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-dark)]">
                Choisis ton point de départ
              </p>
              <h2 className="display-type mt-2 max-w-sm text-3xl font-medium uppercase leading-[1.02] sm:text-4xl">
                Salaire ou épargne.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-full border border-black/15 bg-white p-1">
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
                className="grid grid-cols-2 gap-2"
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

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
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

          <div className="grid gap-5 p-4 sm:p-6">
            <div className="grid gap-5 xl:grid-cols-[1fr_240px] xl:items-start">
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-black/25 bg-black sm:h-20 sm:w-20">
                    <Image
                      src={selected.imageSrc}
                      alt={selected.imageAlt}
                      fill
                      sizes="80px"
                      className="object-cover"
                      loading={compact ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--muted)]">Fortune estimée de {selected.name}</p>
                    <p className="display-type mt-1 text-5xl font-medium leading-none text-[var(--accent)] sm:text-6xl">
                      {formatLargeNumber(selected.netWorthEUR)} €
                    </p>
                    <p className="mt-2 max-w-xl text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                      Donnée démo à vérifier. Variation annuelle estimée : {formatLargeNumber(selected.annualGainEUR)} €
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${mode}-${activeAmount}-${selected.slug}`}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    <p className="text-sm font-semibold text-[var(--muted)]">
                      {activeAmount ? formatCurrencyEUR(activeAmount) : "Montant invalide"}
                    </p>
                    <p className="display-type mt-2 max-w-4xl text-5xl font-medium uppercase leading-[0.98] text-[var(--foreground)] sm:text-6xl xl:text-7xl">
                      {primaryValue} <span className="text-[var(--accent)]">{primarySuffix}</span>
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                      {isSalaryMode
                        ? `Calcul à ${formatCurrencyEUR(salaryMonthly)} net par mois, soit ${formatCurrencyEUR(
                            yearlySalary,
                          )} par an, sans aucune dépense.`
                        : `Le pourcentage exact est ${formatTinyPercentage(
                            comparison.percentage,
                          )}. Le ratio est affiché en premier parce qu'il se comprend plus vite.`}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <aside className="grid gap-3 border border-black/12 bg-white/62 p-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Échelle logarithmique
                </p>
                <LogScaleBar
                  amount={isSalaryMode ? yearlySalary : activeAmount}
                  fortune={selected.netWorthEUR}
                  label={isSalaryMode ? "1 an de salaire" : "épargne"}
                />
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Même avec une échelle compressée, l'écart reste visible.
                </p>
              </aside>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${mode}-cards-${selected.slug}-${activeAmount}`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="grid gap-3 md:grid-cols-3"
              >
                {(isSalaryMode
                  ? [
                      ["Temps nécessaire", formatDurationYears(salaryYears), "à 100% du salaire net"],
                      ["Une année de toi", formatCurrencyEUR(yearlySalary), "avant toute dépense"],
                      ["La fortune", `${formatLargeNumber(selected.netWorthEUR / Math.max(yearlySalary, 1))} années`, "de ton revenu annuel"],
                    ]
                  : [
                      ["Ton épargne", ratioText, "de la fortune estimée"],
                      ["La fortune", multiplierText, "le montant saisi"],
                      ["Pourcentage exact", formatTinyPercentage(comparison.percentage), "de cette fortune"],
                    ]
                ).map(([title, value, text]) => (
                  <article key={title} className="border border-black/12 bg-white/70 p-4">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {title}
                    </p>
                    <strong className="display-type mt-2 block text-4xl font-medium leading-none text-[var(--foreground)]">
                      {value}
                    </strong>
                    <p className="mt-2 text-sm leading-5 text-[var(--muted)]">{text}</p>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="border border-black/12 bg-white/55 p-4">
              <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
                    1% de sa variation annuelle
                  </p>
                  <p className="display-type mt-2 text-4xl font-medium leading-none text-[var(--accent)]">
                    {formatCurrencyEUR(onePercentAnnualGain.amount)}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-1 rounded-full border border-black/15 bg-white p-1">
                    {[
                      ["buy", "Acheter"],
                      ["social", "Social"],
                      ["civil", "Civil"],
                    ].map(([candidate, label]) => (
                      <button
                        key={candidate}
                        type="button"
                        onClick={() => setImpactTab(candidate as ImpactTab)}
                        className={`h-9 rounded-full text-xs font-bold transition ${
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
                    initial={reduce ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {impactGroups[impactTab].map(([title, value, detail]) => (
                      <article key={title} className="border border-black/12 bg-white/78 p-4">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                          {title}
                        </p>
                        <strong className="display-type mt-2 block text-3xl font-medium leading-none">{value}</strong>
                        <p className="mt-2 text-sm leading-5 text-[var(--muted)]">{detail}</p>
                      </article>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="grid gap-4 border-t border-black/10 pt-4 md:grid-cols-[1fr_auto] md:items-center">
              <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Les équivalents sont des ordres de grandeur budgétaires. Ils ne décrivent ni une proposition fiscale, ni
                un résultat automatique.
              </p>
              <div className="flex flex-wrap gap-2">
                <ShareResultButton summary={summary} />
                {showSecondaryLink ? (
                  <Link
                    href="/comparateur"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 text-sm font-semibold transition hover:border-[var(--accent)] active:translate-y-px"
                  >
                    Voir le détail
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                ) : null}
              </div>
            </div>
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
