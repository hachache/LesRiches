import type { Metadata } from "next";
import { MotionReveal } from "@/components/MotionReveal";
import { PersonalFortuneComparator } from "@/components/PersonalFortuneComparator";

export const metadata: Metadata = {
  title: "Mesurer l'écart avec une fortune extrême",
  description:
    "Choisissez un salaire net ou une épargne, puis mesurez l'écart avec une fortune extrême en temps, proportion et repères concrets.",
  alternates: { canonical: "/comparateur" },
};

export default function ComparateurPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <MotionReveal className="mobile-safe-panel mx-auto mb-2 max-w-4xl text-center">
        <p className="text-sm font-semibold text-[var(--accent-dark)]">Comparateur</p>
        <h1 className="display-type mt-4 text-balance text-4xl font-medium uppercase leading-[0.94] sm:text-5xl md:text-7xl">
          Choisis ton repère. Mesure l'écart.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Le salaire mesure un temps. L'épargne mesure une proportion. Les deux lectures restent séparées et clairement expliquées.
        </p>
      </MotionReveal>
      <PersonalFortuneComparator showSecondaryLink={false} />
    </main>
  );
}
