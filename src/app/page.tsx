import Link from "next/link";
import { HomeImpactHero } from "@/components/HomeImpactHero";
import { MethodologyNotice } from "@/components/MethodologyNotice";
import { PersonalFortuneComparator } from "@/components/PersonalFortuneComparator";
import { SourceList } from "@/components/SourceList";
import { economicReferences } from "@/data/economicReferences";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "L'Écart",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Comparateur pédagogique qui traduit un salaire net ou une épargne face à des fortunes extrêmes.",
};

const homeSources = [
  economicReferences.childFedOneYear,
  economicReferences.schoolConstructionCost,
  economicReferences.localHospitalConstructionCost,
];

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeImpactHero />

      <section id="comparer" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
        <PersonalFortuneComparator compact />
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <h2 className="display-type max-w-3xl text-balance text-5xl font-medium uppercase leading-[1]">
            Deux lectures, un même écart.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Le mode salaire montre le temps théorique nécessaire pour atteindre une fortune. Le mode épargne montre la
            fraction réelle que représente ton montant. Les repères concrets donnent ensuite l'ordre de grandeur.
          </p>
        </div>
        <MethodologyNotice />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <h2 className="display-type text-5xl font-medium uppercase leading-none">Sources visibles</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
            La home ne montre que les hypothèses utilisées dans les repères principaux. Les données secondaires restent
            dans la méthodologie.
          </p>
        </div>
        <SourceList sources={homeSources} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="ink-panel grid gap-6 overflow-hidden rounded-lg p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/54">Comparer</p>
            <h2 className="display-type mt-4 max-w-3xl text-5xl font-medium uppercase leading-[1] md:text-7xl">
              Voir les fortunes une par une.
            </h2>
            <p className="mt-5 max-w-2xl text-white/68">
              La page dédiée liste les fortunes démo, avec un seul détail ouvert à la fois pour garder la lecture
              claire.
            </p>
          </div>
          <Link
            href="/milliardaires"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--panel)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:bg-white active:translate-y-px"
          >
            Milliardaires
          </Link>
        </div>
      </section>
    </main>
  );
}
