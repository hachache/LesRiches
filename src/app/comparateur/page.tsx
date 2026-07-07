import type { Metadata } from "next";
import { ComparatorTool } from "@/components/ComparatorTool";
import { PersonalFortuneComparator } from "@/components/PersonalFortuneComparator";

export const metadata: Metadata = {
  title: "Moi vs ultra-riches",
  description:
    "Comparez une somme à des fortunes d'ultra-riches avec une fraction réelle, un temps de revenu médian et des repères concrets.",
  alternates: { canonical: "/comparateur" },
};

type PageProps = {
  searchParams?: Promise<{ amount?: string }>;
};

export default async function ComparateurPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto grid max-w-7xl gap-10 overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mobile-safe-panel mx-auto mb-4 max-w-4xl text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
          Comparateur
        </p>
        <h1 className="display-type mt-4 text-5xl font-semibold uppercase leading-[0.95] md:text-7xl">
          Une somme face aux ultra-riches.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Un montant, une fortune, trois repères. Le reste sert seulement à vérifier les hypothèses.
        </p>
      </div>
      <PersonalFortuneComparator showSecondaryLink={false} />

      <details className="paper-panel group rounded-none p-5 open:pb-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
          <span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
              Option secondaire
            </span>
            <span className="display-type mt-2 block text-3xl font-semibold uppercase leading-none md:text-4xl">
              Comparer une somme libre
            </span>
          </span>
          <span className="text-sm font-semibold text-[var(--muted)] group-open:hidden">Ouvrir</span>
          <span className="hidden text-sm font-semibold text-[var(--muted)] group-open:inline">Fermer</span>
        </summary>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Pour tester un montant précis avec des repères de revenu et de quotidien.
        </p>
        <div className="mt-5">
          <ComparatorTool initialAmount={params?.amount ?? "1 milliard"} />
        </div>
      </details>
    </main>
  );
}
