import Image from "next/image";
import type { Billionaire } from "@/types/economics";
import { calculatePersonalFortuneComparison } from "@/lib/calculations/personalComparison";
import { calculateConcreteEquivalents, calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatLargeNumber, formatTinyPercentage } from "@/lib/formatters/numbers";
import { economicReferences } from "@/data/economicReferences";
import { FortuneFractionPie } from "@/components/FortuneFractionPie";
import { TaxScenarioPanel } from "@/components/TaxScenarioPanel";

export function BillionaireCard({
  billionaire,
  amountToCompare,
}: {
  billionaire: Billionaire;
  amountToCompare: number;
}) {
  const referenceMonthlyIncome = economicReferences.medianNetSalaryMonthly.value;
  const concrete = calculateConcreteEquivalents(billionaire.netWorthEUR);
  const onePercentAnnualGain = calculateTaxScenario(
    billionaire.annualGainEUR,
    0.01,
    billionaire.annualGainLabel,
  );
  const personal = calculatePersonalFortuneComparison({
    salaryMonthly: referenceMonthlyIncome,
    savingsTotal: amountToCompare,
    netWorthEUR: billionaire.netWorthEUR,
  });

  return (
    <article className="paper-panel relative grid overflow-hidden rounded-none border-black/35 p-3 lg:grid-cols-[220px_1fr]">
      <div className="relative min-h-72 overflow-hidden border border-black/40 bg-black lg:min-h-full">
        <Image
          src={billionaire.imageSrc}
          alt={billionaire.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 168px"
          className="object-cover grayscale-[12%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="scale-rail absolute bottom-4 right-4 top-4 w-3 opacity-65" />
      </div>
      <div className="relative p-3 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_150px] xl:items-start">
          <div>
            <h2 className="display-type text-5xl font-bold uppercase leading-[0.9]">
              {billionaire.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Estimation variable, à mettre à jour.</p>
          </div>
          <div className="grid justify-start xl:justify-end">
            <FortuneFractionPie percentage={personal.percentage} size="sm" label="de sa fortune" />
          </div>
        </div>
        <p className="display-type mt-6 text-6xl font-bold leading-[0.88] text-[var(--accent)] md:text-7xl">
          {formatLargeNumber(billionaire.netWorthEUR)} €
        </p>
        <p className="mt-3 max-w-2xl text-sm font-semibold text-[var(--foreground)]">
          Variation annuelle estimée : {formatLargeNumber(billionaire.annualGainEUR)} €. Ce n'est pas un salaire, mais
          une variation indicative de patrimoine.
        </p>
        <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
          <div className="border-l border-black/15 pl-3">
            <span className="block font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Cette somme</span>
            <strong>{formatTinyPercentage(personal.percentage)}</strong>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">de cette fortune estimée</p>
          </div>
          <div className="border-l border-black/15 pl-3">
            <span className="block font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Revenu médian
            </span>
            <strong>{formatLargeNumber(personal.salaryYears)} ans</strong>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">référence neutre</p>
          </div>
          <div className="border-l border-black/15 pl-3">
            <span className="block font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Multiplicateur</span>
            <strong>{formatLargeNumber(personal.savingsMultiplier)} fois</strong>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">la somme comparée</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="bg-[var(--ink)] p-4 text-white">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/58">1% de son année</span>
            <strong className="display-type mt-2 block text-5xl leading-none text-white">
              {formatLargeNumber(onePercentAnnualGain.amount)} €
            </strong>
            <p className="mt-1 text-sm text-white/68">sur variation annuelle estimée</p>
          </div>
          <div className="bg-[var(--accent)] p-4 text-white">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/72">Enfants nourris 1 an</span>
            <strong className="display-type mt-2 block text-5xl leading-none">
              {formatLargeNumber(onePercentAnnualGain.concrete.childrenFedOneYear)}
            </strong>
            <p className="mt-1 text-sm text-white/75">1 repas/jour à 2 €</p>
          </div>
          <div className="border border-black/15 bg-white p-4">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Écoles théoriques</span>
            <strong className="display-type mt-2 block text-5xl leading-none">
              {formatLargeNumber(onePercentAnnualGain.concrete.schoolsBuilt)}
            </strong>
            <p className="mt-1 text-sm text-[var(--muted)]">sur 1% du gain annuel estimé</p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          Sur la fortune totale, cela représenterait aussi {formatLargeNumber(concrete.childrenFedOneYear)} enfants
          nourris pendant un an avec l'hypothèse simple d'un repas par jour à 2 €. C'est un équivalent budgétaire, pas
          une solution automatique.
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
          Dernière mise à jour indicative : {billionaire.lastUpdated}
        </p>
        {billionaire.sourceUrl ? (
          <a className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-dark)]" href={billionaire.sourceUrl}>
            {billionaire.sourceLabel}
          </a>
        ) : null}
        <div className="mt-5">
          <TaxScenarioPanel
            baseAmountEUR={billionaire.annualGainEUR}
            baseLabel={billionaire.annualGainLabel}
            ownerName={billionaire.name}
            compact
          />
        </div>
      </div>
    </article>
  );
}
