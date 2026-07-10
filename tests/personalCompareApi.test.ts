import { describe, expect, test } from "vitest";
import { GET } from "@/app/api/personal-compare/route";

describe("/api/personal-compare", () => {
  test("returns a personal comparison for a known billionaire slug", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/personal-compare?amount=1%20million&billionaire=elon-musk"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.amount.value).toBe(1_000_000);
    expect(payload.billionaire.slug).toBe("elon-musk");
    expect(payload.ratio.denominator).toBe(420_000);
    expect(payload.ratio.formatted).toBe("1 / 420 000");
    expect(payload.multiplier.formatted).toBe("420 000 fois");
    expect(payload.annualVariationOnePercent.base).toBe("annualVariationEstimate");
    expect(payload.concreteEquivalents.schoolsBuilt).toBe(100);
    expect(payload.assumptions.comparisonInput).toBe("singleAmount");
    expect(payload.generatedAt).toEqual(expect.any(String));
  });

  test("returns a 400 response for invalid parameters", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/personal-compare?amount=0&billionaire=unknown"),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toContain("Paramètres invalides");
  });
});
