"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  ChartLineUp,
  ClockCounterClockwise,
  PiggyBank,
  Ruler,
  ShareFat,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { billionaires } from "@/data/billionaires";
import { economicReferences } from "@/data/economicReferences";
import {
  calculateLifetimeEquivalents,
  calculatePersonalFortuneComparison,
  calculatePhysicalScaleDistanceMeters,
  calculateSalaryYearsToFortune,
} from "@/lib/calculations/personalComparison";
import {
  formatCurrencyEUR,
  formatDurationYears,
  formatLargeNumber,
  formatMultiplier,
  formatPhysicalDistance,
  formatRatio,
  formatTinyPercentage,
} from "@/lib/formatters/numbers";
import { parseAmountInput } from "@/lib/formatters/parseAmount";
import { ImpactExplorer } from "@/components/ImpactExplorer";
import { ShareResultButton } from "@/components/ShareResultButton";

type PersonalFortuneComparatorProps = {
  compact?: boolean;
  showSecondaryLink?: boolean;
};

type CompareMode = "salary" | "savings";

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

function ScaleLens({
  ownAmount,
  fortune,
  sceneKey,
  ownLabel,
}: {
  ownAmount: number;
  fortune: number;
  sceneKey: string;
  ownLabel: string;
}) {
  const reduce = useReducedMotion();
  const ratio = ownAmount > 0 && fortune > 0 ? fortune / ownAmount : 0;
  const percentage = ownAmount > 0 && fortune > 0 ? (ownAmount / fortune) * 100 : 0;
  const compressedPosition =
    ownAmount > 0 && fortune > 0 ? Math.min(96, Math.max(4, (Math.log10(ownAmount) / Math.log10(fortune)) * 100)) : 0;

  return (
    <aside className="ink-panel grid gap-6 overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white/58">Part réelle</p>
          <p className="display-type mt-2 text-4xl font-medium leading-none text-white">{formatRatio(ratio)}</p>
          <p className="mt-2 text-sm text-white/58">soit {formatTinyPercentage(percentage)}</p>
        </div>
        <ChartLineUp className="shrink-0 text-[var(--accent)]" size={24} weight="bold" />
      </div>

      <div className="grid gap-5">
        <div>
          <div className="mb-2 flex items-end justify-between gap-4">
            <p className="text-xs font-semibold text-white/58">Échelle réelle</p>
            <strong className="text-xs text-white/78">presque invisible</strong>
          </div>
          <div className="relative h-9 border-b border-white/28">
            <motion.span
              key={`${sceneKey}-real`}
              aria-hidden="true"
              initial={reduce ? false : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 h-8 w-[3px] origin-bottom bg-[var(--accent)]"
            />
            <span className="absolute bottom-0 right-0 h-6 w-[3px] bg-white" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/54">
            <span>{ownLabel}</span>
            <span>fortune</span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between gap-4">
            <p className="text-xs font-semibold text-white/58">Échelle logarithmique</p>
            <strong className="text-xs text-white/78">position lisible</strong>
          </div>
          <div className="relative h-9 border-b border-white/28">
            {Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="absolute bottom-0 h-2 w-px bg-white/24"
                style={{ left: `${index * 11.111}%` }}
              />
            ))}
            <motion.span
              key={`${sceneKey}-compressed`}
              aria-label="Position de ta somme sur une échelle logarithmique"
              initial={reduce ? false : { left: "0%", opacity: 0 }}
              animate={{ left: `${compressedPosition}%`, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 h-7 w-[3px] -translate-x-1/2 bg-[var(--accent)] shadow-[0_0_0_4px_rgba(213,31,18,0.12)]"
            />
            <span className="absolute bottom-0 right-0 h-6 w-[3px] bg-white" />
          </div>
          <p className="mt-2 text-xs leading-5 text-white/54">La compression permet enfin de distinguer les deux repères.</p>
        </div>
      </div>
    </aside>
  );
}

function TimeLandmarks({ years }: { years: number }) {
  const reduce = useReducedMotion();
  const landmarks = [
    { label: "Une vie de 83 ans", value: 83 },
    { label: "Depuis l'Antiquité", value: 2_500 },
    { label: "Existence d'Homo sapiens", value: 300_000 },
    { label: "Depuis la disparition des dinosaures", value: 66_000_000 },
  ].filter((landmark) => years >= landmark.value);

  if (!landmarks.length) return null;

  return (
    <section className="border-t border-black/12 pt-7 sm:pt-9">
      <div className="flex items-start gap-3">
        <ClockCounterClockwise className="mt-0.5 shrink-0 text-[var(--accent)]" size={22} weight="bold" />
        <div>
          <p className="text-sm font-semibold text-[var(--accent-dark)]">Le temps, remis à l'échelle</p>
          <p className="mt-1 max-w-2xl text-lg leading-7 text-[var(--muted)]">Voici combien de fois le résultat contient chaque repère.</p>
        </div>
      </div>
      <ol className="relative mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-2 hidden h-px w-full origin-left bg-[var(--accent)] lg:block"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9 }}
        />
        {landmarks.map((landmark, index) => (
          <motion.li
            key={landmark.label}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="relative border-l-2 border-[var(--accent)] pl-3 lg:border-l-0 lg:pt-6"
          >
            <span aria-hidden="true" className="absolute left-[-5px] top-0 hidden h-3 w-3 rounded-full border-2 border-[var(--accent)] bg-[var(--panel)] lg:block" />
            <p className="text-sm font-semibold">{landmark.label}</p>
            <p className="display-type mt-2 text-2xl font-medium leading-none text-[var(--accent-dark)]">{formatLargeNumber(years / landmark.value)} fois</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function RealityIndicators({
  mode,
  amount,
  fortune,
  salaryYears,
}: {
  mode: CompareMode;
  amount: number;
  fortune: number;
  salaryYears: number;
}) {
  const reduce = useReducedMotion();
  const isSalary = mode === "salary";
  const yearlyAmount = amount * 12;
  const lifetimeCount = calculateLifetimeEquivalents(fortune, amount);
  const monthlySalaryCount = amount > 0 ? fortune / amount : 0;
  const savingsMultiplier = amount > 0 ? fortune / amount : 0;
  const physicalDistance = calculatePhysicalScaleDistanceMeters(isSalary ? yearlyAmount : amount, fortune);
  const percentage = amount > 0 && fortune > 0 ? (amount / fortune) * 100 : 0;
  const indicators = isSalary
    ? [
        { value: formatLargeNumber(monthlySalaryCount), label: "salaires mensuels", Icon: Briefcase, emphasis: true },
        { value: formatLargeNumber(lifetimeCount), label: "vies complètes de 83 ans", Icon: UsersThree },
        { value: formatPhysicalDistance(physicalDistance), label: "si une année mesurait 1 mm", Icon: Ruler },
      ]
    : [
        { value: formatTinyPercentage(percentage), label: "de cette fortune", Icon: ChartLineUp, emphasis: true },
        { value: formatLargeNumber(savingsMultiplier), label: "fois ton épargne", Icon: PiggyBank },
        { value: formatPhysicalDistance(physicalDistance), label: "si ton épargne mesurait 1 mm", Icon: Ruler },
      ];

  return (
    <section className="grid gap-3 border-t border-black/12 pt-7 md:grid-cols-[1.25fr_0.9fr_0.9fr]">
      {indicators.map(({ value, label, Icon, emphasis }, index) => (
        <motion.article
          key={label}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.42, delay: index * 0.07 }}
          className={`${emphasis ? "bg-[var(--foreground)] text-[var(--panel)]" : "bg-[rgba(255,250,240,0.74)]"} grid min-h-40 content-between rounded-2xl border border-black/10 p-5`}
        >
          <Icon size={23} weight="bold" className={emphasis ? "text-[var(--accent)]" : "text-[var(--accent-dark)]"} />
          <div>
            <p className="display-type mt-7 text-4xl font-medium leading-[0.9] sm:text-5xl">{value}</p>
            <p className={`mt-2 text-sm font-semibold ${emphasis ? "text-white/62" : "text-[var(--muted)]"}`}>{label}</p>
          </div>
        </motion.article>
      ))}
      {isSalary ? <span className="sr-only">Le résultat principal est {formatEpicYears(salaryYears)}.</span> : null}
    </section>
  );
}

export function PersonalFortuneComparator({ compact = false, showSecondaryLink = true }: PersonalFortuneComparatorProps) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<CompareMode>("salary");
  const [salaryInput, setSalaryInput] = useState("2000");
  const [savingsInput, setSavingsInput] = useState("10 000");
  const [selectedSlug, setSelectedSlug] = useState("elon-musk");
  const selected = billionaires.find((person) => person.slug === selectedSlug) ?? billionaires[0];

  const isSalaryMode = mode === "salary";
  const rawInput = isSalaryMode ? salaryInput : savingsInput;
  const setInput = isSalaryMode ? setSalaryInput : setSavingsInput;
  const parsed = useMemo(() => parseAmountInput(rawInput), [rawInput]);
  const activeAmount = parsed.amount ?? 0;
  const salaryMonthly = isSalaryMode ? activeAmount : economicReferences.medianNetSalaryMonthly.value;
  const savingsTotal = isSalaryMode ? 0 : activeAmount;
  const comparison = useMemo(
    () => calculatePersonalFortuneComparison({ salaryMonthly, savingsTotal, netWorthEUR: selected.netWorthEUR }),
    [salaryMonthly, savingsTotal, selected.netWorthEUR],
  );
  const salaryYears = useMemo(
    () => calculateSalaryYearsToFortune(selected.netWorthEUR, salaryMonthly),
    [salaryMonthly, selected.netWorthEUR],
  );

  const sceneKey = `${mode}-${selected.slug}`;
  const examples = isSalaryMode ? salaryExamples : savingsExamples;
  const inputLabel = isSalaryMode ? "Salaire net mensuel" : "Épargne totale";
  const inputHelp = isSalaryMode
    ? "Le calcul suppose que chaque euro est conservé."
    : "Indique l'épargne que tu veux mettre en perspective.";
  const mainResult = isSalaryMode ? formatEpicYears(salaryYears) : formatRatio(comparison.ratioDenominator);
  const mainLead = isSalaryMode ? "Il te faudrait" : "Ta somme représente";
  const mainSuffix = isSalaryMode ? "en gardant chaque euro gagné" : "de cette fortune estimée";
  const summary = isSalaryMode
    ? `Avec ${formatCurrencyEUR(salaryMonthly)} nets par mois, il faudrait environ ${formatEpicYears(salaryYears)} pour atteindre la fortune estimée de ${selected.name}, en gardant chaque euro gagné. Calculé sur L'Écart.`
    : `${formatCurrencyEUR(savingsTotal)} représente environ ${formatRatio(comparison.ratioDenominator)} de la fortune estimée de ${selected.name}. Cette fortune vaut environ ${formatMultiplier(comparison.savingsMultiplier)} ce montant. Calculé sur L'Écart.`;

  return (
    <section className={compact ? "grid gap-8" : "grid gap-10"}>
      <div className="grid gap-7 rounded-2xl border border-black/10 bg-[var(--panel)]/90 p-5 shadow-[0_18px_70px_rgba(31,24,18,0.1)] sm:p-7 lg:grid-cols-[0.8fr_1.4fr] lg:gap-10">
        <div className="grid content-start gap-3">
          <p className="text-sm font-semibold text-[var(--accent-dark)]">Ton point de départ</p>
          <h2 className="display-type max-w-[13ch] text-4xl font-medium uppercase leading-[0.94] sm:text-5xl">Choisis ce que tu veux mesurer.</h2>
          <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">Le salaire donne un temps. L'épargne donne une proportion.</p>
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-1 rounded-full border border-black/15 bg-white p-1">
            {modeOptions.map(({ value, Icon, label }) => {
              const active = mode === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={active}
                  className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {active ? (
                    <motion.span
                      layoutId="comparison-mode"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[var(--foreground)] shadow-[0_6px_20px_rgba(17,16,14,0.18)]"
                    />
                  ) : null}
                  <Icon size={17} weight="bold" className={`relative z-10 ${active ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`} />
                  <span className={`relative z-10 ${active ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`}>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">{inputLabel}</span>
              <div className="grid grid-cols-[48px_1fr] overflow-hidden rounded-xl border border-black/20 bg-white">
                <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
                <input
                  inputMode="decimal"
                  value={rawInput}
                  onChange={(event) => setInput(event.target.value)}
                  className="h-12 min-w-0 bg-white px-3 text-xl font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  aria-label={inputLabel}
                />
              </div>
              <span className={`min-h-5 text-sm ${parsed.error ? "font-medium text-[var(--accent-dark)]" : "text-[var(--muted)]"}`}>
                {parsed.error ? (
                  <span className="inline-flex items-center gap-2">
                    <WarningCircle size={16} weight="bold" />
                    {parsed.error}
                  </span>
                ) : (
                  parsed.warning ?? inputHelp
                )}
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Fortune à comparer</span>
              <div className="grid grid-cols-[48px_1fr] overflow-hidden rounded-xl border border-black/20 bg-white">
                <span className="relative h-12 overflow-hidden border-r border-black/15 bg-black">
                  <Image src={selected.imageSrc} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <select
                  value={selectedSlug}
                  onChange={(event) => setSelectedSlug(event.target.value)}
                  className="h-12 min-w-0 bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  aria-label="Fortune de référence"
                >
                  {billionaires.map((person) => (
                    <option key={person.slug} value={person.slug}>
                      {person.name} - {formatLargeNumber(person.netWorthEUR)} €
                    </option>
                  ))}
                </select>
              </div>
              <span className="min-h-5 text-sm text-[var(--muted)]">Estimation indicative, sensible aux marchés.</span>
            </label>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {examples.map(([label, value]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setInput(value)}
                  className="h-10 rounded-xl border border-black/12 bg-white/68 px-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white active:translate-y-px"
                >
                  {label}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/68 p-5 shadow-[0_24px_90px_rgba(31,24,18,0.11)] sm:p-8 lg:p-10">
        {!reduce ? (
          <motion.span
            key={sceneKey}
            aria-hidden="true"
            initial={{ x: "-115%", opacity: 0 }}
            animate={{ x: "430%", opacity: [0, 0.68, 0] }}
            transition={{ duration: 0.76, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 bg-gradient-to-r from-transparent via-[rgba(213,31,18,0.13)] to-transparent"
          />
        ) : null}

        <div className="grid gap-10 xl:grid-cols-[1fr_330px] xl:items-start">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sceneKey}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-7"
            >
              <div className="flex items-center gap-4">
                <motion.span
                  key={selected.slug}
                  initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-black sm:h-16 sm:w-16"
                >
                  <Image src={selected.imageSrc} alt={selected.imageAlt} fill sizes="64px" className="object-cover" />
                </motion.span>
                <div>
                  <p className="text-sm font-semibold text-[var(--muted)]">Fortune estimée de {selected.name}</p>
                  <p className="display-type mt-1 text-3xl font-medium leading-none text-[var(--accent)] sm:text-4xl">
                    {formatLargeNumber(selected.netWorthEUR)} €
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--accent-dark)]">{mainLead}</p>
                <h2 className="display-type mt-3 max-w-4xl text-[clamp(3.25rem,7.4vw,6.9rem)] font-medium uppercase leading-[0.9] tracking-normal">
                  {mainResult}
                </h2>
                <p className="mt-4 text-xl leading-7 text-[var(--muted)] sm:text-2xl">{mainSuffix}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <ScaleLens
            ownAmount={isSalaryMode ? salaryMonthly * 12 : savingsTotal}
            fortune={selected.netWorthEUR}
            sceneKey={sceneKey}
            ownLabel={isSalaryMode ? "une année de salaire" : "ton épargne"}
          />
        </div>

        <div className="mt-10 grid gap-8">
          <RealityIndicators
            mode={mode}
            amount={activeAmount}
            fortune={selected.netWorthEUR}
            salaryYears={salaryYears}
          />
          {isSalaryMode ? (
            <TimeLandmarks years={salaryYears} />
          ) : (
            <section className="grid gap-4 border-t border-black/12 pt-6 sm:grid-cols-[auto_1fr] sm:items-start sm:pt-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--panel)]">
                <PiggyBank size={22} weight="bold" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--accent-dark)]">En clair</p>
                <p className="mt-2 max-w-3xl text-lg leading-7 text-[var(--muted)]">
                  Il faudrait multiplier cette épargne par {formatLargeNumber(comparison.savingsMultiplier)} pour atteindre cette fortune. Sa part exacte est {formatTinyPercentage(comparison.percentage)}.
                </p>
              </div>
            </section>
          )}

          <ImpactExplorer annualGainEUR={selected.annualGainEUR} annualGainLabel={selected.annualGainLabel} ownerName={selected.name} />

          <div className="grid gap-5 border-t border-black/12 pt-6 md:grid-cols-[1fr_auto] md:items-center sm:pt-8">
            <div>
              <ShareFat className="text-[var(--accent)]" size={26} weight="bold" />
              <p className="mt-3 text-lg font-semibold">Garde ou partage ce repère.</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">Les fortunes et variations annuelles sont des estimations indicatives à actualiser. Les résultats restent des ordres de grandeur.</p>
            </div>
            <div className="grid gap-2">
              <ShareResultButton
                summary={summary}
                card={{
                  modeLabel: isSalaryMode ? "Salaire net mensuel" : "Épargne comparée",
                  amount: formatCurrencyEUR(activeAmount),
                  billionaireName: selected.name,
                  fortune: `${formatLargeNumber(selected.netWorthEUR)} €`,
                  result: mainResult,
                  resultLabel: mainSuffix,
                  imageSrc: selected.imageSrc,
                }}
              />
              {showSecondaryLink ? (
                <Link href="/comparateur" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/15 px-4 text-sm font-semibold transition hover:border-[var(--accent)] active:translate-y-px">
                  Ouvrir le comparateur
                  <ArrowRight size={16} weight="bold" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
