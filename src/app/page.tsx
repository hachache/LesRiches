import Image from "next/image";
import Link from "next/link";
import { HomeImpactHero } from "@/components/HomeImpactHero";
import { MethodologyNotice } from "@/components/MethodologyNotice";
import { MotionReveal } from "@/components/MotionReveal";
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
    "Comparateur pédagogique qui traduit l'écart entre un salaire net, une épargne et des fortunes extrêmes.",
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

      <MotionReveal className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-start lg:px-8">
          <div>
            <h2 className="display-type max-w-3xl text-balance text-4xl font-medium uppercase leading-[0.98] sm:text-6xl">
              Des repères, pas des verdicts.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
              Le site montre des écarts de taille. Il ne confond ni fortune, ni revenu, ni budget public.
            </p>
          </div>
          <MethodologyNotice />
      </MotionReveal>

      <MotionReveal className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="display-type text-4xl font-medium uppercase leading-[0.98] sm:text-5xl">D'où viennent les repères ?</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
              Chaque coût visible est centralisé, daté et présenté comme source publique ou hypothèse pédagogique.
            </p>
          </div>
          <SourceList sources={homeSources} />
      </MotionReveal>

      <MotionReveal className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="ink-panel relative grid min-h-80 gap-8 overflow-hidden rounded-2xl p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <Image
            src="/assets/editorial/tax-ledger.png"
            alt="Collage éditorial autour des fortunes et de leur mesure"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover opacity-18 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/86 to-black/42" />
          <div className="relative">
            <h2 className="display-type max-w-3xl text-5xl font-medium uppercase leading-[0.94] md:text-7xl">
              Même monnaie. Des mondes différents.
            </h2>
            <p className="mt-5 max-w-xl text-white/68">
              Compare plusieurs fortunes avec le même salaire ou la même épargne, sans perdre ton point de départ.
            </p>
          </div>
          <Link
            href="/milliardaires"
            className="relative inline-flex h-12 items-center justify-center rounded-full bg-[var(--panel)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-white active:translate-y-px"
          >
            Explorer les fortunes
          </Link>
        </section>
      </MotionReveal>
    </main>
  );
}
