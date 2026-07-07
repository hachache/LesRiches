import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
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
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0">
          <Image
            src="/assets/home/hero-gap-v3.png"
            alt="Collage éditorial abstrait représentant un écart d'échelle financier"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(243,239,230,0.58)]" />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[var(--background)] to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl content-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
              L'Écart
            </p>
            <h1 className="display-type mt-5 text-balance text-6xl font-medium uppercase leading-[0.96] sm:text-7xl md:text-8xl xl:text-[7.7rem]">
              Mesurer l'écart.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-xl sm:leading-8">
              Choisis ton salaire net ou ton épargne. Compare avec une fortune extrême. Le site traduit l'écart en
              temps, ratio et repères concrets.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="#comparer"
                className="inline-flex h-12 items-center gap-2 rounded-none bg-[var(--foreground)] px-5 text-sm font-bold uppercase tracking-[0.08em] text-[var(--panel)] transition hover:bg-black active:translate-y-px"
              >
                Comparer maintenant
                <ArrowRight size={18} weight="bold" />
              </a>
              <Link
                href="/milliardaires"
                className="inline-flex h-12 items-center rounded-none border border-black/25 bg-white/78 px-5 text-sm font-bold uppercase tracking-[0.08em] transition hover:border-[var(--accent)] active:translate-y-px"
              >
                Voir les fortunes
              </Link>
            </div>
          </div>

          <div id="comparer" className="mx-auto w-full max-w-6xl scroll-mt-24">
            <PersonalFortuneComparator compact />
          </div>
        </div>
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
