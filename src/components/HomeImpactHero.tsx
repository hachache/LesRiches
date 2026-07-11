"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { billionaires } from "@/data/billionaires";
import { calculateSalaryYearsToFortune } from "@/lib/calculations/personalComparison";
import { formatCurrencyEUR, formatDecimal, formatLargeNumber } from "@/lib/formatters/numbers";

export function HomeImpactHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSlug, setSelectedSlug] = useState("elon-musk");
  const reference = billionaires.find((person) => person.slug === selectedSlug) ?? billionaires[0];
  const salaryMonthly = 2_000;
  const salaryYears = calculateSalaryYearsToFortune(reference.netWorthEUR, salaryMonthly);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const smoothHeroProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.28 });
  const backgroundY = useTransform(smoothHeroProgress, [0, 1], [0, reduce ? 0 : 54]);
  const backgroundScale = useTransform(smoothHeroProgress, [0, 1], [1.015, reduce ? 1.015 : 1.045]);

  return (
    <section ref={sectionRef} className="relative min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-black/10">
      <motion.div className="absolute -inset-x-8 -inset-y-24 [transform:translateZ(0)] [will-change:transform]" style={{ y: backgroundY, scale: backgroundScale }}>
        <Image
          src="/assets/home/hero-gap-v3.webp"
          alt="Composition éditoriale abstraite sur l'écart entre un revenu et une fortune extrême"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(243,239,230,0.52)]" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[var(--background)] via-[rgba(243,239,230,0.78)] to-transparent" />
      </motion.div>

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl content-center gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-7xl text-center"
        >
          <p className="font-mono text-xs font-bold tracking-[0.16em] text-[var(--accent-dark)]">L'ÉCART</p>
          <h1 className="display-type mt-4 text-balance text-[clamp(3rem,5.8vw,4.7rem)] font-medium uppercase leading-[0.9]">
            Un milliard n'est pas un salaire.
          </h1>
          <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            Entre un salaire ou une épargne. Les milliards deviennent du temps, des ratios et des repères concrets.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.72, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-black/10 bg-[rgba(255,250,240,0.97)] shadow-[0_36px_140px_rgba(31,24,18,0.18)]"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={reference.slug}
              aria-hidden="true"
              initial={reduce ? false : { x: "-120%", opacity: 0 }}
              animate={{ x: "520%", opacity: [0, 0.72, 0] }}
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/5 bg-gradient-to-r from-transparent via-white/74 to-transparent"
            />
          </AnimatePresence>

          <div className="relative flex items-center justify-between gap-3 border-b border-black/10 p-4 sm:px-6 sm:py-4">
            <div>
              <p className="text-xs font-semibold text-[var(--muted)] sm:text-sm">Démo</p>
              <p className="mt-1 whitespace-nowrap text-sm font-semibold sm:text-base">{formatCurrencyEUR(salaryMonthly)} nets par mois</p>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-2" aria-label="Choisir une fortune pour la démonstration">
              {billionaires.map((person) => {
                const active = person.slug === reference.slug;
                return (
                  <motion.button
                    key={person.slug}
                    type="button"
                    onClick={() => setSelectedSlug(person.slug)}
                    aria-label={`Comparer avec ${person.name}`}
                    aria-pressed={active}
                    whileHover={reduce ? undefined : { y: -3, scale: 1.04 }}
                    whileTap={reduce ? undefined : { scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    className={`relative h-8 w-8 overflow-hidden rounded-full border-2 border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:h-11 sm:w-11 ${active ? "opacity-100" : "opacity-62 hover:opacity-100"}`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="active-hero-fortune"
                        className="absolute inset-0 z-10 rounded-full ring-2 ring-inset ring-[var(--accent)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <Image src={person.imageSrc} alt="" fill sizes="44px" className="object-cover" />
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="relative grid grid-cols-[0.82fr_1.18fr]">
            <div className="grid content-center gap-4 border-r border-black/10 p-4 sm:p-6">
              <div>
                <p className="text-xs font-semibold leading-5 text-[var(--muted)] sm:text-sm">Fortune estimée de {reference.name}</p>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={reference.slug}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    className="display-type mt-3 font-medium leading-[0.86] text-[var(--accent)]"
                  >
                    <p className="text-[clamp(2.4rem,9vw,4rem)]">{formatDecimal(reference.netWorthEUR / 1_000_000_000, 1)}</p>
                    <p className="mt-1 text-[clamp(1.6rem,6vw,3rem)]">milliards €</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="hidden max-w-[28ch] text-sm leading-6 text-[var(--muted)] sm:block">En gardant chaque euro gagné, sans interruption.</p>
            </div>

            <div className="grid content-center p-4 sm:p-6 md:px-8">
              <div aria-live="polite">
                <p className="text-xs font-semibold text-[var(--muted)] sm:text-sm">Temps nécessaire</p>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={reference.slug}
                    initial={reduce ? false : { opacity: 0, y: 22, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -16, scale: 0.99 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-3"
                  >
                    <p className="display-type text-[clamp(2.45rem,7vw,5.2rem)] font-medium uppercase leading-[0.84]">
                      {formatLargeNumber(salaryYears)}
                    </p>
                    <p className="display-type mt-1 text-xl font-medium uppercase leading-none text-[var(--accent)] sm:text-3xl">d'années</p>
                  </motion.div>
                </AnimatePresence>
                <p className="mt-3 hidden max-w-xl text-sm leading-6 text-[var(--muted)] sm:block">
                  Une hypothèse impossible, utile pour mesurer l'ordre de grandeur.
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid gap-2 border-t border-black/10 p-3 sm:grid-cols-[1fr_auto] sm:px-5 sm:py-4">
            <Link
              href="/comparateur"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-sm font-bold text-[var(--panel)] transition hover:-translate-y-0.5 hover:bg-[var(--ink)] active:translate-y-px sm:h-12"
            >
              Essayer avec mes chiffres
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link
              href="/milliardaires"
              className="hidden h-12 items-center justify-center rounded-full border border-black/18 bg-white/72 px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[var(--accent)] active:translate-y-px sm:inline-flex"
            >
              Voir les fortunes
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
