"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Drop, ForkKnife, GraduationCap, Hospital, HouseLine, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatDecimal, formatLargeNumber } from "@/lib/formatters/numbers";

type Focus = "nourrir" | "eduquer" | "soigner" | "loger" | "eau";

type ImpactExplorerProps = {
  annualGainEUR: number;
  annualGainLabel: string;
  ownerName: string;
};

type Scenario = ReturnType<typeof calculateTaxScenario>;

type ImpactOption = {
  id: Focus;
  label: string;
  title: string;
  description: string;
  Icon: Icon;
  value: (scenario: Scenario) => number;
  suffix: string;
  secondary?: (scenario: Scenario) => string;
};

function formatImpactValue(value: number): string {
  return value < 10 ? formatDecimal(value, 1) : formatLargeNumber(value);
}

const impactOptions: ImpactOption[] = [
  {
    id: "nourrir",
    label: "Nourrir",
    title: "Enfants nourris pendant un an",
    description: "Un repas par jour à 2 euros. Ce repère ne couvre ni la logistique ni l'ensemble des besoins nutritionnels.",
    Icon: ForkKnife,
    value: (scenario) => scenario.concrete.childrenFedOneYear,
    suffix: "enfants",
    secondary: (scenario) => `${formatLargeNumber(scenario.concrete.foodAidMeals)} repas théoriques`,
  },
  {
    id: "eduquer",
    label: "Éduquer",
    title: "Écoles construites théoriquement",
    description: "Le coût réel varie selon le foncier, le territoire, la taille et le programme de construction.",
    Icon: GraduationCap,
    value: (scenario) => scenario.concrete.schoolsBuilt,
    suffix: "écoles",
    secondary: (scenario) => `${formatLargeNumber(scenario.concrete.educationStudentYears)} années de scolarité`,
  },
  {
    id: "soigner",
    label: "Soigner",
    title: "Hôpitaux locaux construits théoriquement",
    description: "La construction seulement. Les équipes, les équipements et le fonctionnement ne sont pas inclus.",
    Icon: Hospital,
    value: (scenario) => scenario.concrete.localHospitalsBuilt,
    suffix: "hôpitaux",
  },
  {
    id: "loger",
    label: "Loger",
    title: "Logements sociaux financés théoriquement",
    description: "Hypothèse de coût unitaire. Le foncier et le montage financier peuvent fortement changer le résultat.",
    Icon: HouseLine,
    value: (scenario) => scenario.concrete.socialHousingUnits,
    suffix: "logements",
    secondary: (scenario) => `${formatLargeNumber(scenario.concrete.averageRentYears)} années de loyer moyen`,
  },
  {
    id: "eau",
    label: "Eau",
    title: "Points d'eau potable financés théoriquement",
    description: "Le coût dépend du pays, du terrain, de la profondeur, de la maintenance et de la gouvernance locale.",
    Icon: Drop,
    value: (scenario) => scenario.concrete.waterWells,
    suffix: "points d'eau",
  },
];

export function ImpactExplorer({ annualGainEUR, annualGainLabel, ownerName }: ImpactExplorerProps) {
  const [focus, setFocus] = useState<Focus>("nourrir");
  const reduce = useReducedMotion();
  const scenario = useMemo(
    () => calculateTaxScenario(annualGainEUR, 0.01, annualGainLabel),
    [annualGainEUR, annualGainLabel],
  );
  const active = impactOptions.find((option) => option.id === focus) ?? impactOptions[0];
  const Icon = active.Icon;

  return (
    <details className="group overflow-hidden rounded-2xl border border-black/10 bg-[rgba(255,250,240,0.7)] shadow-[0_18px_70px_rgba(31,24,18,0.08)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 transition-colors hover:bg-white/45 sm:px-7 sm:py-6">
        <span>
          <span className="block text-sm font-semibold text-[var(--accent-dark)]">Un autre ordre de grandeur</span>
          <span className="mt-1 block text-lg font-semibold sm:text-2xl">Ce que représenterait 1% de sa variation annuelle</span>
        </span>
        <span className="inline-flex h-10 shrink-0 items-center rounded-full border border-black/15 px-4 text-sm font-semibold transition group-open:bg-[var(--foreground)] group-open:text-[var(--panel)]">
          <span className="group-open:hidden">Voir</span>
          <span className="hidden group-open:inline">Fermer</span>
        </span>
      </summary>

      <div className="grid border-t border-black/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72 overflow-hidden border-b border-black/10 lg:min-h-[560px] lg:border-b-0 lg:border-r">
          <Image
            src="/assets/editorial/civic-scale-v3.png"
            alt="Collage éditorial montrant une école, un hôpital, des logements, de l'aide alimentaire et un point d'eau"
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/4 to-transparent" />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-[var(--accent)]"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            style={{ transformOrigin: "bottom" }}
          />
          <p className="absolute bottom-5 left-5 right-5 max-w-md text-sm leading-6 text-white sm:bottom-7 sm:left-7">
            Simulation ponctuelle sur 1% de la variation annuelle estimée de {ownerName}. Ce n'est pas un revenu disponible.
          </p>
        </div>

        <div className="grid content-between gap-7 p-5 sm:p-7">
          <div className="grid grid-cols-5 gap-1 rounded-full border border-black/12 bg-white p-1">
            {impactOptions.map((option) => {
              const isActive = option.id === focus;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFocus(option.id)}
                  aria-pressed={isActive}
                  className="relative inline-flex h-11 min-w-0 items-center justify-center rounded-full px-1 text-[10px] font-bold sm:text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="impact-focus"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                    />
                  ) : null}
                  <span className={`relative z-10 truncate ${isActive ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`}>{option.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={focus}
              initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -14, filter: "blur(5px)" }}
              transition={{ duration: 0.4 }}
              className="grid gap-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_10px_32px_rgba(213,31,18,0.24)]">
                  <Icon size={24} weight="bold" />
                </span>
                <p className="text-right text-sm font-semibold text-[var(--muted)]">1% = {formatCurrencyEUR(scenario.amount)}</p>
              </div>
              <div aria-live="polite">
                <p className="text-sm font-semibold text-[var(--accent-dark)]">{active.title}</p>
                <p className="display-type mt-3 text-[clamp(4rem,9vw,7.2rem)] font-medium leading-[0.82]">
                  {formatImpactValue(active.value(scenario))}
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{active.suffix}</p>
              </div>
              {active.secondary ? (
                <p className="border-l-2 border-[var(--accent)] pl-4 text-lg font-semibold">Soit aussi {active.secondary(scenario)}.</p>
              ) : null}
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">{active.description}</p>
            </motion.div>
          </AnimatePresence>

          <p className="border-t border-black/10 pt-4 text-xs leading-5 text-[var(--muted)]">
            Les coûts sont des hypothèses pédagogiques centralisées. Consulte la méthodologie avant toute réutilisation.
          </p>
        </div>
      </div>
    </details>
  );
}
