"use client";

import Image from "next/image";
import { useRef } from "react";
import { Buildings, ForkKnife, Hospital, type Icon } from "@phosphor-icons/react";
import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { billionaires } from "@/data/billionaires";
import { calculateLifetimeEquivalents, calculateSalaryYearsToFortune } from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatDecimal, formatLargeNumber } from "@/lib/formatters/numbers";

type StoryMetric = {
  label: string;
  value: string;
  Icon: Icon;
};

type StorySceneProps = {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  imageSrc: string;
  imageAlt: string;
  label: string;
  value: string;
  unit: string;
  sentence: string;
  metrics?: StoryMetric[];
};

function StoryScene({ progress, range, imageSrc, imageAlt, label, value, unit, sentence, metrics }: StorySceneProps) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const contentY = useTransform(progress, range, [48, 0, 0, -36]);
  const imageScale = useTransform(progress, range, [1.08, 1.02, 1, 0.98]);

  return (
    <motion.article style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ scale: imageScale }} className="absolute -inset-8">
        <Image src={imageSrc} alt={imageAlt} fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,7,0.96)_0%,rgba(8,8,7,0.78)_44%,rgba(8,8,7,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,7,0.92)_0%,transparent_58%)]" />

      <motion.div style={{ y: contentY }} className="relative mx-auto grid h-full max-w-7xl content-end px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-20 lg:px-8">
        <div className="max-w-5xl">
          <p className="text-sm font-semibold text-[#ef4a3d]">{label}</p>
          <p className="display-type mt-4 text-[clamp(4.4rem,11vw,9.5rem)] font-medium uppercase leading-[0.78] text-white">
            {value}
          </p>
          <p className="display-type mt-3 text-2xl font-medium uppercase text-[#ef4a3d] sm:text-4xl">{unit}</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-xl sm:leading-8">{sentence}</p>

          {metrics?.length ? (
            <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
              {metrics.map(({ label: metricLabel, value: metricValue, Icon }) => (
                <div key={metricLabel} className="border-l border-white/24 pl-4">
                  <Icon size={20} weight="bold" className="text-[#ef4a3d]" />
                  <p className="display-type mt-3 text-3xl font-medium leading-none sm:text-4xl">{metricValue}</p>
                  <p className="mt-2 text-sm text-white/58">{metricLabel}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.article>
  );
}

export function GapStory() {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const reference = billionaires.find((person) => person.slug === "elon-musk") ?? billionaires[0];
  const salaryMonthly = 2_000;
  const salaryYears = calculateSalaryYearsToFortune(reference.netWorthEUR, salaryMonthly);
  const lifetimes = calculateLifetimeEquivalents(reference.netWorthEUR, salaryMonthly);
  const onePercent = calculateTaxScenario(reference.annualGainEUR, 0.01, reference.annualGainLabel);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scenes = [
    {
      imageSrc: "/assets/home/hero-scale-v2.png",
      imageAlt: "Composition éditoriale représentant une échelle financière monumentale",
      label: "Le temps brut",
      value: formatLargeNumber(salaryYears),
      unit: "d'années",
      sentence: "Avec 2 000 € nets par mois, en gardant chaque euro et sans jamais interrompre le calcul.",
    },
    {
      imageSrc: "/assets/editorial/civic-scale-v3.png",
      imageAlt: "Collage éditorial d'équipements publics mesurés par un instrument monumental",
      label: "Une mesure humaine",
      value: formatLargeNumber(lifetimes),
      unit: "vies de 83 ans",
      sentence: "Ce n'est plus une carrière longue. C'est une durée qui dépasse tout repère individuel.",
    },
    {
      imageSrc: "/assets/editorial/school-budget.png",
      imageAlt: "Illustration éditoriale d'une école et de repères budgétaires publics",
      label: "1% de sa variation annuelle estimée",
      value: `${formatLargeNumber(onePercent.amount)} €`,
      unit: "simulation ponctuelle",
      sentence: "Un ordre de grandeur budgétaire, pas une promesse politique ni un revenu disponible.",
      metrics: [
        { label: "enfants nourris un an", value: formatLargeNumber(onePercent.concrete.childrenFedOneYear), Icon: ForkKnife },
        { label: "écoles théoriques", value: formatDecimal(onePercent.concrete.schoolsBuilt, 0), Icon: Buildings },
        { label: "hôpitaux théoriques", value: formatDecimal(onePercent.concrete.localHospitalsBuilt, 0), Icon: Hospital },
      ],
    },
  ];

  if (reduce) {
    return (
      <section className="grid bg-[var(--foreground)] text-white">
        {scenes.map((scene) => (
          <article key={scene.label} className="relative min-h-[72dvh] overflow-hidden border-b border-white/10">
            <Image src={scene.imageSrc} alt={scene.imageAlt} fill sizes="100vw" className="object-cover opacity-34" />
            <div className="absolute inset-0 bg-black/62" />
            <div className="relative mx-auto grid min-h-[72dvh] max-w-7xl content-end px-4 py-12 sm:px-6 lg:px-8">
              <p className="text-sm font-semibold text-[#ef4a3d]">{scene.label}</p>
              <p className="display-type mt-4 text-6xl font-medium uppercase leading-[0.82]">{scene.value}</p>
              <p className="display-type mt-2 text-2xl uppercase text-[#ef4a3d]">{scene.unit}</p>
              <p className="mt-4 max-w-xl text-white/68">{scene.sentence}</p>
            </div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[300dvh] bg-[var(--foreground)]">
      <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden">
        <StoryScene progress={scrollYProgress} range={[0, 0.035, 0.285, 0.35]} {...scenes[0]} />
        <StoryScene progress={scrollYProgress} range={[0.29, 0.36, 0.62, 0.69]} {...scenes[1]} />
        <StoryScene progress={scrollYProgress} range={[0.63, 0.7, 1, 1.01]} {...scenes[2]} />
        <motion.div aria-hidden="true" style={{ scaleX: progressScale }} className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[var(--accent)]" />
      </div>
    </section>
  );
}
