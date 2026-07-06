import { describe, expect, test } from "vitest";
import {
  calculateConcreteEquivalents,
  calculatePublicScaleRatios,
  calculateTaxScenario,
} from "@/lib/calculations/taxScenarios";

describe("tax scenario calculations", () => {
  test("calculates theoretical tax scenarios for fixed rates", () => {
    expect(calculateTaxScenario(1_000_000_000, 0.005).amount).toBe(5_000_000);
    expect(calculateTaxScenario(1_000_000_000, 0.01).amount).toBe(10_000_000);
    expect(calculateTaxScenario(1_000_000_000, 0.02).amount).toBe(20_000_000);
    expect(calculateTaxScenario(1_000_000_000, 0.05).amount).toBe(50_000_000);
  });

  test("returns zero scenario for invalid fortunes or rates", () => {
    expect(calculateTaxScenario(Number.NaN, 0.01).amount).toBe(0);
    expect(calculateTaxScenario(1_000_000_000, -0.01).amount).toBe(0);
    expect(calculateTaxScenario(1_000_000_000, 1.5).amount).toBe(0);
  });

  test("converts an amount into concrete equivalents", () => {
    const result = calculateConcreteEquivalents(12_160);

    expect(result.povertyThresholdYears).toBeCloseTo(12_160 / (1_216 * 12));
    expect(result.rsaYears).toBeGreaterThan(1);
    expect(result.foodAidMeals).toBe(6_080);
    expect(result.educationStudentYears).toBeGreaterThan(1);
  });

  test("calculates public-scale ratios", () => {
    const result = calculatePublicScaleRatios(3_253_820_000);

    expect(result.stateNetRevenueShare).toBeCloseTo(0.01);
    expect(result.banquesAlimentairesYearsEquivalent).toBeGreaterThan(0);
    expect(result.restosDuCoeurYearsEquivalent).toBeGreaterThan(0);
  });
});
