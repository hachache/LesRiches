import { describe, expect, test } from "vitest";
import {
  calculateCareersAtSavingsRate,
  calculateFortuneFraction,
  calculateImpactEquivalents,
  calculateLifetimeEquivalents,
  calculatePersonalFortuneComparison,
  calculatePhysicalScaleDistanceMeters,
  calculateSavingsMultiplier,
  calculateSalaryYearsToFortune,
} from "@/lib/calculations/personalComparison";

describe("personal fortune comparison", () => {
  test("calculates a personal savings fraction of a fortune", () => {
    const result = calculateFortuneFraction(10_000, 1_000_000_000);

    expect(result.fraction).toBe(0.00001);
    expect(result.percentage).toBe(0.001);
  });

  test("returns zero for invalid savings or fortune values", () => {
    expect(calculateFortuneFraction(Number.NaN, 1_000_000_000)).toEqual({ fraction: 0, percentage: 0 });
    expect(calculateFortuneFraction(10_000, 0)).toEqual({ fraction: 0, percentage: 0 });
    expect(calculateFortuneFraction(-10_000, 1_000_000_000)).toEqual({ fraction: 0, percentage: 0 });
  });

  test("calculates years of salary required for a fortune", () => {
    expect(calculateSalaryYearsToFortune(1_200_000, 2_000)).toBe(50);
    expect(calculateSalaryYearsToFortune(1_200_000, 0)).toBe(0);
  });

  test("turns salary years into full lifetimes", () => {
    expect(calculateLifetimeEquivalents(1_992_000, 2_000, 83)).toBe(1);
    expect(calculateLifetimeEquivalents(1_992_000, 0, 83)).toBe(0);
  });

  test("turns a wealth ratio into a physical distance", () => {
    expect(calculatePhysicalScaleDistanceMeters(10_000, 420_000_000_000)).toBe(42_000);
    expect(calculatePhysicalScaleDistanceMeters(0, 420_000_000_000)).toBe(0);
  });

  test("calculates how many times personal savings fit into a fortune", () => {
    expect(calculateSavingsMultiplier(1_000_000_000, 10_000)).toBe(100_000);
    expect(calculateSavingsMultiplier(1_000_000_000, 0)).toBe(0);
  });

  test("calculates careers at a fixed savings rate", () => {
    expect(calculateCareersAtSavingsRate(2_419_200, 2_000, 0.2, 42)).toBe(12);
    expect(calculateCareersAtSavingsRate(1_209_600, 2_000, 0, 42)).toBe(0);
  });

  test("calculates impact equivalents from centralized references", () => {
    const result = calculateImpactEquivalents(1_000_000_000);

    expect(result.foodAidMeals).toBe(500_000_000);
    expect(result.groceryBaskets).toBeCloseTo(9_090_909.09);
    expect(result.medianWealthMultiplier).toBeCloseTo(6752.19);
  });

  test("builds a full personal comparison for very large fortunes", () => {
    const result = calculatePersonalFortuneComparison({
      salaryMonthly: 2_000,
      savingsTotal: 25_000,
      netWorthEUR: 420_000_000_000,
    });

    expect(result.percentage).toBeCloseTo(0.00000595238);
    expect(result.ratioDenominator).toBe(16_800_000);
    expect(result.savingsMultiplier).toBe(16_800_000);
    expect(result.salaryYears).toBe(17_500_000);
    expect(result.careersAt20PercentSavings).toBeCloseTo(2_083_333.33);
    expect(Number.isFinite(result.foodAidMeals)).toBe(true);
  });
});
