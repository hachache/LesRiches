import { economicReferences } from "@/data/economicReferences";
import type { PersonalFortuneComparison, PersonalFortuneComparisonOptions } from "@/types/economics";
import { calculatePurchasingPowerUnits } from "@/lib/calculations/compare";

const DEFAULT_CAREER_YEARS = 42;

function positive(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

export function calculateFortuneFraction(personalSavings: number, netWorthEUR: number) {
  const savings = positive(personalSavings);
  const fortune = positive(netWorthEUR);
  const fraction = savings && fortune ? savings / fortune : 0;

  return {
    fraction,
    percentage: fraction * 100,
  };
}

export function calculateSalaryYearsToFortune(netWorthEUR: number, monthlySalary: number): number {
  const fortune = positive(netWorthEUR);
  const yearlySalary = positive(monthlySalary) * 12;
  return fortune && yearlySalary ? fortune / yearlySalary : 0;
}

export function calculateCareersAtSavingsRate(
  netWorthEUR: number,
  monthlySalary: number,
  savingsRate = economicReferences.defaultSavingsRate.value,
  careerYears = DEFAULT_CAREER_YEARS,
): number {
  const fortune = positive(netWorthEUR);
  const yearlySavings = positive(monthlySalary) * 12 * positive(savingsRate);
  const careerSavings = yearlySavings * positive(careerYears, DEFAULT_CAREER_YEARS);
  return fortune && careerSavings ? fortune / careerSavings : 0;
}

export function calculateImpactEquivalents(netWorthEUR: number) {
  return {
    medianWealthMultiplier: calculatePurchasingPowerUnits(netWorthEUR, economicReferences.medianWealth.value),
    foodAidMeals: calculatePurchasingPowerUnits(netWorthEUR, economicReferences.foodAidMeal.value),
    groceryBaskets: calculatePurchasingPowerUnits(netWorthEUR, economicReferences.groceryBasket.value),
  };
}

export function calculatePersonalFortuneComparison({
  salaryMonthly,
  savingsTotal,
  netWorthEUR,
  savingsRate = economicReferences.defaultSavingsRate.value,
  careerYears = DEFAULT_CAREER_YEARS,
}: PersonalFortuneComparisonOptions): PersonalFortuneComparison {
  const fraction = calculateFortuneFraction(savingsTotal, netWorthEUR);
  const impact = calculateImpactEquivalents(netWorthEUR);

  return {
    ...fraction,
    salaryYears: calculateSalaryYearsToFortune(netWorthEUR, salaryMonthly),
    careersAt20PercentSavings: calculateCareersAtSavingsRate(netWorthEUR, salaryMonthly, savingsRate ?? undefined, careerYears ?? undefined),
    ...impact,
  };
}
