"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkle } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { billionaires } from "@/data/billionaires";
import { calculateSalaryYearsToFortune } from "@/lib/calculations/personalComparison";
import { formatCurrencyEUR, formatLargeNumber } from "@/lib/formatters/numbers";

function formatHeroYears(value: number): string {
  if (value >= 1_000_000) return `${formatLargeNumber(value)} d'années`;
  return `${Math.round(value).toLocaleString("fr-FR").replace(/[\u00a0\u202f]/g, " ")} ans`;
}

export function HomeImpactHero() {
  const reduce = useReducedMotion();
  const reference = billionaires.find((person) => person.slug === "elon-musk") ?? billionaires[0];
  const salaryMonthly = 2_000;
  const salaryYears = calculateSalaryYearsToFortune(reference.netWorthEUR, salaryMonthly);

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-black/10">
      <div className="absolute inset-0">
        <Image
          src="/assets/home/hero-gap-v3.png"
          alt="Composition éditoriale abstraite sur l'écart entre une somme et une fortune"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(243,239,230,0.48)]" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl content-center gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
            L'Écart
          </p>
          <h1 className="display-type mt-5 text-balance text-6xl font-medium uppercase leading-[0.96] sm:text-7xl md:text-8xl xl:text-[7.7rem]">
            Mesurer l'écart.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-xl sm:leading-8">
            Une démo suffit : prends un salaire net, choisis une fortune extrême, regarde l'échelle.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-[var(--panel)]/92 p-5 shadow-[0_36px_140px_rgba(31,24,18,0.2)] backdrop-blur md:grid-cols-[0.95fr_1.4fr] md:p-7"
        >
          {!reduce ? (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/44 to-transparent"
              animate={{ x: ["0%", "470%"], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.25, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : null}

          <div className="grid gap-6 border-b border-black/10 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--panel)]">
                <Sparkle size={18} weight="bold" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Démo pré-remplie
                </p>
                <p className="font-semibold">2 000 €/mois vs {reference.name}</p>
              </div>
            </div>

            <div className="grid gap-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                Ton salaire net
              </p>
              <p className="display-type text-5xl font-medium leading-none">{formatCurrencyEUR(salaryMonthly)}</p>
              <ArrowDown className="text-[var(--accent)]" size={28} weight="bold" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                Fortune estimée
              </p>
              <p className="display-type text-5xl font-medium leading-none text-[var(--accent)]">
                {formatLargeNumber(reference.netWorthEUR)} €
              </p>
            </div>
          </div>

          <div className="grid gap-5 pt-6 md:pl-7 md:pt-0">
            <div className="flex items-center gap-4">
              <span className="relative h-14 w-14 overflow-hidden rounded-full bg-black shadow-[0_18px_44px_rgba(17,16,14,0.18)]">
                <Image src={reference.imageSrc} alt={reference.imageAlt} fill sizes="56px" className="object-cover" />
              </span>
              <p className="text-sm font-semibold text-[var(--muted)]">Pour atteindre cette fortune, sans jamais dépenser</p>
            </div>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="display-type text-[clamp(3.15rem,9vw,8.5rem)] font-medium uppercase leading-[0.9]"
            >
              {formatHeroYears(salaryYears)}
            </motion.p>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="#comparer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-sm font-bold uppercase tracking-[0.08em] text-[var(--panel)] transition hover:bg-black active:translate-y-px"
              >
                Essayer avec mes chiffres
                <ArrowRight size={18} weight="bold" />
              </a>
              <Link
                href="/milliardaires"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/18 bg-white/72 px-5 text-sm font-bold uppercase tracking-[0.08em] transition hover:border-[var(--accent)] active:translate-y-px"
              >
                Voir les fortunes
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
