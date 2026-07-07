import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { MethodologyNotice } from "@/components/MethodologyNotice";
import { PersonalFortuneComparator } from "@/components/PersonalFortuneComparator";
import { SourceList } from "@/components/SourceList";
import { sourceReferences } from "@/data/economicReferences";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "L'Écart",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Comparateur pédagogique qui rend lisibles les fortunes extrêmes à partir d'une somme unique.",
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0">
          <Image
            src="/assets/home/hero-scale-v2.png"
            alt="Fond éditorial abstrait représentant un écart d'échelle financier"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(248,244,236,0.68)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--background)] to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl content-center gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-dark)]">L'Écart</p>
            <h1 className="display-type mt-5 text-6xl font-semibold uppercase leading-[0.9] sm:text-7xl md:text-8xl xl:text-[8.4rem]">
              Une somme face aux ultra-riches.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-xl sm:leading-8">
              Entre un montant. Choisis une fortune. Le site traduit l'écart en trois repères lisibles.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/comparateur"
                className="inline-flex h-12 items-center gap-2 rounded-none bg-[var(--foreground)] px-5 text-sm font-bold uppercase tracking-[0.08em] text-[var(--panel)] transition hover:bg-black active:translate-y-px"
              >
                Ouvrir l'expérience
                <ArrowRight size={18} weight="bold" />
              </Link>
              <Link
                href="/milliardaires"
                className="inline-flex h-12 items-center rounded-none border border-black/25 bg-white/70 px-5 text-sm font-bold uppercase tracking-[0.08em] transition hover:border-[var(--accent)] active:translate-y-px"
              >
                Voir les fortunes
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <PersonalFortuneComparator compact />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <h2 className="display-type max-w-3xl text-5xl font-semibold uppercase leading-[0.95]">
            Moins d'indicateurs. Plus d'échelle.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            L'interface évite les repères économiques opaques. Elle garde ce qui se comprend tout de suite : la part
            réelle, le temps de revenu médian, et un équivalent concret sur une fraction de gain annuel estimé.
          </p>
        </div>
        <MethodologyNotice />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <h2 className="display-type text-5xl font-semibold uppercase leading-none">Sources</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Les montants sont isolés dans les données du projet pour être vérifiés et remplacés proprement.
          </p>
        </div>
        <SourceList sources={sourceReferences.slice(0, 5)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="ink-panel grid gap-6 overflow-hidden rounded-lg p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/54">Sortie</p>
            <h2 className="display-type mt-4 max-w-3xl text-5xl font-semibold uppercase leading-[0.95] md:text-7xl">
              Comparer en détail.
            </h2>
            <p className="mt-5 max-w-2xl text-white/68">
              La page complète garde le même principe, avec une lecture plus détaillée des hypothèses.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/comparateur"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--panel)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:bg-white active:translate-y-px"
            >
              Comparer
            </Link>
            <Link
              href="/api/compare?amount=1000000000"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10 active:translate-y-px"
            >
              API JSON
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
