import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartBar, Scales, Timer } from "@phosphor-icons/react/dist/ssr";
import { HomeQuickCompare } from "@/components/HomeQuickCompare";
import { MethodologyNotice } from "@/components/MethodologyNotice";
import { SourceList } from "@/components/SourceList";
import { sourceReferences } from "@/data/economicReferences";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Combien de SMIC",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Comparateur pédagogique qui convertit une somme en années de SMIC, salaires médians, loyers et patrimoine.",
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="poster-shell mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1580px] gap-10 overflow-hidden px-4 py-8 sm:px-8 md:px-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-24 lg:py-14">
        <div className="relative flex flex-col justify-center lg:pl-10">
          <div className="mb-10 flex items-end justify-between gap-6 lg:hidden">
            <div className="display-type text-4xl font-bold uppercase leading-[0.85]">
              Combien de
              <br />
              SMIC
            </div>
            <p className="hidden max-w-32 text-right text-xs text-[var(--muted)] sm:block">
              Comprendre les fortunes. <strong className="text-[var(--foreground)]">En chiffres réels.</strong>
            </p>
          </div>
          <div className="mb-8 hidden items-end gap-3 lg:flex">
            <div className="display-type text-5xl font-bold uppercase leading-[0.82]">
              Combien de
              <br />
              SMIC
            </div>
            <span className="mb-1 h-1 w-12 bg-[var(--accent)]" />
          </div>
          <h1 className="display-type max-w-4xl text-5xl font-bold uppercase leading-[0.9] sm:text-6xl md:text-8xl xl:text-[7.7rem]">
            Combien de SMIC représente une fortune ?
          </h1>
          <p className="mt-7 max-w-xl text-xl leading-8 text-[var(--muted)] sm:text-2xl sm:leading-9">
            Entrez une somme. Regardez <span className="font-bold text-[var(--accent)]">l'échelle.</span>
          </p>
          <div className="mt-10 grid gap-4 text-sm text-[var(--muted)] sm:grid-cols-3">
            <div className="border-l border-black/15 pl-4">
              <strong className="block text-[var(--foreground)]">SMIC net</strong>
              mensuel ≈ 1 478 €
            </div>
            <div className="border-l border-black/15 pl-4">
              <strong className="block text-[var(--foreground)]">17 735 €</strong>
              par an, avant toute dépense
            </div>
            <div className="border-l border-black/15 pl-4">
              <strong className="block text-[var(--foreground)]">Ordres de grandeur</strong>
              pas slogans
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/comparateur"
              className="inline-flex h-12 items-center gap-2 rounded-none bg-[var(--foreground)] px-5 text-sm font-bold uppercase tracking-[0.08em] text-[var(--panel)] transition hover:bg-black active:translate-y-px"
            >
              Ouvrir le comparateur
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link
              href="/milliardaires"
              className="inline-flex h-12 items-center rounded-none border border-black/25 bg-white/65 px-5 text-sm font-bold uppercase tracking-[0.08em] transition hover:border-[var(--accent)] active:translate-y-px"
            >
              Voir les fortunes
            </Link>
          </div>
        </div>
        <div className="relative self-center lg:pt-24">
          <p className="display-type pointer-events-none mb-[-16px] hidden max-w-full overflow-hidden text-right text-5xl font-bold leading-none sm:block sm:text-6xl md:text-8xl xl:text-[7.5rem]">
            1 000 000 000 €
          </p>
          <div className="paper-panel relative mb-[-70px] ml-auto aspect-[16/8] w-full max-w-3xl overflow-hidden rounded-none border-black/35 md:mb-[-98px]">
            <Image
              src="/assets/home/ledger-scale.png"
              alt="Illustration éditoriale d'une balance de papier et de registres"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
            <span className="absolute right-5 top-5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
              Exemple
            </span>
          </div>
          <HomeQuickCompare />
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--ink)] py-12 text-[var(--panel)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            [Timer, "Le temps", "Une grande somme devient lisible quand on la traduit en années de revenu."],
            [Scales, "Le patrimoine", "Salaire, revenu et fortune ne mesurent pas la même chose."],
            [ChartBar, "La méthode", "Les hypothèses sont visibles, modifiables et centralisées dans le code."],
          ].map(([Icon, title, text]) => (
            <article key={String(title)} className="relative border-t border-white/20 pt-5">
              <span className="absolute -top-px left-0 h-px w-24 bg-[var(--accent)]" />
              <Icon size={28} weight="bold" />
              <h2 className="mt-4 text-2xl font-bold tracking-tight">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-white/68">{String(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <h2 className="display-type max-w-3xl text-5xl font-bold uppercase leading-[0.95]">
            Les grands nombres mentent par abstraction.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Parce que les montants très élevés deviennent abstraits. Dire “un milliard” ne raconte presque rien.
            Dire combien d'années de SMIC, de loyers ou de patrimoines médians cela représente rend l'échelle plus
            compréhensible, sans slogan inutile.
          </p>
        </div>
        <MethodologyNotice />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <h2 className="display-type text-5xl font-bold uppercase leading-none">Sources et références</h2>
          <div className="paper-panel relative mt-6 aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src="/assets/methodology/source-ledger.png"
              alt="Illustration de fiches de sources économiques et d'hypothèses"
              fill
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="lg:pt-14">
          <SourceList sources={sourceReferences.slice(0, 6)} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="ink-panel grid gap-8 overflow-hidden rounded-lg p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/54">Sortie</p>
            <h2 className="display-type mt-4 max-w-3xl text-5xl font-bold uppercase leading-[0.95] md:text-7xl">
              Essayez avec votre chiffre.
            </h2>
            <p className="mt-5 max-w-2xl text-white/68">
              Sources visibles. Hypothèses modifiables. API JSON disponible pour montrer le moteur côté backend.
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
