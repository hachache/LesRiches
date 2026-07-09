import type { Metadata } from "next";
import { ComparatorTool } from "@/components/ComparatorTool";
import { PersonalFortuneComparator } from "@/components/PersonalFortuneComparator";

export const metadata: Metadata = {
  title: "Ton salaire ou ton épargne face à une fortune",
  description:
    "Comparez votre salaire net ou votre épargne à une fortune extrême avec un temps théorique, un ratio et des repères concrets.",
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
        <h1 className="display-type mt-4 text-balance text-4xl font-medium uppercase leading-[0.98] md:text-6xl">
          Ton salaire ou ton épargne face à une fortune.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Deux entrées simples : ton salaire net pour mesurer le temps nécessaire, ou ton épargne pour mesurer la
          fraction réelle. Les scénarios restent théoriques et datés.
        </p>
      </div>
      <PersonalFortuneComparator showSecondaryLink={false} />

      <details className="paper-panel group rounded-none p-5 open:pb-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
          <span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
              Archive du calculateur historique
            </span>
            <span className="display-type mt-2 block text-3xl font-medium uppercase leading-none md:text-4xl">
              Repères économiques détaillés
            </span>
          </span>
          <span className="text-sm font-semibold text-[var(--muted)] group-open:hidden">Ouvrir</span>
          <span className="hidden text-sm font-semibold text-[var(--muted)] group-open:inline">Fermer</span>
        </summary>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Ce module est conservé pour compatibilité, mais il n'est plus le parcours principal du site.
        </p>
        <div className="mt-5">
          <ComparatorTool initialAmount={params?.amount ?? "1 milliard"} />
        </div>
      </details>
    </main>
  );
}
