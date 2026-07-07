import type { Metadata } from "next";
import { ResultGrid } from "@/components/ResultGrid";

export const metadata: Metadata = {
  title: "1 milliard d'euros face aux ultra-riches",
  description: "Visualisez ce que représente 1 milliard d'euros en revenu médian, repas, paniers et écoles théoriques.",
  alternates: { canonical: "/combien-de-smic-pour-1-milliard" },
};

export default function OneBillionPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-semibold leading-none tracking-tight md:text-6xl">
        1 milliard d'euros face aux ultra-riches
      </h1>
      <div className="mt-8">
        <ResultGrid amount={1_000_000_000} careerYears={42} savingsRate={1} />
      </div>
    </main>
  );
}
