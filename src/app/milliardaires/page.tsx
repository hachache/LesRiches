import type { Metadata } from "next";
import { BillionairesList } from "@/components/BillionairesList";
import { MotionReveal } from "@/components/MotionReveal";

export const metadata: Metadata = {
  title: "Fortunes extrêmes face à ton salaire ou ton épargne",
  description:
    "Comparez des fortunes extrêmes avec un salaire net ou une épargne, puis visualisez l'écart en temps et en repères concrets.",
  alternates: { canonical: "/milliardaires" },
};

export default function MilliardairesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <MotionReveal className="mb-10 max-w-4xl">
        <p className="text-sm font-semibold text-[var(--accent-dark)]">Fortunes extrêmes</p>
        <h1 className="display-type mt-4 text-balance text-5xl font-medium uppercase leading-[0.94] md:text-7xl">
          Même monnaie. Pas la même échelle.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Garde le même salaire ou la même épargne, puis parcours plusieurs fortunes sans perdre ton repère.
        </p>
      </MotionReveal>
      <BillionairesList />
    </main>
  );
}
