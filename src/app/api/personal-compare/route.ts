import { NextResponse } from "next/server";
import { billionaires } from "@/data/billionaires";
import { economicReferences } from "@/data/economicReferences";
import { calculatePersonalFortuneComparison } from "@/lib/calculations/personalComparison";
import { formatCurrencyEUR, formatLargeNumber, formatTinyPercentage } from "@/lib/formatters/numbers";

function readPositiveNumber(value: string | null): number {
  if (!value) return 0;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const salaryMonthly = readPositiveNumber(url.searchParams.get("salary"));
  const savingsTotal = readPositiveNumber(url.searchParams.get("savings"));
  const billionaireSlug = url.searchParams.get("billionaire") ?? "";
  const billionaire = billionaires.find((person) => person.slug === billionaireSlug);

  if (!salaryMonthly || !savingsTotal || !billionaire) {
    return NextResponse.json(
      {
        error:
          "Parametres invalides. Utilisez salary, savings et billionaire avec un slug connu, par exemple elon-musk.",
      },
      { status: 400 },
    );
  }

  const comparison = calculatePersonalFortuneComparison({
    salaryMonthly,
    savingsTotal,
    netWorthEUR: billionaire.netWorthEUR,
  });

  return NextResponse.json({
    input: {
      salaryMonthly,
      savingsTotal,
      billionaire: billionaire.slug,
    },
    billionaire: {
      slug: billionaire.slug,
      name: billionaire.name,
      netWorthEUR: billionaire.netWorthEUR,
      formattedNetWorth: formatCurrencyEUR(billionaire.netWorthEUR),
      sourceLabel: billionaire.sourceLabel,
      sourceUrl: billionaire.sourceUrl,
      lastUpdated: billionaire.lastUpdated,
    },
    comparison: {
      ...comparison,
      formatted: {
        percentage: formatTinyPercentage(comparison.percentage),
        salaryYears: formatLargeNumber(comparison.salaryYears),
        careersAt20PercentSavings: formatLargeNumber(comparison.careersAt20PercentSavings),
        medianWealthMultiplier: formatLargeNumber(comparison.medianWealthMultiplier),
        foodAidMeals: formatLargeNumber(comparison.foodAidMeals),
        groceryBaskets: formatLargeNumber(comparison.groceryBaskets),
      },
    },
    generatedAt: new Date().toISOString(),
    assumptions: {
      defaultSavingsRate: economicReferences.defaultSavingsRate.value,
      careerYears: 42,
      foodAidMealEUR: economicReferences.foodAidMeal.value,
      note:
        "Les repas et paniers sont des equivalences budgetaires theoriques. Ils ne constituent pas une promesse de politique publique.",
    },
  });
}
