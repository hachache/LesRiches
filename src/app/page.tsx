import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { GapStory } from "@/components/GapStory";
import { HomeImpactHero } from "@/components/HomeImpactHero";
import { MethodologyNotice } from "@/components/MethodologyNotice";
import { MotionReveal } from "@/components/MotionReveal";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "L'Écart",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Comparateur pédagogique qui traduit l'écart entre un salaire net, une épargne et des fortunes extrêmes.",
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeImpactHero />
      <GapStory />

      <MotionReveal className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-start lg:px-8 lg:py-28">
        <div>
          <h2 className="display-type max-w-3xl text-balance text-4xl font-medium uppercase leading-[0.96] sm:text-6xl">
            Les hypothèses restent visibles.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Les fortunes sont estimées. Les coûts publics sont des équivalents pédagogiques. Rien n'est présenté comme une certitude fiscale.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/comparateur"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--panel)] transition hover:-translate-y-0.5 hover:bg-black active:translate-y-px"
            >
              Comparer mes chiffres
              <ArrowRight size={17} weight="bold" />
            </Link>
            <Link href="/milliardaires" className="inline-flex h-12 items-center justify-center px-2 text-sm font-semibold text-[var(--accent-dark)]">
              Parcourir les fortunes
            </Link>
          </div>
        </div>
        <MethodologyNotice />
      </MotionReveal>
    </main>
  );
}
