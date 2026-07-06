import { describe, expect, test } from "vitest";
import {
  formatCurrencyEUR,
  formatDurationYears,
  formatLargeNumber,
  formatStartYear,
} from "@/lib/formatters/numbers";

describe("formatters", () => {
  test("formats euro amounts in French", () => {
    expect(formatCurrencyEUR(1_000_000)).toBe("1 000 000 €");
  });

  test("formats large numbers compactly when useful", () => {
    expect(formatLargeNumber(1_500_000_000)).toBe("1,5 Md");
    expect(formatLargeNumber(42_000)).toBe("42 000");
  });

  test("formats duration years with sensible precision", () => {
    expect(formatDurationYears(42)).toBe("42 ans");
    expect(formatDurationYears(0.5)).toBe("6 mois");
  });

  test("formats BCE start years as years before common era", () => {
    expect(formatStartYear(-40_000)).toBe("environ 40 000 ans avant notre ère");
    expect(formatStartYear(1998)).toBe("vers 1998");
  });
});
