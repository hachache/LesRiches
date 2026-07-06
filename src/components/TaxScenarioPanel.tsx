"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BowlFood, FirstAidKit, GlobeHemisphereWest, GraduationCap, Scales } from "@phosphor-icons/react";
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
    [BowlFood, "Enfants nourris 1 an", formatLargeNumber(scenario.concrete.childrenFedOneYear), "1 repas/jour à 2 €"],
    [GraduationCap, "Écoles construites", formatLargeNumber(scenario.concrete.schoolsBuilt), "ordre de grandeur"],
    [FirstAidKit, "Hôpitaux locaux", formatLargeNumber(scenario.concrete.localHospitalsBuilt), "repère théorique"],
    [
      GlobeHemisphereWest,
      "Budget faim mondiale",
      formatTinyPercentage(scenario.concrete.globalHungerFundingShare * 100),
      "part d'un besoin annuel",
    ],
  ] as const;

  return (
    <section
      className={`overflow-hidden rounded-none border-black/30 ${
        compact ? "border bg-white/58 p-4" : "paper-panel p-5 sm:p-7"
      }`}
    >
      <div className={compact ? "grid gap-4" : "grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch"}>
        <div className="grid gap-5">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
              Sur le gain annuel estimé
            </p>
            <h3 className="display-type mt-3 text-4xl font-semibold uppercase leading-[0.95] sm:text-5xl">
              {formatTinyPercentage(rate * 100)} de son année ferait ça.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Simulation théorique ponctuelle sur la {baseLabel.toLowerCase()} de {ownerName}. Ce n'est pas sa fortune
              totale et ce n'est pas un salaire : c'est une variation de patrimoine estimée.
            </p>
          </div>

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
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="border-l-4 border-[var(--accent)] pl-4"
          >
            <p className="text-sm font-semibold text-[var(--muted)]">Montant théorique</p>
            <strong className="display-type block text-5xl font-semibold leading-none text-[var(--accent)] sm:text-6xl">
              {formatCurrencyEUR(scenario.amount)}
            </strong>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              Base comparée : {formatCurrencyEUR(scenario.baseAmount)} sur un an.
            </p>
          </motion.div>
        </div>

        {!compact ? (
          <div className="relative min-h-56 overflow-hidden border border-black/20 bg-black">
            <Image
              src="/assets/editorial/tax-ledger.png"
              alt="Illustration éditoriale d'un registre fiscal et de piles de pièces"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        ) : null}
      </div>

      <motion.div
        key={`${rate}-cards`}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map(([Icon, title, value, text]) => (
          <article key={title} className="border border-black/15 bg-white/72 p-4">
            <Icon size={22} weight="bold" className="text-[var(--accent-dark)]" />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{title}</p>
            <strong className="display-type mt-2 block text-4xl font-semibold leading-none">{value}</strong>
            <p className="mt-2 text-sm leading-5 text-[var(--muted)]">{text}</p>
          </article>
        ))}
      </motion.div>

      <p className="mt-4 flex gap-2 text-xs leading-5 text-[var(--muted)]">
        <Scales size={18} weight="bold" className="mt-0.5 shrink-0 text-[var(--accent-dark)]" />
        Les comparaisons montrent des ordres de grandeur. Elles ne modélisent ni l'assiette fiscale réelle, ni les
        comportements de marché, ni les coûts administratifs. Écoles, hôpitaux et faim mondiale sont des équivalents
        budgétaires théoriques, pas des effets garantis.
      </p>
    </section>
  );
}
