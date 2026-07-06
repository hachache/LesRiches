import { NextResponse } from "next/server";
import { billionaires } from "@/data/billionaires";
import { economicReferences } from "@/data/economicReferences";
import { calculatePersonalFortuneComparison } from "@/lib/calculations/personalComparison";
import { calculateDefaultTaxScenarios } from "@/lib/calculations/taxScenarios";
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
  const taxScenarios = calculateDefaultTaxScenarios(billionaire.annualGainEUR, billionaire.annualGainLabel);

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
      annualGainEUR: billionaire.annualGainEUR,
      formattedAnnualGain: formatCurrencyEUR(billionaire.annualGainEUR),
      annualGainLabel: billionaire.annualGainLabel,
      annualGainNote: billionaire.annualGainNote,
      sourceLabel: billionaire.sourceLabel,
      sourceUrl: billionaire.sourceUrl,
      lastUpdated: billionaire.lastUpdated,
    },
    comparison: {
      ...comparison,
      formatted: {
        percentage: formatTinyPercentage(comparison.percentage),
        savingsMultiplier: formatLargeNumber(comparison.savingsMultiplier),
        salaryYears: formatLargeNumber(comparison.salaryYears),
        careersAt20PercentSavings: formatLargeNumber(comparison.careersAt20PercentSavings),
        medianWealthMultiplier: formatLargeNumber(comparison.medianWealthMultiplier),
        foodAidMeals: formatLargeNumber(comparison.foodAidMeals),
        groceryBaskets: formatLargeNumber(comparison.groceryBaskets),
      },
    },
    taxScenarios: taxScenarios.map((scenario) => ({
      ...scenario,
      formatted: {
        rate: formatTinyPercentage(scenario.rate * 100),
        amount: formatCurrencyEUR(scenario.amount),
        foodAidMeals: formatLargeNumber(scenario.concrete.foodAidMeals),
        povertyThresholdYears: formatLargeNumber(scenario.concrete.povertyThresholdYears),
        educationStudentYears: formatLargeNumber(scenario.concrete.educationStudentYears),
        childrenFedOneYear: formatLargeNumber(scenario.concrete.childrenFedOneYear),
        schoolsBuilt: formatLargeNumber(scenario.concrete.schoolsBuilt),
        localHospitalsBuilt: formatLargeNumber(scenario.concrete.localHospitalsBuilt),
        globalHungerFundingShare: formatTinyPercentage(scenario.concrete.globalHungerFundingShare * 100),
        waterWells: formatLargeNumber(scenario.concrete.waterWells),
        socialHousingUnits: formatLargeNumber(scenario.concrete.socialHousingUnits),
      },
    })),
    generatedAt: new Date().toISOString(),
    assumptions: {
      defaultSavingsRate: economicReferences.defaultSavingsRate.value,
      careerYears: 42,
      taxScenarioBase: billionaire.annualGainLabel,
      taxScenarioBaseNote: billionaire.annualGainNote,
      foodAidMealEUR: economicReferences.foodAidMeal.value,
      childFedOneYearEUR: economicReferences.childFedOneYear.value,
      schoolConstructionCostEUR: economicReferences.schoolConstructionCost.value,
      localHospitalConstructionCostEUR: economicReferences.localHospitalConstructionCost.value,
      globalHungerFundingNeedAnnualEUR: economicReferences.globalHungerFundingNeedAnnual.value,
      note:
        "Les repas et paniers sont des equivalences budgetaires theoriques. Ils ne constituent pas une promesse de politique publique.",
    },
  });
}
