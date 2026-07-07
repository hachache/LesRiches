"use client";

import { useMemo, useState } from "react";
import { Buildings, ForkKnife, Hospital, Scales } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { calculateTaxScenario, taxScenarioRates } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatLargeNumber, formatTinyPercentage } from "@/lib/formatters/numbers";

type TaxScenarioPanelProps = {
  baseAmountEUR: number;
  baseLabel: string;
  ownerName: string;
  compact?: boolean;
};

export function TaxScenarioPanel({ baseAmountEUR, baseLabel, ownerName, compact = false }: TaxScenarioPanelProps) {
  const [rate, setRate] = useState<number>(0.01);
  const reduce = useReducedMotion();
  const scenario = useMemo(
    () => calculateTaxScenario(baseAmountEUR, rate, baseLabel),
    [baseAmountEUR, baseLabel, rate],
  );

  const cards = [
    [ForkKnife, "Enfants nourris 1 an", formatLargeNumber(scenario.concrete.childrenFedOneYear), "1 repas/jour à 2 €"],
    [Buildings, "Écoles théoriques", formatLargeNumber(scenario.concrete.schoolsBuilt), "ordre de grandeur"],
    [Hospital, "Hôpitaux locaux", formatLargeNumber(scenario.concrete.localHospitalsBuilt), "construction théorique"],
  ] as const;

  return (
    <section className={compact ? "border border-black/12 bg-white/58 p-4" : "paper-panel p-5 sm:p-7"}>
      <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
            Simulation sur variation annuelle
          </p>
          <h3 className="display-type mt-3 text-4xl font-medium uppercase leading-[1] sm:text-5xl">
            {formatTinyPercentage(rate * 100)} ferait combien ?
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Simulation théorique ponctuelle sur la {baseLabel.toLowerCase()} de {ownerName}. Ce n'est pas sa fortune
            totale et ce n'est pas un salaire.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-4 gap-1 rounded-full border border-black/15 bg-white p-1">
            {taxScenarioRates.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => setRate(candidate)}
                className={`h-10 rounded-full text-sm font-bold transition active:translate-y-px ${
                  rate === candidate ? "bg-[var(--foreground)] text-[var(--panel)]" : "hover:bg-black/5"
                }`}
              >
                {formatTinyPercentage(candidate * 100).replace(" %", "%")}
              </button>
            ))}
          </div>

          <motion.div
            key={scenario.amount}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-l-4 border-[var(--accent)] pl-4"
          >
            <p className="text-sm font-semibold text-[var(--muted)]">Montant théorique</p>
            <strong className="display-type block text-5xl font-medium leading-none text-[var(--accent)] sm:text-6xl">
              {formatCurrencyEUR(scenario.amount)}
            </strong>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              Base annuelle estimée : {formatCurrencyEUR(scenario.baseAmount)}.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        key={`${rate}-cards`}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-5 grid gap-3 sm:grid-cols-3"
      >
        {cards.map(([Icon, title, value, text]) => (
          <article key={title} className="border border-black/12 bg-white/72 p-4">
            <Icon size={22} weight="bold" className="text-[var(--accent-dark)]" />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{title}</p>
            <strong className="display-type mt-2 block text-4xl font-medium leading-none">{value}</strong>
            <p className="mt-2 text-sm leading-5 text-[var(--muted)]">{text}</p>
          </article>
        ))}
      </motion.div>

      <p className="mt-4 flex gap-2 text-xs leading-5 text-[var(--muted)]">
        <Scales size={18} weight="bold" className="mt-0.5 shrink-0 text-[var(--accent-dark)]" />
        Ces équivalents ne modélisent ni l'assiette fiscale réelle, ni la liquidité des actifs, ni les coûts de
        fonctionnement. Ils servent uniquement à rendre l'ordre de grandeur lisible.
      </p>
    </section>
  );
}
