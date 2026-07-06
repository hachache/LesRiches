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
            Le moteur divise une somme par des références mensuelles ou unitaires : SMIC net, salaire médian, RSA,
            loyer moyen, panier alimentaire, voiture populaire et patrimoine médian. Les résultats sont des ordres de
            grandeur, pas des trajectoires financières réalistes.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Pourquoi 100 % d'épargne ?</h2>
          <p className="mt-3">
            Une épargne à 100 % est irréaliste : personne ne vit sans logement, nourriture, transport ou impôts. Elle
            sert ici de borne basse théorique. Si même cette hypothèse produit des milliers d'années, l'écart est déjà
            lisible.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Revenu", "Argent qui entre régulièrement : salaire, allocation, rente ou autre flux."],
            ["Patrimoine", "Ce qu'une personne possède moins ce qu'elle doit : immobilier, épargne, actifs, dettes."],
            ["Fortune estimée", "Approximation fondée sur actifs, actions, participations, immobilier et marchés."],
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
            milliardaires bougent avec les cours de marché. Le dépôt isole toutes les références dans un seul fichier
            pour faciliter les mises à jour et éviter les valeurs magiques dans l'interface.
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
