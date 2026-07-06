import { economicReferences } from "@/data/economicReferences";
import { calculatePurchasingPowerUnits } from "@/lib/calculations/compare";
import type { ConcreteEquivalents, PublicScaleRatios, TaxScenario } from "@/types/economics";

export const taxScenarioRates = [0.005, 0.01, 0.02, 0.05] as const;

function positive(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

function validRate(rate: number): number {
  return typeof rate === "number" && Number.isFinite(rate) && rate > 0 && rate <= 1 ? rate : 0;
}

export function calculateConcreteEquivalents(amount: number): ConcreteEquivalents {
  const cleanAmount = positive(amount);

  return {
    smicYears: calculatePurchasingPowerUnits(cleanAmount, economicReferences.smicNetMonthly.value * 12),
    rsaMonths: calculatePurchasingPowerUnits(cleanAmount, economicReferences.rsaSingleMonthly.value),
    rsaYears: calculatePurchasingPowerUnits(cleanAmount, economicReferences.rsaSingleMonthly.value * 12),
    povertyThresholdYears: calculatePurchasingPowerUnits(cleanAmount, economicReferences.povertyThresholdMonthly.value * 12),
    foodAidMeals: calculatePurchasingPowerUnits(cleanAmount, economicReferences.foodAidMeal.value),
    groceryBaskets: calculatePurchasingPowerUnits(cleanAmount, economicReferences.groceryBasket.value),
    educationStudentYears: calculatePurchasingPowerUnits(cleanAmount, economicReferences.educationCostPerStudentYear.value),
    childrenFedOneYear: calculatePurchasingPowerUnits(cleanAmount, economicReferences.childFedOneYear.value),
    schoolsBuilt: calculatePurchasingPowerUnits(cleanAmount, economicReferences.schoolConstructionCost.value),
    localHospitalsBuilt: calculatePurchasingPowerUnits(cleanAmount, economicReferences.localHospitalConstructionCost.value),
    globalHungerFundingShare: calculatePurchasingPowerUnits(
      cleanAmount,
      economicReferences.globalHungerFundingNeedAnnual.value,
    ),
    waterWells: calculatePurchasingPowerUnits(cleanAmount, economicReferences.waterWellCost.value),
    socialHousingUnits: calculatePurchasingPowerUnits(cleanAmount, economicReferences.socialHousingUnitCost.value),
    averageRentYears: calculatePurchasingPowerUnits(cleanAmount, economicReferences.averageRentMonthly.value * 12),
  };
}

export function calculatePublicScaleRatios(amount: number): PublicScaleRatios {
  const cleanAmount = positive(amount);
  const mealEquivalent = calculatePurchasingPowerUnits(cleanAmount, economicReferences.foodAidMeal.value);

  return {
    stateNetRevenueShare: calculatePurchasingPowerUnits(cleanAmount, economicReferences.stateNetRevenueAnnual.value),
    banquesAlimentairesYearsEquivalent: calculatePurchasingPowerUnits(
      mealEquivalent,
      economicReferences.annualBanquesAlimentairesMeals.value,
    ),
    restosDuCoeurYearsEquivalent: calculatePurchasingPowerUnits(
      mealEquivalent,
      economicReferences.annualRestosDuCoeurMeals.value,
    ),
  };
}

export function calculateTaxScenario(baseAmountEUR: number, taxRate: number, baseLabel = "variation annuelle estimée"): TaxScenario {
  const rate = validRate(taxRate);
  const baseAmount = positive(baseAmountEUR);
  const amount = baseAmount && rate ? baseAmount * rate : 0;

  return {
    rate,
    baseAmount,
    baseLabel,
    amount,
    concrete: calculateConcreteEquivalents(amount),
    publicScale: calculatePublicScaleRatios(amount),
  };
}

export function calculateDefaultTaxScenarios(baseAmountEUR: number, baseLabel = "variation annuelle estimée"): TaxScenario[] {
  return taxScenarioRates.map((rate) => calculateTaxScenario(baseAmountEUR, rate, baseLabel));
}
