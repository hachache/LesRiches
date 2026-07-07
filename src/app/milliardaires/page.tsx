import type { Metadata } from "next";
import { BillionairesList } from "@/components/BillionairesList";

export const metadata: Metadata = {
  title: "Fortunes extrêmes, salaire et épargne",
  description:
    "Comparez des fortunes extrêmes avec un salaire net ou une épargne, puis visualisez l'écart en temps et en repères concrets.",
  alternates: { canonical: "/milliardaires" },
};

export default function MilliardairesPage() {
  return (
    <main className="poster-shell mx-auto max-w-[1580px] px-4 py-10 sm:px-8 md:px-14 lg:px-24">
      <div className="mb-8 max-w-5xl lg:pl-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
          Fortunes extrêmes
        </p>
        <h1 className="display-type mt-4 text-balance text-5xl font-medium uppercase leading-[1] md:text-8xl">
          Compare ton salaire ou ton épargne.
        </h1>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-[var(--muted)]">
          Choisis un repère personnel, puis ouvre une carte pour voir le temps nécessaire, le ratio et les équivalents
          concrets. Les fortunes restent des données démo à vérifier avant publication.
        </p>
      </div>
      <BillionairesList />
    </main>
  );
}
