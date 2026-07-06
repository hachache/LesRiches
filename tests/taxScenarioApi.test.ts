import { describe, expect, test } from "vitest";
import { GET } from "@/app/api/tax-scenario/route";

describe("/api/tax-scenario", () => {
  test("returns a theoretical tax scenario", async () => {
    const response = await GET(new Request("http://localhost:3000/api/tax-scenario?billionaire=elon-musk&rate=1"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.input.billionaire).toBe("elon-musk");
    expect(payload.input.ratePercent).toBe(1);
    expect(payload.billionaire.annualGainEUR).toBe(120_000_000_000);
    expect(payload.scenario.amount).toBe(1_200_000_000);
    expect(payload.scenario.concrete.foodAidMeals).toBe(600_000_000);
    expect(payload.scenario.concrete.schoolsBuilt).toBe(100);
    expect(payload.scenario.concrete.globalHungerFundingShare).toBeCloseTo(0.03);
    expect(payload.assumptions.framing).toContain("variation annuelle estimée");
  });

  test("rejects invalid slugs and rates", async () => {
    const response = await GET(new Request("http://localhost:3000/api/tax-scenario?billionaire=unknown&rate=99"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toContain("Parametres invalides");
  });
});
