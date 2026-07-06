import { describe, expect, test } from "vitest";
import { GET } from "@/app/api/personal-compare/route";

describe("/api/personal-compare", () => {
  test("returns a personal comparison for a known billionaire slug", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/personal-compare?salary=2000&savings=10000&billionaire=elon-musk"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.input.salaryMonthly).toBe(2000);
    expect(payload.billionaire.slug).toBe("elon-musk");
    expect(payload.comparison.percentage).toBeGreaterThan(0);
    expect(payload.assumptions.defaultSavingsRate).toBe(0.2);
    expect(payload.generatedAt).toEqual(expect.any(String));
  });

  test("returns a 400 response for invalid parameters", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/personal-compare?salary=0&savings=10000&billionaire=unknown"),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toContain("Parametres invalides");
  });
});
