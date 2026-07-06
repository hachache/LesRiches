import { describe, expect, test } from "vitest";
import {
  calculateHistoricalStartYear,
  calculateMonthsOfIncome,
  calculatePurchasingPowerUnits,
  calculateWorkingLives,
  calculateYearsOfIncome,
  compareAmount,
} from "@/lib/calculations/compare";

describe("income calculations", () => {
  test("calculates months and years of income from a positive monthly income", () => {
    expect(calculateMonthsOfIncome(120_000, 2_000)).toBe(60);
    expect(calculateYearsOfIncome(120_000, 2_000)).toBe(5);
  });

  test("returns 0 for invalid amounts or non-positive references", () => {
    expect(calculateMonthsOfIncome(Number.NaN, 2_000)).toBe(0);
    expect(calculateYearsOfIncome(-10, 2_000)).toBe(0);
    expect(calculatePurchasingPowerUnits(100, 0)).toBe(0);
  });

  test("calculates working lives with savings rate", () => {
    expect(calculateWorkingLives(1_200_000, 2_000, 40, 1)).toBe(1.25);
    expect(calculateWorkingLives(1_200_000, 2_000, 40, 0.5)).toBe(2.5);
  });

  test("calculates a historical start year from yearly income", () => {
    expect(calculateHistoricalStartYear(120_000, 12_000, 2026)).toBe(2016);
  });

  test("handles very large amounts without infinity", () => {
    const result = compareAmount({
      amount: 150_000_000_000,
      customMonthlyIncome: 2_000,
      careerYears: 42,
      savingsRate: 1,
    });

    expect(Number.isFinite(result.smic.years)).toBe(true);
    expect(result.smic.years).toBeGreaterThan(1_000_000);
    expect(result.workingLives.bySmic).toBeGreaterThan(10_000);
  });
});
