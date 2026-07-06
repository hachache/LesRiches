"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatTinyPercentage } from "@/lib/formatters/numbers";

type FortuneFractionPieProps = {
  percentage: number;
  label?: string;
  size?: "sm" | "lg";
};

export function FortuneFractionPie({ percentage, label = "part de la fortune", size = "lg" }: FortuneFractionPieProps) {
  const reduce = useReducedMotion();
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const visiblePercentage = Math.min(Math.max(percentage, 0), 100);
  const strokeLength = Math.max((visiblePercentage / 100) * circumference, percentage > 0 ? 0.8 : 0);
  const dimensions = size === "lg" ? "h-56 w-56" : "h-36 w-36";

  return (
    <figure className={`relative ${dimensions}`} aria-label={`${formatTinyPercentage(percentage)} de ${label}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(17,16,14,0.12)" strokeWidth="16" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeLinecap="round"
          strokeWidth="16"
          strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
          initial={reduce ? false : { strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${strokeLength} ${circumference - strokeLength}` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <strong className="display-type text-3xl font-semibold leading-none text-[var(--accent)] md:text-4xl">
          {formatTinyPercentage(percentage)}
        </strong>
        <span className="mt-2 max-w-28 text-xs font-semibold uppercase leading-4 tracking-[0.08em] text-[var(--muted)]">
          {label}
        </span>
      </figcaption>
    </figure>
  );
}
