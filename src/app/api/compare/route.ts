import { NextRequest, NextResponse } from "next/server";
import { economicReferences } from "@/data/economicReferences";
import { compareAmount } from "@/lib/calculations/compare";
import { formatCurrencyEUR } from "@/lib/formatters/numbers";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

export function GET(request: NextRequest) {
  const amountParam = request.nextUrl.searchParams.get("amount") ?? "";
  const parsed = parseAmountInput(amountParam);

  if (!parsed.amount) {
    return NextResponse.json(
      {
        error: parsed.error ?? "Invalid amount",
        example: "/api/compare?amount=1000000000",
      },
      { status: 400 },
    );
  }

  const result = compareAmount({ amount: parsed.amount });

  return NextResponse.json({
    input: {
      amount: parsed.amount,
      formattedAmount: formatCurrencyEUR(parsed.amount),
    },
    smicYears: result.smic.years,
    medianSalaryYears: result.medianSalary.years,
    workingLives: result.workingLives.bySmic,
    rsaMonths: result.dailyLife.rsaMonths,
    averageRentMonths: result.dailyLife.averageRentMonths,
    groceryBaskets: result.dailyLife.groceryBaskets,
    medianWealthMultiplier: result.wealth.medianWealthMultiplier,
    generatedAt: new Date().toISOString(),
    assumptions: {
      smicNetMonthly: economicReferences.smicNetMonthly.value,
      medianNetSalaryMonthly: economicReferences.medianNetSalaryMonthly.value,
      careerYears: 42,
      savingsRate: 1,
      dataLastUpdated: "2026-07-06",
    },
  });
}
