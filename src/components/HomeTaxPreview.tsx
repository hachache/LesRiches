import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { billionaires } from "@/data/billionaires";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatCurrencyEUR, formatLargeNumber } from "@/lib/formatters/numbers";

const referenceFortune = billionaires.find((person) => person.slug === "elon-musk") ?? billionaires[0];
const onePercent = calculateTaxScenario(referenceFortune.netWorthEUR, 0.01);

export function HomeTaxPreview() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
            Simulation neutre
          </p>
          <h2 className="display-type mt-3 text-5xl font-semibold uppercase leading-[0.98] md:text-7xl">
            Ce que 1% représenterait.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
          Exemple avec la fortune estimée de {referenceFortune.name}. Ce n'est pas une proposition fiscale : seulement
          une façon de rendre visible l'ordre de grandeur.
        </p>
      </div>

      <div className="paper-panel grid overflow-hidden rounded-none border-black/30 lg:grid-cols-[1fr_0.85fr]">
        <div className="grid gap-5 p-5 sm:p-7">
          <div>
            <p className="text-sm font-semibold text-[var(--muted)]">1% de {referenceFortune.name}</p>
            <strong className="display-type mt-2 block text-6xl font-semibold leading-none text-[var(--accent)] md:text-8xl">
              {formatCurrencyEUR(onePercent.amount)}
            </strong>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Repas solidaires", formatLargeNumber(onePercent.concrete.foodAidMeals), "/assets/editorial/food-scale.png"],
              [
                "Années par élève",
                formatLargeNumber(onePercent.concrete.educationStudentYears),
                "/assets/editorial/school-budget.png",
              ],
              [
                "Logements théoriques",
                formatLargeNumber(onePercent.concrete.socialHousingUnits),
                "/assets/editorial/housing-ledger.png",
              ],
            ].map(([title, value, image]) => (
              <article key={title} className="overflow-hidden border border-black/15 bg-white">
                <div className="relative aspect-[16/10] bg-black">
                  <Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 240px" className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{title}</p>
                  <strong className="display-type mt-2 block text-4xl font-semibold leading-none">{value}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="relative min-h-72 bg-black">
          <Image
            src="/assets/editorial/tax-ledger.png"
            alt="Illustration éditoriale d'un registre fiscal"
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <Link
            href="/comparateur"
            className="absolute bottom-5 left-5 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--panel)] px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white active:translate-y-px"
          >
            Tester une fortune
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
