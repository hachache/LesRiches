"use client";

import { useMemo } from "react";
import { economicReferences } from "@/data/economicReferences";
import { compareAmount } from "@/lib/calculations/compare";
import { calculateConcreteEquivalents } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatLargeNumber, formatStartYear } from "@/lib/formatters/numbers";
import { ComparisonCard } from "@/components/ComparisonCard";
import { ImpactSentence } from "@/components/ImpactSentence";
import { ShareResultButton } from "@/components/ShareResultButton";
import { AssumptionBadge } from "@/components/AssumptionBadge";

type ResultGridProps = {
  amount: number;
  customMonthlyIncome?: number;
  careerYears: number;
  savingsRate: number;
};

export function ResultGrid({ amount, customMonthlyIncome, careerYears, savingsRate }: ResultGridProps) {
  const result = useMemo(
    () => compareAmount({ amount, customMonthlyIncome, careerYears, savingsRate }),
    [amount, careerYears, customMonthlyIncome, savingsRate],
  );
  const concrete = useMemo(() => calculateConcreteEquivalents(amount), [amount]);

  const summary = `${formatCurrencyEUR(amount)} représente environ ${formatLargeNumber(
    result.smic.years,
  )} années de revenu minimum, ${formatLargeNumber(result.dailyLife.foodAidMeals)} repas solidaires théoriques et ${formatLargeNumber(
    concrete.schoolsBuilt,
  )} écoles construites théoriques. Calculé sur L'Écart.`;

  return (
    <section className="mobile-safe-panel grid gap-6">
      <div className="paper-panel relative grid gap-5 overflow-hidden rounded-none border-black/25 p-6 md:p-8">
        <ImpactSentence
          amount={amount}
          smicYears={result.smic.years}
          foodAidMeals={result.dailyLife.foodAidMeals}
          schoolsBuilt={concrete.schoolsBuilt}
        />
        <div className="flex flex-wrap gap-2">
          <AssumptionBadge>Revenu minimum {formatCurrencyEUR(economicReferences.smicNetMonthly.value)}/mois</AssumptionBadge>
          <AssumptionBadge>Repas solidaire 2 €</AssumptionBadge>
          <AssumptionBadge>École théorique 12 millions €</AssumptionBadge>
        </div>
        <ShareResultButton summary={summary} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ComparisonCard
          title="Salaire médian"
          value={result.medianSalary.years}
          unit="années"
          tone="accent"
          sentence={`Même au salaire médian, cela représente ${formatLargeNumber(
            result.medianSalary.months,
          )} mois de revenu net.`}
        />
        <ComparisonCard
          title="Repas solidaires"
          value={result.dailyLife.foodAidMeals}
          unit="repas"
          tone="dark"
          sentence="Repère budgétaire simple : 2 € par repas théorique."
        />
        <ComparisonCard
          title="Paniers alimentaires"
          value={result.dailyLife.groceryBaskets}
          unit="paniers"
          sentence="Un repère volontairement simple pour sentir l'échelle au quotidien."
        />
        <ComparisonCard
          title="Écoles"
          value={concrete.schoolsBuilt}
          unit="écoles"
          sentence="Équivalent budgétaire théorique, pas une promesse de construction réelle."
        />
        <ComparisonCard
          title="Hôpitaux locaux"
          value={concrete.localHospitalsBuilt}
          unit="hôpitaux"
          sentence="Repère théorique pour comprendre l'ordre de grandeur."
        />
        <ComparisonCard
          title="Timeline"
          value={Math.abs(result.timeline.smicStartYear)}
          unit={result.timeline.smicStartYear <= 0 ? "avant notre ère" : "année"}
          sentence={`Au revenu minimum, il aurait fallu commencer ${formatStartYear(
            result.timeline.smicStartYear,
          )}, sans jamais rien dépenser.`}
        />
      </div>
    </section>
  );
}
