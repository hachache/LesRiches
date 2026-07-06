import { describe, expect, test } from "vitest";
import {
  formatCurrencyEUR,
  formatDurationYears,
  formatLargeNumber,
  formatTinyPercentage,
  formatStartYear,
} from "@/lib/formatters/numbers";

describe("formatters", () => {
  test("formats euro amounts in French", () => {
    expect(formatCurrencyEUR(1_000_000)).toBe("1 000 000 €");
  });

  test("formats large numbers with explicit French units", () => {
    expect(formatLargeNumber(1_500_000_000)).toBe("1,5 milliard");
    expect(formatLargeNumber(12_000_000)).toBe("12 millions");
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

  test("formats very small percentages without hiding the order of magnitude", () => {
    expect(formatTinyPercentage(0.00000595238)).toBe("0,00000595 %");
    expect(formatTinyPercentage(0)).toBe("0 %");
  });
});
