import type { Metadata } from "next";
import Image from "next/image";
import { SourceList } from "@/components/SourceList";
import { sourceReferences } from "@/data/economicReferences";

export const metadata: Metadata = {
  title: "Méthodologie",
  description:
    "Références, hypothèses et limites du comparateur de fortunes en années de SMIC et patrimoine français.",
  alternates: { canonical: "/methodologie" },
};

export default function MethodologiePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-semibold leading-none tracking-tight md:text-6xl">Méthodologie</h1>
      <div className="paper-panel relative mt-8 aspect-[16/7] overflow-hidden rounded-lg">
        <Image
          src="/assets/methodology/source-ledger.png"
          alt="Illustration de fiches de méthodologie et de sources économiques"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>
      <div className="mt-8 grid gap-8 text-lg leading-8 text-[var(--muted)]">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Ce que le site calcule</h2>
          <p className="mt-3">
            L'expérience principale compare un salaire net mensuel et une épargne totale à des fortunes d'ultra-riches.
            Le moteur calcule la fraction de fortune, les années de salaire nécessaires, les carrières à 20% d'épargne,
            puis des repères simples : SMIC, patrimoine médian, enfants nourris, écoles, hôpitaux locaux et part d'un
            besoin annuel mondial contre la faim.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Pourquoi 20% d'épargne ?</h2>
          <p className="mt-3">
            Le parcours “moi vs ultra-riches” utilise 20% d'épargne comme hypothèse pédagogique stable : sur 2 000 €
            nets par mois, cela revient à conserver 400 € par mois. Ce n'est pas une moyenne universelle, mais c'est
            plus réaliste qu'une épargne à 100%. L'ancien comparateur de somme garde 100% uniquement comme borne
            théorique minimale.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Pourquoi rester sur des repères simples ?
          </h2>
          <p className="mt-3">
            Les comparaisons les plus fortes sont aussi les plus lisibles : années de salaire, patrimoines médians,
            enfants nourris pendant un an, écoles construites et hôpitaux locaux théoriques. L'interface évite les
            sigles et les unités compactes quand elles rendent l'échelle abstraite.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Pourquoi ce n'est pas une proposition fiscale
          </h2>
          <p className="mt-3">
            Le module “si on prélevait X%” utilise la variation annuelle estimée de fortune, pas toute la fortune
            accumulée. Il ne modélise pas l'assiette fiscale réelle, les plus-values latentes, la liquidité des actifs,
            les comportements de marché, les règles juridiques, les coûts administratifs ou les effets de calendrier. Il
            sert uniquement à traduire une fraction d'une année patrimoniale en repères concrets.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Repères concrets ajoutés</h2>
          <p className="mt-3">
            Les repères visibles couvrent l'aide alimentaire théorique, le coût d'une école, le coût d'un hôpital local,
            les patrimoines médians et un besoin annuel mondial contre la faim. Les valeurs incertaines restent marquées
            comme hypothèses plutôt que présentées comme faits définitifs.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Revenu", "Argent qui entre régulièrement : salaire, allocation, rente ou autre flux."],
            ["Patrimoine", "Ce qu'une personne possède moins ce qu'elle doit : immobilier, épargne, actifs, dettes."],
            ["Fortune estimée", "Approximation fondée sur actifs, actions, participations, immobilier et marchés."],
            [
              "Variation annuelle",
              "Écart estimé d'une fortune sur une période. Ce n'est pas un salaire et cela peut être négatif.",
            ],
          ].map(([title, text]) => (
            <article key={title} className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-3 text-base leading-7">{text}</p>
            </article>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Limites</h2>
          <p className="mt-3">
            Les données économiques changent, les loyers varient fortement selon les villes, et les fortunes de
            milliardaires bougent avec les cours de marché. Les portraits sont des assets éditoriaux générés et les
            fortunes doivent être revérifiées depuis Forbes, Bloomberg ou une autre source publique fiable. Le dépôt
            isole toutes les références dans un seul fichier pour faciliter les mises à jour.
          </p>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-3xl font-semibold tracking-tight">Références utilisées</h2>
        <div className="mt-5">
          <SourceList sources={sourceReferences} />
        </div>
      </section>
    </main>
  );
}
