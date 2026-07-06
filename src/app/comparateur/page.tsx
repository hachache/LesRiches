import type { Metadata } from "next";
import { ComparatorTool } from "@/components/ComparatorTool";

export const metadata: Metadata = {
  title: "Comparateur de fortune en SMIC",
  description:
    "Convertissez une somme en années de SMIC net, salaires médians, carrières complètes, loyers et patrimoine médian.",
  alternates: { canonical: "/comparateur" },
};

type PageProps = {
  searchParams?: Promise<{ amount?: string }>;
};

export default async function ComparateurPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-7xl overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mobile-safe-panel mb-8 max-w-4xl">
        <h1 className="display-type text-6xl font-bold uppercase leading-[0.95] md:text-8xl">Comparer une somme</h1>
        <p className="mt-5 max-w-[34rem] text-lg leading-8 text-[var(--muted)]">
          Entrez une somme, choisissez un revenu net et un taux d'épargne. La carrière complète reste une base moyenne
          française.
        </p>
      </div>
      <ComparatorTool initialAmount={params?.amount ?? "1 milliard"} />
    </main>
  );
}
