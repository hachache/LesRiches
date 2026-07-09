"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ForkKnife, GraduationCap, Hospital, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatLargeNumber } from "@/lib/formatters/numbers";

type Focus = "nourrir" | "eduquer" | "soigner";

type ImpactExplorerProps = {
  annualGainEUR: number;
  annualGainLabel: string;
  ownerName: string;
};

type ImpactOption = {
  id: Focus;
  label: string;
  title: string;
  description: string;
  Icon: Icon;
  value: (scenario: ReturnType<typeof calculateTaxScenario>) => number;
  suffix: string;
};

const impactOptions: ImpactOption[] = [
  {
    id: "nourrir",
    label: "Nourrir",
    title: "Enfants nourris pendant un an",
    description: "Un repas par jour à 2 euros. C'est un repère budgétaire, pas une promesse de résultat.",
    Icon: ForkKnife,
    value: (scenario) => scenario.concrete.childrenFedOneYear,
    suffix: "enfants",
  },
  {
    id: "eduquer",
    label: "Éduquer",
    title: "Écoles construites théoriquement",
    description: "Le coût réel dépend du foncier, du territoire et du programme de construction.",
    Icon: GraduationCap,
    value: (scenario) => scenario.concrete.schoolsBuilt,
    suffix: "écoles",
  },
  {
    id: "soigner",
    label: "Soigner",
    title: "Hôpitaux locaux théoriques",
    description: "La construction seulement. Les équipes et le fonctionnement ne sont pas inclus.",
    Icon: Hospital,
    value: (scenario) => scenario.concrete.localHospitalsBuilt,
    suffix: "hôpitaux",
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
    <details className="group overflow-hidden rounded-2xl border border-black/10 bg-white/52">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 sm:px-6 sm:py-5">
        <span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
            Une lecture supplémentaire
          </span>
          <span className="mt-1 block text-lg font-semibold sm:text-xl">Voir ce que 1% d'une année représenterait</span>
        </span>
        <span className="inline-flex h-10 shrink-0 items-center rounded-full border border-black/15 px-4 text-sm font-semibold transition group-open:bg-[var(--foreground)] group-open:text-[var(--panel)]">
          <span className="group-open:hidden">Ouvrir</span>
          <span className="hidden group-open:inline">Fermer</span>
        </span>
      </summary>

      <div className="grid border-t border-black/10 lg:grid-cols-[0.72fr_1fr]">
        <div className="relative min-h-64 overflow-hidden border-b border-black/10 lg:min-h-full lg:border-b-0 lg:border-r">
          <Image
            src="/assets/editorial/impact-ledger-v2.png"
            alt="Collage éditorial évoquant une balance, une école, un hôpital et l'aide alimentaire"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 text-sm leading-6 text-white/90 sm:bottom-6 sm:left-6">
            Simulation ponctuelle sur 1% de la variation annuelle estimée de {ownerName}.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-1 rounded-full border border-black/12 bg-white p-1">
            {impactOptions.map((option) => {
              const isActive = option.id === focus;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFocus(option.id)}
                  aria-pressed={isActive}
                  className="relative h-10 rounded-full text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="impact-focus"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                    />
                  ) : null}
                  <span className={`relative z-10 ${isActive ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={focus}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <Icon size={22} weight="bold" />
                </span>
                <p className="text-sm font-semibold text-[var(--muted)]">1% = {formatCurrencyEUR(scenario.amount)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
                  {active.title}
                </p>
                <p className="display-type mt-2 text-6xl font-medium leading-[0.9] sm:text-7xl">
                  {formatLargeNumber(active.value(scenario))}
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">{active.suffix}</p>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">{active.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </details>
  );
}
