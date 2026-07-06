import { describe, expect, test } from "vitest";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

describe("parseAmountInput", () => {
  test.each([
    ["1000000", 1_000_000],
    ["1 000 000", 1_000_000],
    ["1,000,000", 1_000_000],
    ["1m", 1_000_000],
    ["1M", 1_000_000],
    ["1 milliard", 1_000_000_000],
    ["1 billion", 1_000_000_000],
    ["1,5 milliard", 1_500_000_000],
  ])("parses %s", (input, expected) => {
    expect(parseAmountInput(input).amount).toBe(expected);
  });

  test("explains English billion in French context", () => {
    expect(parseAmountInput("1 billion").warning).toContain("anglais");
  });

  test("returns a clean error for invalid or negative input", () => {
    expect(parseAmountInput("abc").error).toBeTruthy();
    expect(parseAmountInput("-100").error).toBeTruthy();
    expect(parseAmountInput("").error).toBeTruthy();
  });
});
