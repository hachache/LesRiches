import { NextResponse } from "next/server";
import { billionaires } from "@/data/billionaires";
import { economicReferences } from "@/data/economicReferences";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatLargeNumber, formatTinyPercentage } from "@/lib/formatters/numbers";

function readRatePercent(value: string | null): number {
  if (!value) return 0;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed / 100 : 0;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const billionaireSlug = url.searchParams.get("billionaire") ?? "";
  const rate = readRatePercent(url.searchParams.get("rate"));
  const billionaire = billionaires.find((person) => person.slug === billionaireSlug);

  if (!billionaire || !rate || rate > 1) {
    return NextResponse.json(
      {
        error:
          "Parametres invalides. Utilisez billionaire et rate, par exemple /api/tax-scenario?billionaire=elon-musk&rate=1.",
      },
      { status: 400 },
    );
  }

  const scenario = calculateTaxScenario(billionaire.annualGainEUR, rate, billionaire.annualGainLabel);

  return NextResponse.json({
    input: {
      billionaire: billionaire.slug,
      ratePercent: rate * 100,
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
    },
    scenario: {
      ...scenario,
      formatted: {
        rate: formatTinyPercentage(rate * 100),
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
        stateNetRevenueShare: formatTinyPercentage(scenario.publicScale.stateNetRevenueShare * 100),
      },
    },
    generatedAt: new Date().toISOString(),
    assumptions: {
      framing: "simulation théorique ponctuelle sur variation annuelle estimée de fortune",
      baseCompared: billionaire.annualGainLabel,
      baseNote: billionaire.annualGainNote,
      foodAidMealEUR: economicReferences.foodAidMeal.value,
      childFedOneYearEUR: economicReferences.childFedOneYear.value,
      schoolConstructionCostEUR: economicReferences.schoolConstructionCost.value,
      localHospitalConstructionCostEUR: economicReferences.localHospitalConstructionCost.value,
      globalHungerFundingNeedAnnualEUR: economicReferences.globalHungerFundingNeedAnnual.value,
      povertyThresholdMonthlyEUR: economicReferences.povertyThresholdMonthly.value,
      educationCostPerStudentYearEUR: economicReferences.educationCostPerStudentYear.value,
      socialHousingUnitCostEUR: economicReferences.socialHousingUnitCost.value,
    },
  });
}
