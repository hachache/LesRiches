import type { Metadata } from "next";
import { BillionairesList } from "@/components/BillionairesList";

export const metadata: Metadata = {
  title: "Fortunes extrêmes face à ton salaire ou ton épargne",
  description:
    "Comparez des fortunes extrêmes avec un salaire net ou une épargne, puis visualisez l'écart en temps et en repères concrets.",
  alternates: { canonical: "/milliardaires" },
};

export default function MilliardairesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-4xl">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
          Fortunes extrêmes
        </p>
        <h1 className="display-type mt-4 text-balance text-4xl font-medium uppercase leading-[0.98] md:text-6xl">
          Choisis une fortune. Mesure l'écart.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Ton salaire mesure un temps théorique. Ton épargne mesure une fraction. Les montants restent des données démo à vérifier.
        </p>
      </div>
      <BillionairesList />
    </main>
  );
}
