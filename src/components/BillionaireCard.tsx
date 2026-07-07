import Image from "next/image";
import type { Billionaire } from "@/types/economics";
import { calculatePersonalFortuneComparison } from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import {
  formatCurrencyEUR,
  formatDurationYears,
  formatLargeNumber,
  formatMultiplier,
  formatRatio,
  formatTinyPercentage,
} from "@/lib/formatters/numbers";
import { economicReferences } from "@/data/economicReferences";
import { TaxScenarioPanel } from "@/components/TaxScenarioPanel";

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
  const referenceMonthlyIncome = economicReferences.medianNetSalaryMonthly.value;
  const yearlySalary = amountToCompare > 0 ? amountToCompare * 12 : 0;
  const salaryYears = yearlySalary > 0 ? billionaire.netWorthEUR / yearlySalary : 0;
  const onePercentAnnualGain = calculateTaxScenario(
    billionaire.annualGainEUR,
    0.01,
    billionaire.annualGainLabel,
  );
  const personal = calculatePersonalFortuneComparison({
    salaryMonthly: referenceMonthlyIncome,
    savingsTotal: compareMode === "savings" ? amountToCompare : 0,
    netWorthEUR: billionaire.netWorthEUR,
  });
  const mainLabel = compareMode === "salary" ? "Temps" : "Ta somme";
  const mainValue = compareMode === "salary" ? formatDurationYears(salaryYears) : formatRatio(personal.ratioDenominator);
  const mainDetail =
    compareMode === "salary"
      ? `à ${formatLargeNumber(yearlySalary)} € nets par an`
      : `${formatTinyPercentage(personal.percentage)} exact`;

  return (
    <article className="paper-panel relative overflow-hidden rounded-none border-black/25">
      <button
        type="button"
        onClick={onSelect}
        className="grid w-full gap-4 p-4 text-left transition hover:bg-white/40 active:translate-y-px sm:grid-cols-[112px_1fr_auto] sm:items-center"
        aria-expanded={selected}
      >
        <span className="relative h-24 overflow-hidden border border-black/25 bg-black sm:h-28">
          <Image
            src={billionaire.imageSrc}
            alt={billionaire.imageAlt}
            fill
            sizes="128px"
            className="object-cover grayscale-[12%]"
            loading="eager"
          />
        </span>
        <span className="min-w-0">
          <span className="display-type block text-4xl font-medium uppercase leading-none sm:text-5xl">
            {billionaire.name}
          </span>
          <span className="mt-2 block text-sm text-[var(--muted)]">
            Donnée démo à vérifier. Variation annuelle estimée : {formatLargeNumber(billionaire.annualGainEUR)} €.
          </span>
          <span className="mt-4 grid gap-2 sm:grid-cols-3">
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                Fortune
              </span>
              <strong className="text-xl text-[var(--accent)]">{formatLargeNumber(billionaire.netWorthEUR)} €</strong>
            </span>
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                {mainLabel}
              </span>
              <strong>{mainValue}</strong>
            </span>
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                1% variation
              </span>
              <strong>{formatLargeNumber(onePercentAnnualGain.concrete.schoolsBuilt)} écoles</strong>
            </span>
          </span>
        </span>
        <span className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 bg-white px-4 text-sm font-semibold">
          {selected ? "Réduire" : "Voir le détail"}
        </span>
      </button>

      {selected ? (
        <div className="border-t border-black/10 p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              [mainLabel, mainValue, mainDetail],
              [
                compareMode === "salary" ? "100 ans de salaire" : "La fortune",
                compareMode === "salary" ? formatCurrencyEUR(yearlySalary * 100) : formatMultiplier(personal.savingsMultiplier),
                compareMode === "salary" ? "à salaire net constant" : "le montant comparé",
              ],
              [
                "1% de sa variation",
                `${formatLargeNumber(onePercentAnnualGain.concrete.childrenFedOneYear)} enfants`,
                `${formatLargeNumber(onePercentAnnualGain.concrete.localHospitalsBuilt)} hôpitaux théoriques`,
              ],
            ].map(([title, value, detail]) => (
              <div key={title} className="border border-black/12 bg-white/68 p-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {title}
                </p>
                <strong className="display-type mt-2 block text-4xl font-medium leading-none">{value}</strong>
                <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Les montants de fortune et de variation annuelle sont configurés comme données démo. Remplacer par une
            source Forbes/Bloomberg vérifiée avant publication éditoriale.
          </p>
          <div className="mt-4">
            <TaxScenarioPanel
              baseAmountEUR={billionaire.annualGainEUR}
              baseLabel={billionaire.annualGainLabel}
              ownerName={billionaire.name}
              compact
            />
          </div>
          {billionaire.sourceUrl ? (
            <a className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-dark)]" href={billionaire.sourceUrl}>
              {billionaire.sourceLabel}
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
