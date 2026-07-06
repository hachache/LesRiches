import type { Metadata } from "next";
import { BillionairesList } from "@/components/BillionairesList";

export const metadata: Metadata = {
  title: "Fortunes de milliardaires en années de SMIC",
  description:
    "Comparez des fortunes estimées avec des années de SMIC net, carrières complètes et patrimoines médians français.",
  alternates: { canonical: "/milliardaires" },
};

export default function MilliardairesPage() {
  return (
    <main className="poster-shell mx-auto max-w-[1580px] px-4 py-10 sm:px-8 md:px-14 lg:px-24">
      <div className="mb-8 max-w-5xl lg:pl-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent)]">Comparer · comprendre · se représenter</p>
        <h1 className="display-type mt-4 text-6xl font-bold uppercase leading-[0.9] md:text-8xl">
          Fortunes estimées, chiffres réels.
        </h1>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-[var(--muted)]">
          Les fortunes sont des estimations variables. Les montants doivent être mis à jour depuis des sources
          publiques fiables. Ici, on compare aussi avec ton salaire net et des repères alimentaires.
        </p>
      </div>
      <BillionairesList />
    </main>
  );
}
