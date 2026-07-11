"use client";

import Image from "next/image";
import { useRef } from "react";
import { Buildings, ForkKnife, Hospital, type Icon } from "@phosphor-icons/react";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { billionaires } from "@/data/billionaires";
import { calculateLifetimeEquivalents, calculateSalaryYearsToFortune } from "@/lib/calculations/personalComparison";
import { calculateTaxScenario } from "@/lib/calculations/taxScenarios";
import { formatDecimal, formatLargeNumber } from "@/lib/formatters/numbers";

type StoryMetric = {
  label: string;
  value: string;
  Icon: Icon;
};

type StoryScene = {
  imageSrc: string;
  imageAlt: string;
  label: string;
  value: string;
  unit: string;
  sentence: string;
  metrics?: StoryMetric[];
};

const sceneRanges = [
  { input: [0, 0.25, 0.34], opacity: [1, 1, 0], y: [0, 0, -28] },
  { input: [0.27, 0.36, 0.61, 0.7], opacity: [0, 1, 1, 0], y: [30, 0, 0, -28] },
  { input: [0.63, 0.72, 1], opacity: [0, 1, 1], y: [30, 0, 0] },
] as const;

function SceneLayer({
  scene,
  index,
  progress,
}: {
  scene: StoryScene;
  index: number;
  progress: MotionValue<number>;
}) {
  const range = sceneRanges[index];
  const opacity = useTransform(progress, [...range.input], [...range.opacity]);
  const y = useTransform(progress, [...range.input], [...range.y]);

  return (
    <motion.article
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 [transform:translateZ(0)] [will-change:opacity]"
    >
      <div className="absolute inset-0">
        <Image
          src={scene.imageSrc}
          alt={scene.imageAlt}
          fill
          sizes="100vw"
          loading={index === 0 ? "eager" : "lazy"}
          quality={78}
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,7,0.97)_0%,rgba(8,8,7,0.82)_42%,rgba(8,8,7,0.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,7,0.94)_0%,transparent_62%)]" />

      <motion.div
        style={{ y }}
        className="relative mx-auto grid h-full max-w-7xl content-end px-4 pb-14 pt-20 text-white [transform:translateZ(0)] [will-change:transform] sm:px-6 sm:pb-20 lg:px-8"
      >
        <div className="max-w-5xl">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#ef4a3d]">
            <span className="font-mono text-xs text-white/48">0{index + 1} / 03</span>
            <span className="h-px w-8 bg-[#ef4a3d]" />
            <span>{scene.label}</span>
          </div>
          <p className="display-type mt-5 max-w-[12ch] text-[clamp(3.5rem,10vw,9rem)] font-medium uppercase leading-[0.8] text-white">
            {scene.value}
          </p>
          <p className="display-type mt-3 text-2xl font-medium uppercase leading-none text-[#ef4a3d] sm:text-4xl">{scene.unit}</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-xl sm:leading-8">{scene.sentence}</p>

          {scene.metrics?.length ? (
            <div className="mt-8 grid max-w-4xl grid-cols-3 gap-2 sm:gap-5">
              {scene.metrics.map(({ label, value, Icon }) => (
                <div key={label} className="border-l border-white/24 pl-3 sm:pl-5">
                  <Icon size={20} weight="bold" className="text-[#ef4a3d]" />
                  <p className="display-type mt-3 text-2xl font-medium leading-none sm:text-4xl">{value}</p>
                  <p className="mt-2 text-[11px] leading-4 text-white/62 sm:text-sm sm:leading-5">{label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.article>
  );
}

function ChapterMarker({
  progress,
  index,
  label,
}: {
  progress: MotionValue<number>;
  index: number;
  label: string;
}) {
  const range = sceneRanges[index];
  const opacity = useTransform(progress, [...range.input], [...range.opacity].map((value) => (value === 1 ? 1 : 0.28)));
  const x = useTransform(progress, [...range.input], [...range.opacity].map((value) => (value === 1 ? 0 : 8)));

  return (
    <motion.div style={{ opacity, x }} className="flex items-center justify-end gap-3 [will-change:transform,opacity]">
      <span className="text-right text-xs font-semibold text-white">{label}</span>
      <span className="font-mono text-[10px] text-white/56">0{index + 1}</span>
    </motion.div>
  );
}

function ReducedStory({ scenes }: { scenes: StoryScene[] }) {
  return (
    <section className="grid bg-[var(--foreground)] text-white" aria-label="Trois repères d'échelle">
      {scenes.map((scene, index) => (
        <article key={scene.label} className="relative min-h-[72svh] overflow-hidden border-b border-white/10">
          <Image src={scene.imageSrc} alt={scene.imageAlt} fill sizes="100vw" quality={78} className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-black/66" />
          <div className="relative mx-auto grid min-h-[72svh] max-w-7xl content-end px-4 py-12 sm:px-6 lg:px-8">
            <p className="font-mono text-xs text-white/48">0{index + 1} / 03</p>
            <p className="mt-2 text-sm font-semibold text-[#ef4a3d]">{scene.label}</p>
            <p className="display-type mt-4 max-w-[12ch] text-6xl font-medium uppercase leading-[0.82]">{scene.value}</p>
            <p className="display-type mt-2 text-2xl uppercase text-[#ef4a3d]">{scene.unit}</p>
            <p className="mt-4 max-w-xl leading-7 text-white/72">{scene.sentence}</p>
          </div>
        </article>
      ))}
    </section>
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
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.25, restDelta: 0.0005 });
  const cameraScale = useTransform(smoothProgress, [0, 1], [1.035, 1]);

  const scenes: StoryScene[] = [
    {
      imageSrc: "/assets/home/hero-scale-v2.webp",
      imageAlt: "Composition éditoriale représentant une échelle financière monumentale",
      label: "Le temps brut",
      value: formatLargeNumber(salaryYears),
      unit: "d'années",
      sentence: "Avec 2 000 € nets par mois, en gardant chaque euro et sans jamais interrompre le calcul.",
    },
    {
      imageSrc: "/assets/editorial/civic-scale-v3.webp",
      imageAlt: "Collage éditorial d'équipements publics mesurés par un instrument monumental",
      label: "Une mesure humaine",
      value: formatLargeNumber(lifetimes),
      unit: "vies de 83 ans",
      sentence: "Ce n'est plus une carrière longue. C'est une durée qui dépasse tout repère individuel.",
    },
    {
      imageSrc: "/assets/editorial/school-budget.webp",
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

  if (reduce) return <ReducedStory scenes={scenes} />;

  return (
    <section
      ref={rootRef}
      data-testid="gap-story"
      className="relative h-[285svh] bg-[var(--foreground)]"
      aria-label="Trois repères d'échelle"
    >
      <div className="sr-only">
        <h2>Trois repères pour mesurer l'écart</h2>
        {scenes.map((scene) => (
          <p key={scene.label}>{scene.label} : {scene.value} {scene.unit}. {scene.sentence}</p>
        ))}
      </div>
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden bg-black [transform:translateZ(0)]">
        <motion.div style={{ scale: cameraScale }} className="absolute -inset-2 [transform:translateZ(0)] [will-change:transform]">
          {scenes.map((scene, index) => (
            <SceneLayer key={scene.label} scene={scene} index={index} progress={smoothProgress} />
          ))}
        </motion.div>

        <aside aria-hidden="true" className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 gap-5 lg:grid">
          {scenes.map((scene, index) => (
            <ChapterMarker key={scene.label} progress={smoothProgress} index={index} label={scene.label} />
          ))}
        </aside>

        <div aria-hidden="true" className="absolute inset-y-0 right-0 z-20 w-1 bg-white/10">
          <motion.div style={{ scaleY: smoothProgress }} className="h-full origin-top bg-[var(--accent)] [will-change:transform]" />
        </div>
      </div>
    </section>
  );
}
