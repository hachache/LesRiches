import type { Metadata } from "next";
import { ComparatorTool } from "@/components/ComparatorTool";
import { PersonalFortuneComparator } from "@/components/PersonalFortuneComparator";

export const metadata: Metadata = {
  title: "Moi vs ultra-riches",
  description:
    "Comparez votre salaire et votre épargne à des fortunes d'ultra-riches avec des fractions, années de salaire et repères concrets.",
  alternates: { canonical: "/comparateur" },
};

type PageProps = {
  searchParams?: Promise<{ amount?: string }>;
};

export default async function ComparateurPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto grid max-w-7xl gap-12 overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mobile-safe-panel mb-8 max-w-4xl">
        <h1 className="display-type text-5xl font-semibold uppercase leading-[0.98] md:text-8xl">
          Ma situation vs ultra-riches
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Le but n'est pas de viser les riches en général. On regarde l'écart avec des fortunes extrêmes, en partant de
          ton salaire et de ton épargne.
        </p>
      </div>
      <PersonalFortuneComparator showSecondaryLink={false} />

      <section className="grid gap-5">
        <div className="max-w-3xl">
          <h2 className="display-type text-4xl font-semibold uppercase leading-none md:text-5xl">
            Comparer une somme libre
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            L'ancien calculateur reste disponible pour tester un montant précis en SMIC et repères du quotidien.
          </p>
        </div>
        <ComparatorTool initialAmount={params?.amount ?? "1 milliard"} />
      </section>
    </main>
  );
}
