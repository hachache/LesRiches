import Image from "next/image";
import type { Billionaire } from "@/types/economics";
import { calculateWorkingLives, calculateYearsOfIncome, compareAmount } from "@/lib/calculations/compare";
import { economicReferences } from "@/data/economicReferences";
import { formatLargeNumber } from "@/lib/formatters/numbers";

export function BillionaireCard({ billionaire, monthlySalary }: { billionaire: Billionaire; monthlySalary: number }) {
  const result = compareAmount({ amount: billionaire.netWorthEUR });
  const personalSalaryYears = calculateYearsOfIncome(billionaire.netWorthEUR, monthlySalary);
  const personalLivesAtSavings = calculateWorkingLives(billionaire.netWorthEUR, monthlySalary, 42, 0.2);

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="display-type text-5xl font-bold uppercase leading-[0.9]">
              {billionaire.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Estimation variable, à mettre à jour.</p>
          </div>
          <p className="text-right font-mono text-sm text-[var(--accent-dark)]">{billionaire.lastUpdated}</p>
        </div>
        <p className="display-type mt-6 text-6xl font-bold leading-[0.88] text-[var(--accent)] md:text-7xl">
          {formatLargeNumber(billionaire.netWorthEUR)} €
        </p>
        <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
          <div className="border-l border-black/15 pl-3">
            <span className="block font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Ton salaire</span>
            <strong>{formatLargeNumber(personalSalaryYears)} ans</strong>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">à salaire net constant, sans rien dépenser</p>
          </div>
          <div className="border-l border-black/15 pl-3">
            <span className="block font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">20% d'épargne</span>
            <strong>{formatLargeNumber(personalLivesAtSavings)} carrières</strong>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">carrière de 42 ans</p>
          </div>
          <div className="border-l border-black/15 pl-3">
            <span className="block font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Patrimoines</span>
            <strong>{formatLargeNumber(result.wealth.medianWealthMultiplier)}</strong>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">fois le patrimoine médian net</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="bg-[var(--ink)] p-4 text-white">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/58">SMIC net</span>
            <strong className="display-type mt-2 block text-5xl leading-none text-white">
              {formatLargeNumber(result.smic.years)}
            </strong>
            <p className="mt-1 text-sm text-white/68">années</p>
          </div>
          <div className="bg-[var(--accent)] p-4 text-white">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/72">Repas solidaires</span>
            <strong className="display-type mt-2 block text-5xl leading-none">
              {formatLargeNumber(result.dailyLife.foodAidMeals)}
            </strong>
            <p className="mt-1 text-sm text-white/75">à {economicReferences.foodAidMeal.value} € / repas</p>
          </div>
          <div className="border border-black/15 bg-white p-4">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Paniers alimentaires</span>
            <strong className="display-type mt-2 block text-5xl leading-none">
              {formatLargeNumber(result.dailyLife.groceryBaskets)}
            </strong>
            <p className="mt-1 text-sm text-[var(--muted)]">repère alimentaire hebdomadaire</p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          Ces équivalences ne disent pas qu'une fortune pourrait mécaniquement résoudre la faim. Elles donnent un
          ordre de grandeur budgétaire, avec des hypothèses visibles.
        </p>
        {billionaire.sourceUrl ? (
          <a className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-dark)]" href={billionaire.sourceUrl}>
            {billionaire.sourceLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
