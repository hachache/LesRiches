"use client";

import { useMemo } from "react";
import { economicReferences } from "@/data/economicReferences";
import { compareAmount } from "@/lib/calculations/compare";
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

  const summary = `${formatCurrencyEUR(amount)} représente environ ${formatLargeNumber(
    result.smic.years,
  )} années de SMIC net, ${formatLargeNumber(result.workingLives.bySmic)} carrières complètes et ${formatLargeNumber(
    result.wealth.medianWealthMultiplier,
  )} fois le patrimoine médian français. Calculé sur combien-de-smic.fr`;

  return (
    <section className="mobile-safe-panel grid gap-6">
      <div className="paper-panel relative grid gap-5 overflow-hidden rounded-none border-black/25 p-6 md:p-8">
        <ImpactSentence
          amount={amount}
          smicYears={result.smic.years}
          workingLives={result.workingLives.bySmic}
          wealthMultiplier={result.wealth.medianWealthMultiplier}
        />
        <div className="flex flex-wrap gap-2">
          <AssumptionBadge>Carrière complète moyenne</AssumptionBadge>
          <AssumptionBadge>{Math.round(savingsRate * 100)} % d'épargne</AssumptionBadge>
          <AssumptionBadge>SMIC net {formatCurrencyEUR(economicReferences.smicNetMonthly.value)}/mois</AssumptionBadge>
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
          title="Vie de travail"
          value={result.workingLives.bySmic}
          unit="carrières"
          tone="dark"
          sentence={`Base : carrière complète moyenne et ${Math.round(
            savingsRate * 100,
          )} % du revenu conservé, sans dépense.`}
        />
        <ComparisonCard
          title="Vie quotidienne"
          value={result.dailyLife.averageRentMonths}
          unit="loyers"
          sentence={`${formatLargeNumber(result.dailyLife.rsaMonths)} mois de RSA, ${formatLargeNumber(
            result.dailyLife.groceryBaskets,
          )} paniers alimentaires, ${formatLargeNumber(result.dailyLife.foodAidMeals)} repas solidaires théoriques.`}
        />
        <ComparisonCard
          title="Patrimoine"
          value={result.wealth.medianWealthMultiplier}
          unit="patrimoines médians"
          sentence={`${formatLargeNumber(result.wealth.averageWealthMultiplier)} patrimoines moyens, ${formatLargeNumber(
            result.wealth.apartments,
          )} appartements moyens ou ${formatLargeNumber(result.wealth.homes)} maisons moyennes.`}
        />
        <ComparisonCard
          title="Timeline"
          value={Math.abs(result.timeline.smicStartYear)}
          unit={result.timeline.smicStartYear <= 0 ? "avant notre ère" : "année"}
          sentence={`Au SMIC net, il aurait fallu commencer ${formatStartYear(
            result.timeline.smicStartYear,
          )}, sans jamais rien dépenser.`}
        />
      </div>
    </section>
  );
}
