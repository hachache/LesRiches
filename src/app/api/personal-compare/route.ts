import { NextResponse } from "next/server";
import { billionaires } from "@/data/billionaires";
import { economicReferences } from "@/data/economicReferences";
import { calculatePersonalFortuneComparison } from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import {
  formatCurrencyEUR,
  formatLargeNumber,
  formatMultiplier,
  formatRatio,
  formatTinyPercentage,
} from "@/lib/formatters/numbers";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const amountParam = url.searchParams.get("amount") ?? url.searchParams.get("savings") ?? "";
  const parsed = parseAmountInput(amountParam);
  const billionaireSlug = url.searchParams.get("billionaire") ?? "";
  const billionaire = billionaires.find((person) => person.slug === billionaireSlug);

  if (!parsed.amount || !billionaire) {
    return NextResponse.json(
      {
        error:
          "Paramètres invalides. Utilisez amount et billionaire avec un slug connu, par exemple /api/personal-compare?amount=1%20million&billionaire=elon-musk.",
      },
      { status: 400 },
    );
  }

  const comparison = calculatePersonalFortuneComparison({
    salaryMonthly: economicReferences.medianNetSalaryMonthly.value,
    savingsTotal: parsed.amount,
    netWorthEUR: billionaire.netWorthEUR,
  });
  const annualVariationOnePercent = calculateTaxScenario(
    billionaire.annualGainEUR,
    0.01,
    billionaire.annualGainLabel,
  );

  return NextResponse.json({
    amount: {
      value: parsed.amount,
      formatted: formatCurrencyEUR(parsed.amount),
      warning: parsed.warning,
    },
    billionaire: {
      slug: billionaire.slug,
      name: billionaire.name,
      netWorthEUR: billionaire.netWorthEUR,
      formattedNetWorth: formatCurrencyEUR(billionaire.netWorthEUR),
      dataQuality: billionaire.dataQuality ?? "demo",
      sourceLabel: billionaire.sourceLabel,
      sourceUrl: billionaire.sourceUrl,
      lastUpdated: billionaire.lastUpdated,
    },
    ratio: {
      denominator: comparison.ratioDenominator,
      formatted: formatRatio(comparison.ratioDenominator),
    },
    percentage: {
      value: comparison.percentage,
      formatted: formatTinyPercentage(comparison.percentage),
    },
    multiplier: {
      value: comparison.savingsMultiplier,
      formatted: formatMultiplier(comparison.savingsMultiplier),
    },
    annualVariationOnePercent: {
      base: "annualVariationEstimate",
      baseAmountEUR: billionaire.annualGainEUR,
      formattedBaseAmount: formatCurrencyEUR(billionaire.annualGainEUR),
      amountEUR: annualVariationOnePercent.amount,
      formattedAmount: formatCurrencyEUR(annualVariationOnePercent.amount),
    },
    concreteEquivalents: {
      childrenFedOneYear: annualVariationOnePercent.concrete.childrenFedOneYear,
      schoolsBuilt: annualVariationOnePercent.concrete.schoolsBuilt,
      localHospitalsBuilt: annualVariationOnePercent.concrete.localHospitalsBuilt,
      formatted: {
        childrenFedOneYear: formatLargeNumber(annualVariationOnePercent.concrete.childrenFedOneYear),
        schoolsBuilt: formatLargeNumber(annualVariationOnePercent.concrete.schoolsBuilt),
        localHospitalsBuilt: formatLargeNumber(annualVariationOnePercent.concrete.localHospitalsBuilt),
      },
    },
    generatedAt: new Date().toISOString(),
    assumptions: {
      comparisonInput: "singleAmount",
      taxScenarioBase: "annualVariationEstimate",
      taxScenarioBaseNote: billionaire.annualGainNote,
      childFedOneYearEUR: economicReferences.childFedOneYear.value,
      schoolConstructionCostEUR: economicReferences.schoolConstructionCost.value,
      localHospitalConstructionCostEUR: economicReferences.localHospitalConstructionCost.value,
      note:
        "Les équivalents sont des ordres de grandeur budgétaires théoriques. Ils ne constituent pas une promesse de résultat.",
    },
  });
}
