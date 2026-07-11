import type { Metadata } from "next";
import Image from "next/image";
import { MotionReveal } from "@/components/MotionReveal";
import { SourceList } from "@/components/SourceList";
import { sourceReferences } from "@/data/economicReferences";

export const metadata: Metadata = {
  title: "Méthodologie",
  description:
    "Références, hypothèses et limites du comparateur de fortunes L'Écart.",
  alternates: { canonical: "/methodologie" },
};

export default function MethodologiePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <MotionReveal>
        <p className="text-sm font-semibold text-[var(--accent-dark)]">Méthodologie</p>
        <h1 className="display-type mt-4 text-5xl font-medium uppercase leading-[0.94] md:text-7xl">D'où viennent les chiffres ?</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          L'Écart compare un salaire net ou une épargne à une fortune extrême. Il montre une échelle, pas une analyse fiscale complète.
        </p>
      </MotionReveal>

      <MotionReveal className="paper-panel relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl" delay={0.06}>
        <Image
          src="/assets/methodology/source-ledger.webp"
          alt="Illustration de fiches de méthodologie et de sources économiques"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </MotionReveal>

      <div className="mt-8 grid gap-8 text-lg leading-8 text-[var(--muted)]">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Ce que le site affiche</h2>
          <p className="mt-3">
            Avec un salaire, le parcours mesure le temps théorique nécessaire. Avec une épargne, il affiche un ratio
            simple. Une lecture optionnelle traduit ensuite 1% d'une variation annuelle estimée en repères budgétaires.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Pourquoi le ratio passe avant le pourcentage
          </h2>
          <p className="mt-3">
            Un pourcentage comme 0,00000238% est exact, mais difficile à sentir. Le ratio “1 / 42 millions” exprime le
            même ordre de grandeur dans une forme plus mémorisable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Pourquoi ce n'est pas une proposition fiscale
          </h2>
          <p className="mt-3">
            Le module fiscal simule un prélèvement ponctuel sur une variation annuelle estimée de fortune, pas sur toute
            la fortune accumulée. Il ne modélise pas les plus-values latentes, la liquidité des actifs, le droit fiscal,
            les réactions de marché, les coûts administratifs ou les dépenses de fonctionnement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Repères concrets utilisés</h2>
          <p className="mt-3">
            L'interface garde trois familles immédiatement lisibles : alimentation, éducation et santé. Ce sont
            des équivalents budgétaires, pas des effets garantis.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            ["Salaire net", "Revenu mensuel après cotisations. Le calcul suppose, de façon irréaliste, que chaque euro est conservé."],
            ["Épargne", "Montant déjà disponible que l'utilisateur souhaite comparer à une fortune estimée."],
            ["Fortune estimée", "Approximation fondée sur actifs, actions, participations, immobilier et marchés."],
            [
              "Variation annuelle",
              "Écart indicatif d'une fortune sur une période. Ce n'est pas un salaire et cela peut être négatif.",
            ],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-3 text-base leading-7">{text}</p>
            </article>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Limites</h2>
          <p className="mt-3">
            Les fortunes évoluent avec les marchés. Les variations annuelles intégrées au projet sont indicatives et
            doivent être actualisées avec Forbes, Bloomberg ou une source équivalente. Les portraits sont des illustrations éditoriales générées.
          </p>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-3xl font-semibold tracking-tight">Références et hypothèses</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted)]">
          Certaines lignes ci-dessous sont des sources publiques, d'autres sont des hypothèses pédagogiques explicitement
          marquées. Elles sont centralisées pour être faciles à vérifier et remplacer.
        </p>
        <div className="mt-5">
          <SourceList sources={sourceReferences} />
        </div>
      </section>
    </main>
  );
}
