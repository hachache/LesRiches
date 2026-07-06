import { economicReferences } from "@/data/economicReferences";
import type { CompareOptions } from "@/types/economics";

const DAYS_PER_MONTH = 365.25 / 12;

function positive(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

export function calculateMonthsOfIncome(amount: number, monthlyIncome: number): number {
  const cleanAmount = positive(amount);
  const cleanIncome = positive(monthlyIncome);
  return cleanAmount && cleanIncome ? cleanAmount / cleanIncome : 0;
}

export function calculateYearsOfIncome(amount: number, monthlyIncome: number): number {
  return calculateMonthsOfIncome(amount, monthlyIncome) / 12;
}

export function calculateWorkingLives(
  amount: number,
  monthlyIncome: number,
  careerYears = 42,
  savingsRate = 1,
): number {
  const yearlySavings = positive(monthlyIncome) * 12 * positive(savingsRate);
  const careerSavings = yearlySavings * positive(careerYears, 42);
  return positive(amount) && careerSavings ? positive(amount) / careerSavings : 0;
}

export function calculatePurchasingPowerUnits(amount: number, referencePrice: number): number {
  const cleanAmount = positive(amount);
  const cleanPrice = positive(referencePrice);
  return cleanAmount && cleanPrice ? cleanAmount / cleanPrice : 0;
}

export function calculateHistoricalStartYear(
  amount: number,
  yearlyIncome: number,
  currentYear = new Date().getFullYear(),
): number {
  const yearsNeeded = positive(amount) / positive(yearlyIncome);
  if (!Number.isFinite(yearsNeeded) || yearsNeeded <= 0) return currentYear;
  return Math.round(currentYear - yearsNeeded);
}

export function compareAmount(options: CompareOptions) {
  const amount = positive(options.amount);
  const careerYears = positive(options.careerYears, 42);
  const savingsRate = Math.min(1, positive(options.savingsRate, 1));
  const customMonthlyIncome = positive(options.customMonthlyIncome ?? 0);
  const smicMonthly = economicReferences.smicNetMonthly.value;
  const medianMonthly = economicReferences.medianNetSalaryMonthly.value;
  const classicMonthly = customMonthlyIncome || economicReferences.classicNetMonthlyIncome.value;
  const smicYearly = smicMonthly * 12;

  return {
    input: {
      amount,
      careerYears,
      savingsRate,
      customMonthlyIncome,
    },
    smic: {
      months: calculateMonthsOfIncome(amount, smicMonthly),
      years: calculateYearsOfIncome(amount, smicMonthly),
      days: amount / (smicMonthly / DAYS_PER_MONTH),
    },
    medianSalary: {
      months: calculateMonthsOfIncome(amount, medianMonthly),
      years: calculateYearsOfIncome(amount, medianMonthly),
    },
    classicIncome: {
      months: calculateMonthsOfIncome(amount, classicMonthly),
      years: calculateYearsOfIncome(amount, classicMonthly),
    },
    workingLives: {
      bySmic: calculateWorkingLives(amount, smicMonthly, careerYears, savingsRate),
      byMedianSalary: calculateWorkingLives(amount, medianMonthly, careerYears, savingsRate),
      byCustomIncome: calculateWorkingLives(amount, classicMonthly, careerYears, savingsRate),
    },
    dailyLife: {
      rsaMonths: calculatePurchasingPowerUnits(amount, economicReferences.rsaSingleMonthly.value),
      averageRentMonths: calculatePurchasingPowerUnits(amount, economicReferences.averageRentMonthly.value),
      groceryBaskets: calculatePurchasingPowerUnits(amount, economicReferences.groceryBasket.value),
      foodAidMeals: calculatePurchasingPowerUnits(amount, economicReferences.foodAidMeal.value),
      popularCars: calculatePurchasingPowerUnits(amount, economicReferences.popularCarPrice.value),
    },
    wealth: {
      medianWealthMultiplier: calculatePurchasingPowerUnits(amount, economicReferences.medianWealth.value),
      averageWealthMultiplier: calculatePurchasingPowerUnits(amount, economicReferences.averageWealth.value),
      apartments: calculatePurchasingPowerUnits(amount, economicReferences.averageApartmentPrice.value),
      homes: calculatePurchasingPowerUnits(amount, economicReferences.averageHomePrice.value),
    },
    timeline: {
      smicStartYear: calculateHistoricalStartYear(amount, smicYearly, options.currentYear),
      medianStartYear: calculateHistoricalStartYear(amount, medianMonthly * 12, options.currentYear),
    },
  };
}
